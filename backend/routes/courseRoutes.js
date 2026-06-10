const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const verifyToken = require('../middleware/authMiddleware');

// Mount operational routes
router.get('/', verifyToken, courseController.getCourses);
router.get('/:courseId/lessons', verifyToken, courseController.getLessonsByCourse);
router.get('/lessons/:lessonId', verifyToken, courseController.getLessonDetails);
router.post('/lessons/complete', verifyToken, courseController.completeLesson);

module.exports = router;