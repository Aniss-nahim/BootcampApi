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

// Guard middleware
const guard = require('../middlewares/auth');

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
).post(guard, createCourse);

router.route('/:id')
.get(getCourse)
.put(guard, updateCourse)
.delete(guard, deleteCourse);

module.exports = router;
