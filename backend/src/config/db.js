const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file path
const dbPath = path.join(__dirname, "../../database.sqlite");

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {

    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("SQLite database connected successfully.");

        // Create certificates table
        db.run(`
            CREATE TABLE IF NOT EXISTS certificates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                certificateId TEXT UNIQUE NOT NULL,
                recipientName TEXT NOT NULL,
                course TEXT NOT NULL,
                documentHash TEXT NOT NULL,
                txHash TEXT NOT NULL,
                revoked INTEGER DEFAULT 0,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error("Error creating certificates table:", err.message);
            } else {
                console.log("Certificates table ready.");
            }
        });
    }
});

module.exports = db;