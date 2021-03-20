/**
 * Course database Schema
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Course title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  weeks: {
    type: String,
    required: [true, 'Duration is required']
  },
  tuition: {
    type: Number,
    required: [true, 'Tuition cost is required']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Minimum skill is required'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
});


module.exports = CourseSchema;