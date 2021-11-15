const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const request = require('request');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const asteroidUrl = 'https://ssd-api.jpl.nasa.gov/fireball.api?date-min=';
const nasaAPIDay = new Date().toLocaleDateString('sv', {timeZone: 'America/Los_Angeles'});
const nasaAPIURL = (asteroidUrl + nasaAPIDay); 

app.get('/nasa-asteriods/', (req, res) => {
  request(
    {url: nasaAPIURL},
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }
      res.json(JSON.parse(body));
    }
  )
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT || 5000, function () {
    console.log('Good Day Dashboard has successfully loaded!');
});





