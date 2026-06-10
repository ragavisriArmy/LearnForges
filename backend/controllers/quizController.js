const db = require('../config/db');

// Fetch assessment questions matching a lesson module
exports.getQuizByLesson = (req, res) => {
    const { lessonId } = req.params;

    const query = `
        SELECT q.id as quiz_id, q.title as quiz_title, qu.id as question_id, 
               qu.question_text, qu.option_a, qu.option_b, qu.option_c, qu.option_d
        FROM quizzes q
        JOIN questions qu ON q.id = qu.quiz_id
        WHERE q.lesson_id = ?
    `;

    db.all(query, [lessonId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Failed to load quiz metadata.", error: err.message });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: "No active quizzes mapped to this lesson module." });
        }

        // Restructure plain relational lines into an assignment object layout
        const formattedQuiz = {
            quizId: rows[0].quiz_id,
            title: rows[0].quiz_title,
            questions: rows.map(r => ({
                id: r.question_id,
                text: r.question_text,
                options: { A: r.option_a, B: r.option_b, C: r.option_c, D: r.option_d }
            }))
        };

        res.status(200).json({ status: "success", data: formattedQuiz });
    });
};

// Process answers payload, calculate percentage, and save progress
exports.submitQuiz = (req, res) => {
    const userId = req.user.id;
    const { quizId, answers } = req.body; // answers format: { questionId: "A", questionId2: "C" }

    if (!quizId || !answers) {
        return res.status(400).json({ message: "Invalid payload formatting structure." });
    }

    // Retrieve correct answers from database to evaluate scores securely
    const query = `SELECT id, correct_option FROM questions WHERE quiz_id = ?`;

    db.all(query, [quizId], (err, questions) => {
        if (err) {
            return res.status(500).json({ message: "Validation pipeline fault.", error: err.message });
        }

        let correctCount = 0;
        const totalQuestions = questions.length;

        questions.forEach(q => {
            if (answers[q.id] === q.correct_option) {
                correctCount++;
            }
        });

        // Compute direct performance profile
        const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

        // Record metrics to quiz_results tracking log
        const recordQuery = `INSERT INTO quiz_results (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)`;
        db.run(recordQuery, [userId, quizId, scorePercentage, totalQuestions], function(err) {
            if (err) {
                return res.status(500).json({ message: "Failed to record evaluation metrics.", error: err.message });
            }

            // Move forward to run recommendation updates via inline feedback calculations
            let generatedFeedback = "";
            let recommendedLevel = "Beginner";

            if (scorePercentage >= 80) {
                generatedFeedback = "Excellent retention! You have demonstrated core mastery here. Target subsequent advanced structural applications.";
                recommendedLevel = "Advanced";
            } else if (scorePercentage >= 50) {
                generatedFeedback = "Good intermediate comprehension. Spend time working on functional edge-case styles before proceeding.";
                recommendedLevel = "Intermediate";
            } else {
                generatedFeedback = "Reviewing fundamental principles is suggested. Re-read lesson materials and retry assessment logic steps.";
                recommendedLevel = "Beginner";
            }

            // Save the newly generated feedback to the database
            const recQuery = `INSERT INTO recommendations (user_id, recommended_topic, reason) VALUES (?, ?, ?)`;
            db.run(recQuery, [userId, recommendedLevel, generatedFeedback], (recErr) => {
                if (recErr) console.error("Non-blocking recommendation persistence fault:", recErr.message);
                
                // Update student summary statistics metrics parameters
                const userUpdateQuery = `UPDATE users SET current_level = ?, learning_score = learning_score + ? WHERE id = ?`;
                db.run(userUpdateQuery, [recommendedLevel, correctCount * 10, userId], (uErr) => {
                    if (uErr) console.error("User stats increment failure:", uErr.message);

                    res.status(200).json({
                        status: "success",
                        data: {
                            score: scorePercentage,
                            correctAnswers: correctCount,
                            totalQuestions,
                            evaluationRecommendation: generatedFeedback
                        }
                    });
                });
            });
        });
    });
};