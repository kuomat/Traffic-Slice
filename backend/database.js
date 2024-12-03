const { request } = require('express');

const sqlite3 = require('sqlite3').verbose();

const warnings_db = new sqlite3.Database('./warnings.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database opened successfully');
    }
});

const requests_db = new sqlite3.Database('./requests.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database opened successfully');
    }
})

const createWarningsTableQuery = `
    CREATE TABLE IF NOT EXISTS warnings (
        warning_id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_from TEXT NOT NULL,
        application_to TEXT NOT NULL,
        type TEXT NOT NULL,
        severity INTEGER NOT NULL
    );
`;

const createRequestsTableQuery = `
    CREATE TABLE IF NOT EXISTS requests (
        request_id INTEGER PRIMARY KEY AUTOINCREMENT,
        warning_id INTEGER NOT NULL,
        timestamp DATETIME,
        method TEXT,
        url TEXT,
        host TEXT,
        headers TEXT,
        body TEXT,
        status_code INTEGER,
        response_body TEXT,
        client_ip TEXT,
        FOREIGN KEY (warning_id) REFERENCES warnings(warning_id)
    );
`

warnings_db.run(createWarningsTableQuery, (err) => {
    if (err) {
        console.error('Error creating table', err);
    } else {
        console.log('Table created (or already exists)');
    }
});

requests_db.run(createRequestsTableQuery, (err) => {
    if (err) {
        console.error('Error creating table', err);
    } else {
        console.log('Table created (or already exists)');
    }
});

// Insert some sample data into the 'data' table
// const insertSampleData = `
//     INSERT INTO data (application_from, application_to, type) 
//     VALUES
//     ('AppA', 'AppB', 'filename'),
//     ('AppB', 'AppC', 'image'),
//     ('AppA', 'AppD', 'payload');
// `;

module.exports = {warnings_db, requests_db};