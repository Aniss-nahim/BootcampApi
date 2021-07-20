/**
 * Review Model
 * @Schema ReviewSchema
 */
const mongoose = require("mongoose");
const ReviewSchema = require("../database/schemas/ReviewSchema");

module.exports = mongoose.model("Review", ReviewSchema);
