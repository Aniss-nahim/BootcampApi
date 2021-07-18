const User = require('../models/User');
const ErrorApi = require('../error/ErrorApi');
const asyncHandler = require('../middlewares/async');
const sendTokenResponse = require('../utils/sendTokenResponse');

/**
 * @desc Register user
 * @route POST api/v1/auth/register
 * @access Public
 */
exports.register = asyncHandler ( async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
});

/**
 * @desc Login user
 * @route POST api/v1/auth/login
 * @access Public
 */
 exports.login = asyncHandler ( async (req, res, next) => {
    const { email, password } = req.body;

    // validate email and password
    if(!email || !password){
        return next(ErrorApi.BadRequest('Please provide an email and password'));
    }

    // Check for user credentials
    const user = await User.findOne({ email : email });
    if(!user) {
        return next(ErrorApi.UnAuthorized('Invalid credentials'));
    }
    const passwdIsCorrect = await user.matchPassword(password);
    if(!passwdIsCorrect){
        return next(ErrorApi.UnAuthorized('Invalid credentials'));
    }

    sendTokenResponse(user, 200, res);
});

/**
 * @desc Get logged in user
 * @route GET api/v1/auth/me
 * @access Public
 */
 exports.getMe = asyncHandler ( async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200)
        .json({ success : true, data : user });
 });

 /**
 * @desc Forgot password
 * @route POST api/v1/auth/forgotpassword
 * @access Public
 */
  exports.forgotPassword = asyncHandler ( async (req, res, next) => { 
    const user = await User.findOne({email : req.body.email});
    if(!user){
        return next(ErrorApi.NotFound());
    }

    const resetToken = await user.getResetPasswordToken();

    console.log(resetToken);

    await user.save({ validateBeforeSave : false });

    res.status(200)
        .json({ success : true, data : user });
 });