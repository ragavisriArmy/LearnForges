const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, recommendationController.getUserRecommendations);
router.get('/telemetry', verifyToken, recommendationController.getStudentProgressTelemetry);

module.exports = router;