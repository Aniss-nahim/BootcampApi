/**
 * Global Error Handler Middleware
 */
const ErrorApi = require('./ErrorApi');
const ValidationApi = require('./ValidationApi');

const errorHandler = (err, req, res, next) => {
    // find out error type
    
    // ValidationApi Instance error 
    if(err instanceof ValidationApi){
        return res.status(err.status).json({
            success : false,
            error : err.errors || err.message
        });
    }

    // ErrorApi Instance error
    if(err instanceof ErrorApi){
        return res.status(err.status).json({
            success : false,
            error : err.message
        });
    }

    // Error not defined
    res.status(500).json({
        success : false,
        error : 'Server Error'
    });
}

module.exports = errorHandler;