/**
 * ErrorApi class for Managing Errors
 */
class ErrorApi extends Error{
    constructor(status, message){
        super(message);
        this.status = status;
    }

    // Bad request Error
    static BadRequest(message){
        return new ErrorApi(400, message);
    }

    // Not found Error
    static NotFound(){
        return new ErrorApi(404, 'Not Found');
    }

    // Unauthorized
    static UnAuthorized(message){
        return new ErrorApi(401, message);
    }

    // Internal Error
    static Internal(){
        return new ErrorApi(500, 'Server Error');
    }
}

module.exports = ErrorApi;