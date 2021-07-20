/**
 * Review Module routes
 */
const express = require("express");
const Review = require("../models/Review");

// Controllers
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

// Guard middleware
const { guard, accessRole } = require("../middlewares/auth");

// Advance middleware
const advanceQuery = require("../middlewares/advanceQuery");
const sortResults = require("../middlewares/sortResults");
const paginate = require("../middlewares/paginate");

// This router can be nested
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(advanceQuery(Review), sortResults, getReviews, paginate)
  .post(guard, accessRole("admin", "user"), createReview);

router
  .route("/:id")
  .get(getReview)
  .put(guard, accessRole("admin", "user"), updateReview)
  .delete(guard, accessRole("admin", "user"), deleteReview);

module.exports = router;
