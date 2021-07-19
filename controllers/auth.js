const User = require("../models/User");
const ErrorApi = require("../error/ErrorApi");
const crypto = require("crypto");
const asyncHandler = require("../middlewares/async");
const sendTokenResponse = require("../utils/sendTokenResponse");
const sendEmail = require("../utils/sendEmail");

/**
 * @desc Register user
 * @route POST api/v1/auth/register
 * @access Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

/**
 * @desc Login user
 * @route POST api/v1/auth/login
 * @access Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(ErrorApi.BadRequest("Please provide an email and password"));
  }

  // Check for user credentials
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(ErrorApi.UnAuthorized("Invalid credentials"));
  }
  const passwdIsCorrect = await user.matchPassword(password);
  if (!passwdIsCorrect) {
    return next(ErrorApi.UnAuthorized("Invalid credentials"));
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @desc Get logged in user
 * @route GET api/v1/auth/me
 * @access Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Reset password
 * @route PUT api/v1/auth/resetpassword/:resettoken
 * @access Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gte: Date.now() },
  });

  if (!user) {
    return next(ErrorApi.NotFound("Invalide token"));
  }

  // set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @desc Forgot password
 * @route POST api/v1/auth/forgotpassword
 * @access Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(ErrorApi.NotFound());
  }

  const resetToken = await user.getResetPasswordToken();
  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are reciving this email because you (or someone else) has requested the reset of a password, Please make a PUT request to : \n\n ${resetUrl} to change your password`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(ErrorApi.Internal());
  }
});
