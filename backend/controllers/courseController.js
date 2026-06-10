const db = require('../config/db');

// Fetch all available course offerings
exports.getCourses = (req, res) => {
    const query = `SELECT * FROM courses ORDER BY difficulty ASC`;
    db.all(query, [], (err, courses) => {
        if (err) {
            return res.status(500).json({ message: "Failed to load courses database records.", error: err.message });
        }
        res.status(200).json({ status: "success", data: courses });
    });
};

// Fetch all lessons linked to a specific course
exports.getLessonsByCourse = (req, res) => {
    const courseId = req.params.courseId;
    const query = `SELECT id, course_id, title, order_index FROM lessons WHERE course_id = ? ORDER BY order_index ASC`;
    
    db.all(query, [courseId], (err, lessons) => {
        if (err) {
            return res.status(500).json({ message: "Failed to load lessons data.", error: err.message });
        }
        res.status(200).json({ status: "success", data: lessons });
    });
};

// Fetch details for a standalone individual lesson
const runGetLessonDetails = (req, res) => {
    const lessonId = req.params.lessonId;
    const query = `SELECT * FROM lessons WHERE id = ?`;

    db.get(query, [lessonId], (err, lesson) => {
        if (err) {
            return res.status(500).json({ message: "Error locating lesson instance.", error: err.message });
        }
        if (!lesson) {
            return res.status(404).json({ message: "The requested lesson could not be found." });
        }
        res.status(200).json({ status: "success", data: lesson });
    });
};
exports.getLessonDetails = runGetLessonDetails;

// Telemetry tracker: Mark a lesson unit as complete for a student user
exports.completeLesson = (req, res) => {
    const userId = req.user.id; // Harvested straight from decrypted verifyToken middleware
    const { lessonId } = req.body;

    if (!lessonId) {
        return res.status(400).json({ message: "lessonId parameter is required." });
    }

    const query = `INSERT INTO progress (user_id, lesson_id, is_completed) VALUES (?, ?, 1)
                   ON CONFLICT(user_id, lesson_id) DO UPDATE SET is_completed=1, updated_at=CURRENT_TIMESTAMP`;

    db.run(query, [userId, lessonId], function(err) {
        if (err) {
            return res.status(500).json({ message: "Failed to update progression metrics.", error: err.message });
        }
        res.status(200).json({ status: "success", message: "Lesson tracking marked as complete." });
    });
};