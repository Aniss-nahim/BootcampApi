/**
 * Course Module routes
 */
const express = require('express');

// Controllers
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');

// pagination middleware
const paginate = require('../middlewares/paginate');

// This router can be nested
const router = express.Router({ mergeParams : true });

router.route('/')
.get(getCourses)
.post(createCourse);

router.route('/:id')
.get(getCourse)
.put(updateCourse)
.delete(deleteCourse);

module.exports = router;
