import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as http from 'http';

const app = express();

// API file for interacting with MongoDB
const api = require('../build-server/routes');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, '../build-client')));

// API location
app.use('/api', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build-client/index.html'));
});

// Set port
const port = process.env.PORT || '3000';
app.set('port', port);

// Server
const server = http.createServer(app);
server.listen(port, () => console.log(`Running on port: ${port}`));
