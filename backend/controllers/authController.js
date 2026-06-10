const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create new user account registration block
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ status: "error", message: "Please provide a name, email, and password." });
    }

    try {
        // Securely hash user passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        
        db.run(query, [name, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({ status: "error", message: "An account with this email already exists." });
                }
                return res.status(500).json({ status: "error", message: "Database failure during registration.", details: err.message });
            }
            res.status(201).json({ status: "success", message: "User account created successfully!" });
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server encryption fault." });
    }
};

// Log existing users into their dashboards
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "Please provide both email and password." });
    }

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Database server lookup fault." });
        }
        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid email or password credentials." });
        }

        // Verify hash parameters match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "Invalid email or password credentials." });
        }

        // Issue global security token passport
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret_key_backup',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: "success",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
};