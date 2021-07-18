const User = require('../models/User');
const asyncHandler = require('./async');
const ErrorApi = require('../error/ErrorApi');
const jwt = require('jsonwebtoken');

exports.guard = asyncHandler ( async (req, res, next) => {
    // check the authorized header property
    const { authorization } = req.headers;
    let token;

    // check-in token herders or signedCookies
    if(authorization && authorization.startsWith('Bearer')){
        token = authorization.split(' ')[1];
    }else if (req.signedCookies.token){
        token = req.signedCookies.token;
    }

    // verify token
    try{
        const decodedPyload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = await User.findById(decodedPyload.id);
    }catch(err){
        return next(ErrorApi.UnAuthorized('Not authorize to access this route'));
    }
    next();
});

exports.accessRole = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)){
        return next(ErrorApi.Forbidden(`User role ${req.user.role} is unauthorized for accessing this route`));
    }
    next();
}