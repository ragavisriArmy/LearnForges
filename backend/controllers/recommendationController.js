const db = require('../config/db');

// Grab current AI engine outputs for user UI widgets
exports.getUserRecommendations = (req, res) => {
    const userId = req.user.id;
    const query = `SELECT * FROM recommendations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`;

    db.get(query, [userId], (err, recommendation) => {
        if (err) {
            return res.status(500).json({ message: "Failed to grab recommendations metrics data.", error: err.message });
        }
        res.status(200).json({
            status: "success",
            data: recommendation || { recommended_topic: "Beginner Fundamentals", reason: "Complete your initial platform lessons to run the AI engine execution loop." }
        });
    });
};

// Compile global telemetry indicators for individual student dashboards
exports.getStudentProgressTelemetry = (req, res) => {
    const userId = req.user.id;

    const userStatsQuery = `SELECT name, current_level, learning_score FROM users WHERE id = ?`;
    const progressCountQuery = `SELECT COUNT(*) as completed_count FROM progress WHERE user_id = ? AND is_completed = 1`;
    const quizCountQuery = `SELECT COUNT(*) as quizzes_count FROM quiz_results WHERE user_id = ?`;

    db.get(userStatsQuery, [userId], (err, user) => {
        if (err || !user) return res.status(500).json({ message: "Failed to pull user tracking records." });

        db.get(progressCountQuery, [userId], (err, progress) => {
            const completedLessonsCount = progress ? progress.completed_count : 0;

            db.get(quizCountQuery, [userId], (err, quizzes) => {
                const completedQuizzesCount = quizzes ? quizzes.quizzes_count : 0;

                res.status(200).json({
                    status: "success",
                    data: {
                        studentName: user.name,
                        currentLevel: user.current_level,
                        learningScore: user.learning_score,
                        totalQuizzesCompleted: completedQuizzesCount,
                        lessonsCompletedCount: completedLessonsCount
                    }
                });
            });
        });
    });
};