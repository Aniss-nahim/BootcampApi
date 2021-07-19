/**
 * Validation Api class
 */
const ErrorApi = require("./ErrorApi");

class ValidationApi extends ErrorApi {
  constructor(status, message, errors = {}) {
    super(status, message);
    this.errors = errors;
  }

  // Validation Error
  static Validate(err) {
    // defaults error server 500
    let message = "Server Error";
    let status = 500;
    let errors = {};

    // Mongoose Bad Object key
    if (err.name === "CastError") {
      return this.NotFound();
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      message = "Duplicate field value entered";
      status = 400;
      // get the errors
      for (const key in err.keyValue) {
        errors[
          key
        ] = `"${err.keyValue[key]}" has already been registered, please change the ${key}`;
      }
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      status = 400;
      let errorArray = Object.values(err.errors).map((val) => val.properties);
      errorArray.forEach((error) => {
        errors[error.path] = error.message;
      });
    }

    // no errors listed
    if (Object.keys(errors).length === 0) errors = null;

    return new ValidationApi(status, message, errors);
  }
}

module.exports = ValidationApi;
