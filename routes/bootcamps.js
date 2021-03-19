const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampInRadius    
} = require('../controllers/bootcamps');
const paginate = require('../middlewares/paginate');
const router = express.Router();

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