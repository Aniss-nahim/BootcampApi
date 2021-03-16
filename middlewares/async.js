const ValidationApi = require("../error/ValidationApi")

/**
 * DRY Principal eliminate try/catch
 * By rapping the middleware inside a promise function
 */
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch( err => next(ValidationApi.Validate(err)));
}

module.exports = asyncHandler;