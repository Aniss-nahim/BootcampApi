/**
 * Course Model
 * @Schema CourseSchema
 */
const mongoose = require('mongoose');
const CourseSchema = require('../database/schemas/CourseSchema');

module.exports = mongoose.model('Course', CourseSchema);