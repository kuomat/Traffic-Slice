// route: /application/:application/:type
//const {db, request_db} = require('./database');
const sqlite3 = require('sqlite3').verbose();

// Open a connection to the existing database
const warnings_db = new sqlite3.Database('./warnings.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database connected successfully');
    }
});

const requests_db = new sqlite3.Database('./requests.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database opened successfully');
    }
});

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database opened successfully');
    }
});

const application = (req, res) => {
    const application = req.params.appName;
    const type = req.params.type;

    let query = ``;
    if (type === 'from') {
        query = `SELECT * FROM warnings WHERE application_from = ? ORDER BY severity DESC`;
    } else {
        query = `SELECT * FROM warnings WHERE application_to = ? ORDER BY severity DESC`;
    }

    warnings_db.all(query, [application], (err, row) =>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(row);
    });
};

// route: /warning/:warningType
// parameter is a type of warning i.e., program is sending filenames
const warning = (req, res) => {
    const query = `SELECT * FROM warnings WHERE type = ?`;
    const params = [req.params.warningType];
    warnings_dbdb.all(query, params, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(row);
    });
};

// route: /request/:requestId
const request = (req, res) => {
    const query = `SELECT * FROM requests WHERE warning_id = ?`
    const params = [parseInt(req.params.requestId, 10)];
    requests_db.all(query, params, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(row);
    });
};

const top_warnings = (req, res) => {
    const query = `SELECT id, alert_name, application_from, destination_domain, severity FROM alerts WHERE severity != 1 ORDER BY severity DESC`;
    db.all(query, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(row);
    });
};

const specific_warning = (req, res) => {
    const query = `SELECT * FROM alerts WHERE id = ?`;
    const params = [parseInt(req.params.id)]
    db.all(query, params, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(row);
    });
}

module.exports = {
    application,
    warning,
    request,
    top_warnings,
    specific_warning
};