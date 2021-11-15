const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const request = require('request');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/nasa-asteriods/', (req, res) => {
  request(
    {url: "https://ssd-api.jpl.nasa.gov/fireball.api?"},
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




/*app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname + "/public"));

app.use(express.static(__dirname + "/public/img"));
*/
app.listen(process.env.PORT || 5000, function () {
    console.log('Node app is working!');
});





/*const express = require('express');
const request = require('request');
const app = express();
const http = require('http');
const path = require('path');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin


app.use(express.static(path.join(__dirname, 'index.html'))); 

app.get('/', function(req, res){
  res.sendFile(process.cwd() + 'index.html');
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

//const asteroidUrl = 'https://ssd-api.jpl.nasa.gov/fireball.api?date-min=';
//const nasaAPIDay = new Date().toLocaleString({timeZone: "America/Los_Angeles"}).split("T")[0];
//const nasaAPIURL = (asteroidUrl + nasaAPIDay); 

//console.log(nasaAPIDay, nasaAPIURL);



const PORT = process.env.PORT || 5000;
express().listen(PORT, () => console.log(`Listening on ${ PORT }`));

/*const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);*/




