/**
 * User Model
 * @Schema UserSchema
 */
const mongoose = require('mongoose');
const UserSchema = require('../database/schemas/UserSchema');

module.exports = mongoose.model('User', UserSchema);