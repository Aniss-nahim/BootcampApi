/**
 * Course database Schema
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Course title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  weeks: {
    type: String,
    required: [true, "Duration is required"],
  },
  tuition: {
    type: Number,
    required: [true, "Tuition cost is required"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Minimum skill is required"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Calc Averadge of Course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    { $group: { _id: "$bootcamp", averageCost: { $avg: "$tuition" } } },
  ]);
  // save the averageCost into Bootcamp collection
  await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
    averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
  });
};

// Call getAverageCost after save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// call getAverageCost after remove
CourseSchema.post("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = CourseSchema;
