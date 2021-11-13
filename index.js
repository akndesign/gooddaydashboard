const express = require('express');
const request = require('request');
const app = express();
const http = require('http');
const path = require('path');

app.use(express.static(path.join(__dirname, '/public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/nasa/', (req, res, next) => {
  request(
    { url: 'https://ssd-api.jpl.nasa.gov/fireball.api' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }

      res.json(JSON.parse(body));
    }
  )
});

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);




