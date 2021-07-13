/**
 * Course Module routes
 */
const express = require('express');
const Course = require('../models/Course');

// Controllers
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');

// Advance middleware
const advanceQuery = require('../middlewares/advanceQuery');
const sortResults = require('../middlewares/sortResults');
const paginate = require('../middlewares/paginate');

// This router can be nested
const router = express.Router({ mergeParams : true });

router.route('/')
.get(
    advanceQuery(Course),
    sortResults,
    getCourses,
    paginate
).post(createCourse);

router.route('/:id')
.get(getCourse)
.put(updateCourse)
.delete(deleteCourse);

module.exports = router;
