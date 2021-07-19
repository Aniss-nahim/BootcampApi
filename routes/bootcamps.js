/**
 * Bootcamp Module routes
 */
const express = require("express");

// Model
const Bootcamp = require("../models/Bootcamp");

// Controllers
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  uploadBootcampPhoto,
} = require("../controllers/bootcamps");

// Guard middleware
const { guard, accessRole } = require("../middlewares/auth");

// Advance middleware
const paginate = require("../middlewares/paginate");
const advanceQuery = require("../middlewares/advanceQuery");
const sortResults = require("../middlewares/sortResults");

// Include other resource routers
const courseRouter = require("../routes/courses");

const router = express.Router();

// Re-route into other resource
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/radius/:zipcode/:distance/:unit(km|mi)?")
  .get(getBootcampInRadius);

router
  .route("/") // prefix
  .get(advanceQuery(Bootcamp), sortResults, getBootcamps, paginate)
  .post(guard, accessRole("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(guard, accessRole("publisher", "admin"), updateBootcamp)
  .delete(guard, accessRole("publisher", "admin"), deleteBootcamp);

router
  .route("/:id/photo")
  .put(guard, accessRole("publisher", "admin"), uploadBootcampPhoto);

module.exports = router;
