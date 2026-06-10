const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../database.sqlite');

if (fs.existsSync(dbPath)) {
    try {
        fs.unlinkSync(dbPath);
        console.log("✔ Synchronizing relational models for advanced profile metrics analytics...");
    } catch (err) {
        console.log("Database file busy, writing structural updates directly...");
    }
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Database initialization fault:", err.message);
    else console.log("✔ SQLite Core Engine connected successfully.");
});

db.serialize(() => {
    // 1. Users Matrix Schema
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        current_level TEXT DEFAULT 'Beginner',
        learning_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Relational Courses Table
    db.run(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL
    )`);

    // 3. Quizzes Table
    db.run(`CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER,
        question TEXT NOT NULL,
        options TEXT NOT NULL, 
        correct_answer TEXT NOT NULL,
        FOREIGN KEY (course_id) REFERENCES courses(id)
    )`);

    // 4. Performance Metrics Analytics Table
    db.run(`CREATE TABLE IF NOT EXISTS quiz_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        course_id INTEGER,
        score INTEGER,
        total_questions INTEGER,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
    )`);

    // Seeding default systems data parameters
    db.get("SELECT COUNT(*) as count FROM courses", [], (err, row) => {
        if (row && row.count === 0) {
            const insertCourse = db.prepare("INSERT INTO courses (title, description, category) VALUES (?, ?, ?)");
            insertCourse.run("Introduction to Database Architectures (SQLite & MongoDB)", "Master full-stack document structures, structural modeling, relational indexes, and local clusters.", "Backend Engineering");
            insertCourse.run("UI/UX Mobile Interface Design", "Learn professional text styling, asset arrangement, background color contrasting, and buttons using Canva.", "UI/UX Design");
            insertCourse.run("Python Web Frameworks & Data Visualization", "Build robust backend servers with Django and create interactive live dashboards using Plotly Dash.", "Full-Stack Development");
            insertCourse.finalize();

            // Aligned perfectly with 4 placeholder values
            const insertQuiz = db.prepare("INSERT INTO quizzes (course_id, question, options, correct_answer) VALUES (?, ?, ?, ?)");
            
            // Course 1 Quizzes
            insertQuiz.run(1, "Which MongoDB mechanism distributes data across multiple servers/clusters?", JSON.stringify(["Replication", "Sharding", "Indexing", "Aggregating"]), "Sharding");
            insertQuiz.run(1, "What type of database structure model does MongoDB utilize?", JSON.stringify(["Relational Tables", "Key-Value Pairs", "BSON Documents", "Graph Nodes"]), "BSON Documents");
            insertQuiz.run(1, "In an SQLite engine, which keyword automatically sets a unique incrementing integer ID?", JSON.stringify(["AUTOINCREMENT", "SERIAL", "SEQUENCE", "NEXTVAL"]), "AUTOINCREMENT");
            
            // Course 2 Quizzes
            insertQuiz.run(2, "When designing a mobile mockup interface screen in Canva, what is the best practice for button placement?", JSON.stringify(["Hidden inside menus", "Within natural thumb reach at the bottom", "Top-left corner entry", "Small unclickable text labels"]), "Within natural thumb reach at the bottom");
            insertQuiz.run(2, "Which format provides a lossless presentation asset download from Canva for digital mockups?", JSON.stringify(["Low-res JPG", "Standard PDF", "High-quality PNG", "Raw SVG Vector Outline"]), "High-quality PNG");
            
            // Course 3 Quizzes
            insertQuiz.run(3, "Which Python framework is specifically optimized for building reactive analytical web apps with pure Python graphics?", JSON.stringify(["Flask", "Plotly Dash", "FastAPI", "Bottle"]), "Plotly Dash");
            insertQuiz.run(3, "In Django's architectural pattern, where do you write the logic to fetch data models and render them?", JSON.stringify(["views.py", "urls.py", "settings.py", "manage.py"]), "views.py");
            insertQuiz.finalize();

            // Seed Competitors
            const insertUser = db.prepare("INSERT INTO users (name, email, password, learning_score) VALUES (?, ?, ?, ?)");
            insertUser.run("M. Ragavisri", "ragavi@forge.edu", "hashed_123", 120);
            insertUser.run("Sanjay Kumar", "sanjay@forge.edu", "hashed_123", 80);
            insertUser.run("Abinaya R", "abi@forge.edu", "hashed_123", 40);
            insertUser.finalize();

            console.log("✔ Multi-track system data arrays and campus networks fully initialized.");
        }
    });
});

module.exports = db;