const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Name is required'],
    },
    email: {
        type: String,
        required : [true, 'Email is required'],
        unique : true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
    },
    role : {
        type :String,
        enum : ['user', 'publisher'],
        default : 'user'
    },
    password : {
        type : String,
        required : [true, 'Password is required'],
        minlength : 6,
        select : true
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    createdAt : {
        type : Date,
        default : Date.now
    }
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Generate a JWT from Authenticated users
UserSchema.methods.getSignedJWT = function(){
    return jwt.sign({id : this._id}, process.env.JWT_PRIVATE_KEY, {
        expiresIn : process.env.JWT_EXPIRES_KEY
    });
}

// Check for match user password entred
UserSchema.methods.matchPassword = async function(passwd) {
    return await bcrypt.compare(passwd, this.password);
}

module.exports = UserSchema;