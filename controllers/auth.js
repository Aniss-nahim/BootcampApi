const User = require('../models/User');
const ErrorApi = require('../error/ErrorApi');
const asyncHandler = require('../middlewares/async');

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

    // Generat Token
    const token = user.getSignedJWT();

    // return jwt 
    res.status(201)
        .json({success : true,  token});
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

    // Generat Token
    const token = user.getSignedJWT();

    // return jwt 
    res.status(201)
        .json({success : true,  token});
});