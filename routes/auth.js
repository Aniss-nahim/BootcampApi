const express = require('express');
const { 
    register, 
    login, 
    getMe 
} = require('../controllers/auth');

// Guard middleware
const { guard } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', guard, getMe);

module.exports = router;