const User = require("../models/User");
const ErrorApi = require("../error/ErrorApi");
const asyncHandler = require("../middlewares/async");
const sendTokenResponse = require("../utils/sendTokenResponse");

/**
 * @desc Get users
 * @route GET api/v1/users
 * @access Private admin only
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  let { query } = res.locals;
  let total = await User.countDocuments();

  // get users
  if (!req.query.paginate || JSON.parse(req.query.paginate) !== true) {
    const users = await query;
    return res
      .status(200)
      .json({ success: true, count: users.length, data: users });
  }

  res.locals = { query, total };
  next();
});

/**
 * @desc Get user
 * @route GET api/v1/users/:id
 * @access Private admin only
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(ErrorApi.NotFound());
  }

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Create user
 * @route POST api/v1/users
 * @access Private admin only
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  if (!user) {
    return next(ErrorApi.NotFound());
  }

  res.status(201).json({ success: true, data: user });
});

/**
 * @desc Update user deatails
 * @route PUT api/v1/users/:id
 * @access Private admin only
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(ErrorApi.NotFound());
  }

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Update user password
 * @route PUT api/v1/users/:id/password
 * @access Private admin only
 */
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(ErrorApi.NotFound());
  }
  // updating password
  user.password = req.body.password;
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

/**
 * @desc Deelete user
 * @route DELETE api/v1/users/:id
 * @access Private admin only
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(ErrorApi.NotFound());
  }

  await user.remove();

  res.status(200).json({ success: true, data: user });
});
