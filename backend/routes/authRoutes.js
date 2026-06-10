const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Clean endpoint hooks
router.post('/register', authController.register); // Final path: http://localhost:5000/api/auth/register
router.post('/login', authController.login);       // Final path: http://localhost:5000/api/auth/login

module.exports = router;