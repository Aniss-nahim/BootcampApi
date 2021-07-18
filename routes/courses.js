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
const { guard, accessRole } = require('../middlewares/auth');

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
).post(guard, accessRole('publisher', 'admin'), createCourse);

router.route('/:id')
.get(getCourse)
.put(guard, accessRole('publisher', 'admin'), updateCourse)
.delete(guard, accessRole('publisher', 'admin'), deleteCourse);

module.exports = router;
