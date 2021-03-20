/**
 * Bootcamp Module routes
 */
const express = require('express');

// Controllers
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampInRadius    
} = require('../controllers/bootcamps');

// Pagination middleware
const paginate = require('../middlewares/paginate');

// Include other resource routers
const courseRouter = require('../routes/courses');

const router = express.Router();

// Re-route into other resource
router.use('/:bootcampId/courses', courseRouter);

router
    .route('/radius/:zipcode/:distance/:unit(km|mi)?')
    .get(getBootcampInRadius);

router
 .route('/') // prefix
 .get(getBootcamps, paginate)
 .post(createBootcamp);

router
 .route('/:id')
 .get(getBootcamp)
 .put(updateBootcamp)
 .delete(deleteBootcamp);

module.exports = router;