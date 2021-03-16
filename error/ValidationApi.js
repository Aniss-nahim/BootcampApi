/**
 * Validation Api class
 */
const ErrorApi = require('./ErrorApi');

class ValidationApi extends ErrorApi{
    constructor(status, message, errors = {}){
        super(status, message);
        this.errors = errors;
    }

    // Validation Error
    static Validate(err){
        let message = '';
        let errors= {};
        
        // Mongoose Bad Object key
        if(err.name ==='CastError'){
            console.log("hello from VlidationApi")
            return this.NotFound();
        }

        // Mongoose duplicate key error
        if(err.code === 11000){
            message = 'Duplicate field value entered';
            // get the errors
            for(const key in err.keyValue){
                errors[key] = `"${err.keyValue[key]}" has already been registered, please change the ${key}`;
            }
        }

        // Mongoose validation error
        if(err.name === 'ValidationError'){
            let errorArray = Object.values(err.errors).map(val => val.properties);
            errorArray.forEach(error => {
                errors[error.path] = error.message;
            });
        }
        
        return new ValidationApi(400, message, errors);
    }
} 

module.exports = ValidationApi;