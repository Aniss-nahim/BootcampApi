/**
 * Course Model
 * @Schema CourseSchema
 */
const mongoose = require("mongoose");
const CourseSchema = require("../database/schemas/CourseSchema");

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

module.exports = mongoose.model("Course", CourseSchema);
