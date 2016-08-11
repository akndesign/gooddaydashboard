var app = {};

app.getUnderground = function(){
    var weatherUrl = 'https://api.tfl.gov.uk/line/mode/tube/status?';
    var app_id = 'app_id=2a49b2c6';
    var apiKey = '&app_key=19d97bbedc6a5b79a885b824afc220c3';

    $.ajax({
        url: weatherUrl + app_id + apiKey,
        method: "GET",
        success: function(response){
            for (var i=0; i < response.length; i++) {
                var serviceName = response[i].name;
                var serviceStatus = response[i].lineStatuses[0].statusSeverityDescription;
                console.log(serviceName + " line is " + serviceStatus);
            }

            //var serviceStatus = response[i].lineStatuses[0].statusSeverityDescription;
            /*for (var key in response[0].lineStatuses[0]){
                if (key === "statusSeverityDescription"){
                    $("#bakerloo").text(serviceStatus);
                }
            /*for (i = 0; i < response.length; i++){
                if (key === "description"){
                    $("#status").text(response[0].description);
                }
             /*for (var key in response[0]){
                if (key === "description"){
                    $("#victoria").text(response[0].description);
                }
                    //$("#location").text(response.list[0][key]); for a future concept idea
                /*} else if (key === "main") {
                    var temperature = Math.round(response.list[1].main.temp);
                    $("#central").text(temperature + "°C");
                } else if (key === "weather") {
                    var weatherCondition = response.list[1].weather[0].main;
                    $("#circle").text(weatherCondition);
                }*/  
            }
    });
};


app.getUndergroundVictoria = function() {
    var weatherUrl = 'https://api.tfl.gov.uk/Line/';
    var undergroundLine = 'Victoria/';
    var app_id = 'Disruption?app_id=2a49b2c6';
    var apiKey = '&app_key=19d97bbedc6a5b79a885b824afc220c3';

    $.ajax({
        url: weatherUrl + undergroundLine + app_id + apiKey,
        method: "GET",
        success: function(response){
             for (var key in response[0]){
                if (key === "description"){
                    $("#victoria").text(response[0].description);
                }
                    //$("#location").text(response.list[0][key]); for a future concept idea
                /*} else if (key === "main") {
                    var temperature = Math.round(response.list[1].main.temp);
                    $("#central").text(temperature + "°C");
                } else if (key === "weather") {
                    var weatherCondition = response.list[1].weather[0].main;
                    $("#circle").text(weatherCondition);
                }*/
            }
        }
    });
};

app.init = function() {
    $(document).ready(app.getUnderground);
};

$(document).ready(app.init);