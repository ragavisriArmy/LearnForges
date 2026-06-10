const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

// Import route modules safely
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');

dotenv.config();
const app = express();

// Global Middleware Configuration
app.use(cors());
app.use(express.json());

// Bind Global Route Pathways
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Global Health Verification Route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "All LearnForge core REST APIs and interceptors mounted successfully."
    });
});

// Fallback Route for handling typos or missing endpoints
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: `The route ${req.originalUrl} does not exist on this backend server.`
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  LearnForge Server running in development mode`);
    console.log(`  Listening on active network Port: ${PORT}`);
    console.log(`===============================================`);
});