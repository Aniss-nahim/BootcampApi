/**
 * Bootcamp Model
 * @Schema BootcampSchema
 */
const mongoose = require('mongoose');
const BootcampSchema = require('../database/schemas/BootcampSchema');

module.exports = mongoose.model('Bootcamp', BootcampSchema);