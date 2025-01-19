const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/application/:appName/:type', routes.application);
app.get('/warning/:warningType', routes.warning);
app.get('/request/:requestId', routes.request);
app.get('/top_warnings', routes.top_warnings);
app.get('/specific_warning/:id', routes.specific_warning);

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;