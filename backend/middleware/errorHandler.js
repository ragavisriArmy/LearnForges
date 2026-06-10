// Global catch-all middleware for processing application exceptions
const errorHandler = (err, req, res, next) => {
    console.error("❌ BACKEND ERROR TRACKER LOG:", err.stack);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        message: err.message || "An unexpected system fault occurred on the LearnForge processing server."
    });
};

module.exports = errorHandler;