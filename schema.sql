-- The database name is database.db
-- It is stored in the same directory as this file.

-- Alerts table to store triggered warnings
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_name TEXT NOT NULL,
    message TEXT NOT NULL,
    application_from TEXT NOT NULL,
    destination_domain TEXT NOT NULL,
    type TEXT NOT NULL,
    severity INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for alerts-tcp_messages many-to-many relationship
CREATE TABLE IF NOT EXISTS alert_tcp_messages (
    alert_id INTEGER NOT NULL,
    tcp_message_id INTEGER NOT NULL,
    PRIMARY KEY (alert_id, tcp_message_id),
    FOREIGN KEY (alert_id) REFERENCES alerts(id),
    FOREIGN KEY (tcp_message_id) REFERENCES tcp_messages(id)
);

-- Junction table for alerts-http_requests many-to-many relationship 
CREATE TABLE IF NOT EXISTS alert_http_requests (
    alert_id INTEGER NOT NULL,
    http_request_id INTEGER NOT NULL,
    PRIMARY KEY (alert_id, http_request_id),
    FOREIGN KEY (alert_id) REFERENCES alerts(id),
    FOREIGN KEY (http_request_id) REFERENCES http_requests(id)
);

-- TCP messages storage
CREATE TABLE IF NOT EXISTS tcp_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flow_id TEXT UNIQUE NOT NULL,
    client_host TEXT,
    client_port INTEGER,
    server_host TEXT,
    server_port INTEGER,
    message_content BLOB,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- HTTP requests storage
CREATE TABLE IF NOT EXISTS http_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flow_id TEXT UNIQUE NOT NULL,
    url TEXT,
    method TEXT,
    headers TEXT,
    request_content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_alerts_alert_name ON alerts(alert_name);
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_tcp_messages_flow_id ON tcp_messages(flow_id);
CREATE INDEX IF NOT EXISTS idx_http_requests_flow_id ON http_requests(flow_id);

-- Additional indexes for junction tables
CREATE INDEX IF NOT EXISTS idx_alert_tcp_messages_tcp_id ON alert_tcp_messages(tcp_message_id);
CREATE INDEX IF NOT EXISTS idx_alert_http_requests_http_id ON alert_http_requests(http_request_id);

-- Additional indexes for tcp_messages
CREATE INDEX IF NOT EXISTS idx_tcp_messages_timestamp ON tcp_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_tcp_messages_client_host ON tcp_messages(client_host);
CREATE INDEX IF NOT EXISTS idx_tcp_messages_server_host ON tcp_messages(server_host);

-- Additional indexes for http_requests
CREATE INDEX IF NOT EXISTS idx_http_requests_timestamp ON http_requests(timestamp);
CREATE INDEX IF NOT EXISTS idx_http_requests_url ON http_requests(url);
CREATE INDEX IF NOT EXISTS idx_http_requests_method ON http_requests(method);

PRAGMA foreign_keys = ON;
