/*

- Sign up for openweathermap.org and generate an API key.
- User either $.ajax or $.get to pull weather current data for London
- Print the temperature in console.
- Possible next steps
- 1: Display the temperature in the UI rather than the console
- 2: Display an icon or image depending on the current weather
- 3: add a form prompting user for the city.
- 4: add a toggle for switching between farenheit and celcius

*/

var app = {};

app.handleSubmit = function (){
 	$('#msg').html($('.form').val());
    };

app.ResetSubmit = function (){
	$('#msg').html("");
	$('.form').val("");	
    };

app.getWeather = function() {
    var weatherUrl = 'http://api.openweathermap.org/data/2.5/find?q=';
    var city = $('.form').val();
    var celcius = "&units=metric";
    var apiKey = '&appid=ea43d349fe09f49a0d21b5607b77208c';

    $.ajax({
        url: weatherUrl + city + celcius + apiKey,
        type: "GET",
        success: function(response) {
            for (var key in response.list[0]) {
            	//console.log(response.list[0]);
                if (key === "name") {
                    $("#city").text(response.list[0][key]);
                    //$("#location").text(response.list[0][key]); for a future concept idea
                } else if (key === "main") {
                    var temperature = Math.round(response.list[1].main.temp);
                    $("#temperature").text(temperature + "°C");
                } else if (key === "weather") {
                    var weatherCondition = response.list[1].weather[0].main;
                    $("#weathercondition").text(weatherCondition + ", ");
                }
            }
        }
    });
};

app.init = function() {
    $('#search-button').on('click', app.getWeather);
    $('#Reset').on('click', app.ResetSubmit);
};

$(document).ready(app.init);

