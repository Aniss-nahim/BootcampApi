const Course = require('../models/Course');
const ErrorApi = require('../error/ErrorApi');
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');

/**
 * @desc Get all courses
 * @route GET api/v1/courses
 * @router GET api/v1/bootcamps/:bootcampId/courses
 * @access Public
 */
exports.getCourses = asyncHandler( async(req, res, next) => {
    let query;

    // get courses of a bootcamp
    if(req.params.bootcampId){
        query = Course.find( {bootcamp : req.params.bootcampId} );
    }else{
        query = Course.find().populate('bootcamp', 'name description careers');
    }
    const courses = await query;

    res.status(200)
    .json({ success : true, count : courses.length, data:courses});
});

/**
 * @desc Get single course
 * @route GET api/v1/courses/:id
 * @access Public
 */
exports.getCourse = asyncHandler( async(req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select : 'name description'
    });

    if(!course){
        return next(ErrorApi.NotFound());
    }

    res.status(200)
    .json({ success : true, data: course});
});

/**
 * @desc Add new course
 * @route POST api/v1/bootcamps/:bootcampId/courses
 * @access Private
 */
exports.createCourse = asyncHandler( async(req, res, next) => {
    // Get bootcamp id
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    
    if(!bootcamp){
        return next(ErrorApi.NotFound());
    }
    // set bootcamp value on the body request Object
    req.body.bootcamp = req.params.bootcampId;
    const course = await Course.create(req.body);

    res.status(201)
    .json({ success: true, data : course});
});

/**
 * @desc Update a course
 * @route PUT api/v1/courses/:id
 * @access Private
 */
exports.updateCourse = asyncHandler( async(req, res, next) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new : true, // to return the new version
        runValidators: true
    });

    if(!course){
        return next(ErrorApi.NotFound());
    }
    res.status(200).json({ success : true, data: course});
});

/**
 * @desc Delete a course
 * @route DELETE api/v1/courses/:id
 * @access Private
 */
exports.deleteCourse = asyncHandler( async(req, res, next) => {
    const course = await Course.findById(req.params.id);
    if(!course){
        return next(ErrorApi.NotFound());
    }
    // remove the course
    await course.remove();
    
    res.status(204).json({ success: true, message: "Course deleted"});
});