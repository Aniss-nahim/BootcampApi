/**
 * Bootcamp Model
 * @Schema BootcampSchema
 */
const mongoose = require("mongoose");
const BootcampSchema = require("../database/schemas/BootcampSchema");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

// Generate slug before saving bootcamp
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocoder generator
BootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
  next();
});

// Cascade delete for courses
BootcampSchema.pre("remove", async function (next) {
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

// Virtual courses propertie
// Later Courses should be sorted by createdAt field
BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  // justOne : true // default is false
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
