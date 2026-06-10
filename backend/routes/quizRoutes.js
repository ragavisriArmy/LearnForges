const express = require('express');
const router = express.Router();
const db = require('../config/db');

// FETCH ALL SEEDED TRACKS
router.get('/courses', (req, res) => {
    db.all("SELECT * FROM courses", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ status: "success", courses: rows });
    });
});

// FETCH RANDOMIZED QUESTIONS FOR TRACK
router.get('/questions/:courseId', (req, res) => {
    const { courseId } = req.params;
    db.all("SELECT id, question, options FROM quizzes WHERE course_id = ? ORDER BY RANDOM()", [courseId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const parsed = rows.map(row => ({ ...row, options: JSON.parse(row.options) }));
        res.status(200).json({ status: "success", quizzes: parsed });
    });
});

// SUBMIT METRICS EVALUATION TRACK ROWS
router.post('/submit', (req, res) => {
    const { userId, courseId, selectedAnswers } = req.body;
    db.all("SELECT id, correct_answer FROM quizzes WHERE course_id = ?", [courseId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        let score = 0;
        const totalQuestions = rows.length;

        rows.forEach(q => {
            if (selectedAnswers[q.id] !== undefined) {
                if (selectedAnswers[q.id] === q.correct_answer) score += 1;
            }
        });

        db.run("INSERT INTO quiz_attempts (user_id, course_id, score, total_questions) VALUES (?, ?, ?, ?)", 
            [userId, courseId, score, totalQuestions], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                db.run("UPDATE users SET learning_score = learning_score + ? WHERE id = ?", [score * 10, userId], () => {
                    res.status(200).json({ status: "success", score, totalQuestions });
                });
        });
    });
});

// EXTENDED DATA METRICS BY CATEGORY & HISTORY BREAKDOWN
router.get('/stats/:userId', (req, res) => {
    const { userId } = req.params;
    
    db.all("SELECT score, total_questions FROM quiz_attempts WHERE user_id = ?", [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const totalAttempts = rows.length;
        if (totalAttempts === 0) return res.status(200).json({ totalAttempts: 0, averageAccuracy: 0, categoryBreakdown: [], historyLog: [] });

        let totalCorrect = 0, totalQ = 0;
        rows.forEach(r => { totalCorrect += r.score; totalQ += r.total_questions; });

        db.all(`SELECT c.category, SUM(qa.score) as correct, SUM(qa.total_questions) as total, COUNT(qa.id) as trackAttempts
                FROM quiz_attempts qa JOIN courses c ON qa.course_id = c.id 
                WHERE qa.user_id = ? GROUP BY c.category`, [userId], (err, catRows) => {
            
            db.all(`SELECT qa.score, qa.total_questions, qa.attempted_at, c.title, c.category 
                    FROM quiz_attempts qa JOIN courses c ON qa.course_id = c.id 
                    WHERE qa.user_id = ? ORDER BY qa.attempted_at DESC`, [userId], (err, historyRows) => {
                
                res.status(200).json({
                    totalAttempts,
                    averageAccuracy: Math.round((totalCorrect / totalQ) * 100),
                    categoryBreakdown: catRows || [],
                    historyLog: historyRows || []
                });
            });
        });
    });
});

// GLOBAL CAMPUS LEADERBOARD
router.get('/leaderboard', (req, res) => {
    db.all("SELECT name, learning_score FROM users ORDER BY learning_score DESC LIMIT 5", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ status: "success", leaderboard: rows });
    });
});

// ADMIN FORM INSERT
router.post('/admin/create-quiz', (req, res) => {
    const { title, description, category, question, options, correct_answer } = req.body;
    
    db.run("INSERT INTO courses (title, description, category) VALUES (?, ?, ?)", [title, description, category], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        const newCourseId = this.lastID;
        
        db.run("INSERT INTO quizzes (course_id, question, options, correct_answer) VALUES (?, ?, ?, ?)",
            [newCourseId, question, JSON.stringify(options), correct_answer], function(quizErr) {
                if (quizErr) return res.status(500).json({ error: quizErr.message });
                res.status(201).json({ status: "success", message: "Admin custom module inserted successfully!" });
        });
    });
});

module.exports = router;