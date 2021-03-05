/**
 * @desc Logs request to console
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 */
const logger = (req, res, next)=>{
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}

module.exports = logger;