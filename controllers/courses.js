const Course = require("../models/Course");
const ErrorApi = require("../error/ErrorApi");
const asyncHandler = require("../middlewares/async");
const Bootcamp = require("../models/Bootcamp");

/**
 * @desc Get all courses
 * @route GET api/v1/courses
 * @router GET api/v1/bootcamps/:bootcampId/courses
 * @access Public
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  let { query } = res.locals;
  let total = await Course.countDocuments();

  // get courses of a bootcamp
  if (req.params.bootcampId) {
    query = query.where("bootcamp").equals(req.params.bootcampId);
    total = await Course.countDocuments({ bootcamp: req.params.bootcampId });
  } else {
    query = query.populate("bootcamp", "name description careers");
  }

  if (!req.query.paginate || JSON.parse(req.query.paginate) !== true) {
    const courses = await query;
    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  }

  res.locals = { query, total };
  next();
});

/**
 * @desc Get single course
 * @route GET api/v1/courses/:id
 * @access Public
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(ErrorApi.NotFound());
  }

  res.status(200).json({ success: true, data: course });
});

/**
 * @desc Add new course
 * @route POST api/v1/bootcamps/:bootcampId/courses
 * @access Private
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
  // Get bootcamp id
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(ErrorApi.NotFound());
  }

  // check ownership and permission
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return ErrorApi.Forbidden(
      `User with ID ${req.user.id} is unauthorized to add courses to this bootcamp`
    );
  }

  // set bootcamp and user value on the body request Object
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const course = await Course.create(req.body);

  res.status(201).json({ success: true, data: course });
});

/**
 * @desc Update a course
 * @route PUT api/v1/courses/:id
 * @access Private
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(ErrorApi.NotFound());
  }

  // check ownership and permission
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return ErrorApi.Forbidden(
      `User with ID ${req.user.id} is unauthorized to update this course`
    );
  }

  course.user = req.user.id;

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // to return the new version
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

/**
 * @desc Delete a course
 * @route DELETE api/v1/courses/:id
 * @access Private
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(ErrorApi.NotFound());
  }

  // check ownership and permission
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return ErrorApi.Forbidden(
      `User with ID ${req.user.id} is unauthorized to delete this course`
    );
  }

  // remove the course
  await course.remove();

  res.status(204).json({ success: true, message: "Course deleted" });
});
