const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
const ErrorApi = require("../error/ErrorApi");
const asyncHandler = require("../middlewares/async");

/**
 * @desc Get all reviews
 * @route GET api/v1/reviews
 * @router GET api/v1/bootcamps/:bootcampId/reviews
 * @access Public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  let { query } = res.locals;
  let total = await Review.countDocuments();

  // get reviews from a bootcamp
  if (req.params.bootcampId) {
    query = query.where("bootcamp").equals(req.params.bootcampId);
    total = await Review.countDocuments({ bootcamp: req.params.bootcampId });
  } else {
    query = query.populate("bootcamp", "name description careers");
  }

  if (!req.query.paginate || JSON.parse(req.query.paginate) !== true) {
    const reviews = await query;
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  }

  res.locals = { query, total };
  next();
});

/**
 * @desc Get single review
 * @route GET api/v1/reviews/:id
 * @access Public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate("bootcamp", "name description careers")
    .populate("user", "name email");

  if (!review) {
    return next(ErrorApi.NotFound());
  }

  res.status(200).json({ success: true, data: review });
});

/**
 * @desc Create review
 * @route POST api/v1/bootcamps/:bootcampId/reviews
 * @access Private user and admin only
 */
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(ErrorApi.NotFound());
  }

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

/**
 * @desc Update review
 * @route PUT api/v1/reviews/:id
 * @access Private user and admin only
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(ErrorApi.NotFound());
  }

  if (req.user.id !== review.user.toString()) {
    return next(
      ErrorApi.Forbidden(
        `User with ID ${req.user.id} is unauthorized for updating this review`
      )
    );
  }

  review.user = req.user.id;

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

/**
 * @desc Delete review
 * @route PUT api/v1/reviews/:id
 * @access Private
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return newt(ErrorApi.NotFound());
  }

  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    return next(
      ErrorApi.Forbidden(
        `User with ID ${req.user.id} is unauthorized for deleting this review`
      )
    );
  }

  await review.remove();

  res.status(204).json({ success: true, data: "Review deleted" });
});
