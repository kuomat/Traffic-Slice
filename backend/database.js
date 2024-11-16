const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database opened successfully');
    }
});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS data (
        error_id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_from TEXT NOT NULL,
        application_to TEXT NOT NULL,
        type TEXT NOT NULL
    );
`;

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table', err);
    } else {
        console.log('Table created (or already exists)');
    }
});

// Insert some sample data into the 'data' table
const insertSampleData = `
    INSERT INTO data (application_from, application_to, type) 
    VALUES
    ('AppA', 'AppB', 'filename'),
    ('AppB', 'AppC', 'image'),
    ('AppA', 'AppD', 'payload');
`;

module.exports = db;