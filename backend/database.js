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

//Insert some sample data into the 'data' table
const insertSampleData = `
    INSERT INTO warnings (application_from, application_to, type, severity) 
    VALUES
    ('AppA', 'AppB', 'filename', '1'),
    ('AppB', 'AppD', 'image', '1'),
    ('AppA', 'AppD', 'payload', '1');
`;

const insertRequestSampleData = `
    INSERT INTO requests (warning_id, timestamp, method, url, host, headers, body, status_code, response_body, client_ip) 
    VALUES
    (1, '2024-12-01 12:00:00', 'GET', '/example-path', 'example.com', '{"Content-Type": "application/json"}', '{"key": "value"}', 200, '{"result": "success"}', '192.168.1.1'),
    (1, '2024-12-01 12:05:00', 'POST', '/submit-data', 'example.com', '{"Content-Type": "application/x-www-form-urlencoded"}', '{"data": "sample"}', 201, '{"status": "created"}', '192.168.1.2'),
    (1, '2024-12-01 12:10:00', 'PUT', '/update-record', 'example.com', '{"Authorization": "Bearer token"}', '{"update": "info"}', 204, '', '192.168.1.3');
`;

warnings_db.run(insertSampleData, function(err) {
    if (err) {
        console.error('Error inserting data', err);
    } else {
        console.log('Sample data inserted successfully');
        
        // Query the table to see if data was inserted
        warnings_db.all('SELECT * FROM warnings', (err, rows) => {
            if (err) {
                console.error('Error fetching data', err);
            } else {
                console.log('Rows fetched from warnings table:', rows);
            }
        });
    }
});

requests_db.run(insertRequestSampleData, function(err) {
    if (err) {
        console.error('Error inserting data', err);
    } else {
        console.log('Sample data inserted successfully');
    }

    requests_db.all('SELECT * FROM requests', (err, rows) => {
        if (err) {
            console.error('Error fetching data', err);
        } else {
            console.log('Rows fetched from warnings table:', rows);
        }
    });
});
//module.exports = {warnings_db, requests_db};