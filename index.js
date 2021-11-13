const express = require('express');
const request = require('request');
const app = express();
const http = require('http');
const path = require('path');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin

app.use(express.static(path.join(__dirname, '/public'))); 
//app.use(express.static(path.join(__dirname + '/')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

/*const asteroidUrl = 'https://ssd-api.jpl.nasa.gov/fireball.api?date-min=';
const nasaAPIDay = new Date().toLocaleString({timeZone: "America/Los_Angeles"}).split("T")[0];
const nasaAPIURL = (asteroidUrl + nasaAPIDay); 

console.log(nasaAPIDay, nasaAPIURL);*/

app.get('/nasa-asteriods/', (req, res, next) => {
  request(
    {url: "https://ssd-api.jpl.nasa.gov/fireball.api"},
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }

      res.json(JSON.parse(body));
    }
  )
});

//const cool = require('cool-ascii-faces');
const PORT = process.env.PORT || 5000;

express().listen(PORT, () => console.log(`Listening on ${ PORT }`));

/*const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);*/




