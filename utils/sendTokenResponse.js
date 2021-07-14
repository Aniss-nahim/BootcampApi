/**
 * Generate a JWT, configure signed cookie then send response
 */
const sendTokenResponse = (user, status, res) => {
    // Generate a Token
    const token = user.getSignedJWT();

    const options = {
        httpOnly : true,
        expires : new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        secure : process.env.NODE_ENV === 'production',
        signed : true
    }

    res.cookie('token', token, options)
        .status(status)
        .json({ success : true, token })
}

module.exports = sendTokenResponse;