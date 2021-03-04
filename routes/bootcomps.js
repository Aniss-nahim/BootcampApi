const express = require('express');
const {
    getBootcomps,
    getBootcomp,
    createBootcomp,
    updateBootcomp,
    deleteBootcomp    
} = require('../controllers/bootcomps');
const router = express.Router();

router
 .route('/')
 .get(getBootcomps)
 .post(createBootcomp);

router
 .route('/:id')
 .get(getBootcomp)
 .put(updateBootcomp)
 .delete(deleteBootcomp);

module.exports = router;