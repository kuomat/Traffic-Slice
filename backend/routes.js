const db = require('./database')
// Database Schema: [error_id, application_from, application_to, type]

// route: /application/:appName/:type
const application = (req, res) => {
    const application = req.params.appName;
    const type = req.params.type;

    let query = ``;
    if (type === 'from') {
        query = `SELECT * FROM data WHERE application_from = ?`
    } else {
        query = `SELECT * FROM data WHERE application_to = ?`
    }

    db.get(query, [application], (err, row) =>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(row);
    });

}

// route: /warning/:warningType
// parameter is a type of warning i.e., program is sending filenames
const warning = (req, res) => {
    const query = `SELECT * FROM data WHERE type = ?`
    const params = [req.params.warningType]
    db.get(query, params, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(row);
    });
};

module.exports = {
    application,
    warning,
};