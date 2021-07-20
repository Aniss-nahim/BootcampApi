/**
 * User Model
 * @Schema UserSchema
 */
const mongoose = require("mongoose");
const UserSchema = require("../database/schemas/UserSchema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Encrypt password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate a JWT from Authenticated users
UserSchema.methods.getSignedJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRES_KEY,
  });
};

// Check for match user password entred
UserSchema.methods.matchPassword = async function (passwd) {
  return await bcrypt.compare(passwd, this.password);
};

// generate a hashed password token
UserSchema.methods.getResetPasswordToken = async function () {
  // random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the random token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // set expire reset Password token
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
