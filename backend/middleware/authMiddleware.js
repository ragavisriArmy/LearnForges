// 1. Core Module Import
const jwt = require('jsonwebtoken');

// 2. Authentication Verification Middleware Function
const verifyToken = (req, res, next) => {
    // Look for the token inside the incoming request headers
    const authHeader = req.headers['authorization'];
    
    // Check if the header exists and begins with the word 'Bearer '
    const token = authHeader && authHeader.split(' ')[1];

    // If there is no token present, deny access immediately
    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "Access Denied: No authentication token provided."
        });
    }

    try {
        // Verify the token using our secret key from the .env file
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Inject the decoded user information directly into the request object
        req.user = verified;
        
        // Pass control to the next controller function in line
        next();
    } catch (err) {
        // If token has expired or been altered, reject it
        return res.status(403).json({
            status: "error",
            message: "Authentication failed: Token is invalid or expired."
        });
    }
};

// 3. Export the Middleware Module
module.exports = verifyToken;