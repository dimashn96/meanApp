const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

// API file for interacting with MongoDB
const api = require('./server/routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname,'dist')));

// API location
app.use('/api',api);

// Send all other requests to the Angular app
app.get('*',(req, res) => {
  res.sendfile(path.join(__dirname,'dist/index.html'));
});

// Set port
const port = process.env.port || 8080;

// Server
const server = http.createServer(app);
server.listen(port,() => console.log(`Server listening on {$port}`));
