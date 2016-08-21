var app = {};

var config = {
    apiKey: 'AIzaSyCVwC9NZGAmenLzrVzrSaXLAUxcv7TYVBc',
    authDomain: 'good-day-dashboard.firebaseapp.com',
    databaseURL: 'https://good-day-dashboard.firebaseio.com',
    storageBucket: '',
  };

firebase.initializeApp(config);

//WEATHER APP

app.getAJAX = function() {

    var weatherUrl = 'http://api.openweathermap.org/data/2.5/find?q=';
    var city = 'london';
    var celcius = '&units=metric';
    var apiWeatherKey = '&appid=ea43d349fe09f49a0d21b5607b77208c';

    var tflUrl = 'https://api.tfl.gov.uk/line/mode/tube/status?';
    var app_id = 'app_id=2a49b2c6';
    var apiUndergroundKey = '&app_key=19d97bbedc6a5b79a885b824afc220c3';

    var asteriodUrl = 'https://api.nasa.gov/neo/rest/v1/feed/today?detailed=false';
    var apiKey = '&api_key=PT3Ux5XFGFqnK869ovrGVMS5SBciZGmQ0I0LnkrC';


    $.ajax({
        url: weatherUrl + city + celcius + apiWeatherKey,
        method: 'GET',
        beforeSend: function() {
            $('#weather').html('Loading...');
        },
        success: function(weatherResponse) {

            app.displayWeather(weatherResponse);
        }
    });

    $.ajax({
        url: tflUrl + app_id + apiUndergroundKey,
        method: 'GET',
        beforeSend: function() {
            $('#service-board').html('Loading...');
        },
        success: function(undergroundResponse) {

            app.displayUndergroundService(undergroundResponse);
            app.undergroundOverlay(undergroundResponse);
            app.displayUndergroundOverlay(undergroundResponse);
        }
    });

    /*Dummy Underground JSON Request 
    $.getJSON('js/dummy-json/twodelayedservices.json', function(undergroundResponse) {
        app.displayUndergroundService(undergroundResponse);
        app.undergroundOverlay(undergroundResponse);
        app.displayUndergroundOverlay(undergroundResponse);
        
        });*/

    $.ajax({
        url: asteriodUrl + apiKey,
        method: 'GET',
        beforeSend: function() {
            $('#asteriod').html('Loading...');
        },
        success: function(asteriodResponse) {

            app.displayAsteriods(asteriodResponse);
        }
    });
};

//Display Weather 

app.displayWeather = function(weatherResponse) {

    if (!weatherResponse) {
        weatherResponse = [];
    }

    for (var key in weatherResponse.list[0]) {
        if (key === 'name') {
            $('#city').text(weatherResponse.list[0][key]);
        } else if (key === 'main') {
            var temperature = Math.round(weatherResponse.list[1].main.temp);
            $('#temperature').text(temperature + '°C');
        } else if (key === 'weather') {
            var weatherCondition = weatherResponse.list[1].weather[0].main;
            $('#weathercondition').text(weatherCondition + ', ');
        }
    }
};

//Display Underground, Per-Line

app.displayUndergroundService = function(undergroundResponse) {

    if (!undergroundResponse) {
        undergroundResponse = [];
    }

    for (var i = 0; i < undergroundResponse.length; i++) {

        var undergroundID = undergroundResponse[i].id;
        var undergroundName = undergroundResponse[i].name;
        var undergroundStatus = undergroundResponse[i].lineStatuses[0].statusSeverityDescription;

        var addLineID = $('#tfl').attr('id', undergroundID);
        var addLine = '<h6>' + undergroundName + ' ' + undergroundStatus + '</h6>';
        $(addLineID).append(addLine);
    }
};

//Hide Underground Overlay, on Hover

app.undergroundOverlay = function(undergroundResponse) {

    $('.toggle').hover(function() {
        $('#service-notifications').fadeOut('fast');
    }, function() {
        $('#service-notifications').fadeIn('fast');
    });
};

//Display Underground Overlay

app.displayUndergroundOverlay = function(undergroundResponse) {

    var goodService = [];
    var serviceClosed = [];
    var interruption = [];

    var otherLines = [' other lines'];
    var pluralLines = [' lines'];
    var singleLine = [' line'];

    undergroundResponse.forEach(function(line) {
        
        var undergroundName = line.name;
        var description = line.lineStatuses[0].statusSeverityDescription;

        //var linePural = service.length(count >= 1 ? this: 's');

       /* if (i === undergroundResponse.length - 2) {
            undergroundName = undergroundResponse[i].name + ' and ';
        } else if (i === undergroundResponse.length - 1) {
            undergroundName = undergroundResponse[i].name + ' lines';
        } else {
            undergroundName = undergroundResponse[i].name + ', ';
        }
        //else if (i === service.length - 4) {
        //undergroundName = service[i].name + ' and other ';
            
           /* case 'Part Closure':
            case 'Minor Delays':
            case 'Severe Delays':
            case 'Part Suspended':
            case 'Special Service':*/

        switch (description) {

            case 'Good Service':  

                $('#good-service').text('Good').append("<div id='good-title'></div>");
                $('#good-title').text('service');
                break;
            
            case 'Service Closed':
                
                serviceClosed.push(undergroundName);

                if ($(serviceClosed).length === 1) {

                    var serviceClosedSingle = serviceClosed.concat(singleLine);

                    $('#good-service').addClass('is-hidden');
                    $('#service-closed').text('Service Closed on the ');
                    $('#service-closed').append(serviceClosedSingle);
                    //$(serviceClosedString.push('and'));

                } else if ($(serviceClosed).length === 2) {

                    var serviceClosedPlural = serviceClosed.join(', ').concat(pluralLines);

                    $('#good-service').addClass('is-hidden');
                    $('#service-closed').text('Service Closed on the ');
                    $('#service-closed').append(serviceClosedPlural);
                    //$(serviceClosedString.push('and'));

                } else {

                    var today = new Date();
                    
                    if (today.getDay() == 6 || today.getDay() == 0) {
                            $('#good-service').addClass('is-hidden');
                            $('#service-closed').text('Night Tube Available');
                        } else { $('#good-service').addClass('is-hidden');
                                $('#service-closed').text('Service Closed');
                    }

                }

                break;
            
            default:

                interruption.push(undergroundName);

                if ($(interruption).length === 1) {

                    var interruptionSingleLine = interruption.join(" ").concat(singleLine);

                    $('#good-service').addClass('is-hidden');
                    $('#interruptions').text('Interruption on the ' + interruptionSingleLine);
                    console.log(interruptionSingleLine);
                    //$(interruptionSingleLine.push('and'));

                } else if ($(interruption).length === 2) {

                    var interruptionPluralLines = interruption.join(', ').concat(pluralLines);

                    $('#good-service').addClass('is-hidden');
                    $('#interruptions').text('Interruptions on the ' + interruptionPluralLines);
                    console.log(interruptionPluralLines);
                    //$(interruptionPluralLine.push('and'));

                } else {

                    var interruptionOtherLines = interruption.join(', ').concat(otherLines);

                    $('#good-service').addClass('is-hidden');
                    $('#interruptions').text('Interruptions on the ' + interruptionOtherLines);
                    console.log(interruptionOtherLines);

                    } break;

        } 
});

    /*var serviceClosed = [];

    if (!undergroundResponse) {
        undergroundResponse = [];
    }

    for (var i = 0; i < undergroundResponse.length; i++) {

        var undergroundName;
        //var linePural = service.length(count >= 1 ? this: 's');

        if (i === undergroundResponse.length - 2) {
            undergroundName = undergroundResponse[i].name + ' and ';
        } else if (i === undergroundResponse.length - 1) {
            undergroundName = undergroundResponse[i].name + ' lines';
        } else {
            undergroundName = undergroundResponse[i].name + ', ';
        }
        //else if (i === service.length - 4) {
        //undergroundName = service[i].name + ' and other ';

        var undergroundStatus = undergroundResponse[i].lineStatuses[0].statusSeverityDescription;

        if (undergroundStatus === 'Good Service') {
            $('#good-service').text('Good').append("<div id='good-title'></div>");
            $('#good-title').text('service');
            //$('.title').text('Interruptions on the ');

        } else if (undergroundStatus === 'Service Closed') {
            serviceClosed.push(undergroundName);

            if (i === service.length - 2) {
                $('#service-closed').text('Service Closed').append(undergroundName);

            }
            return ($('#service-closed').text('Service Closed'));


        } else if (undergroundStatus !== 'Good Service' && 'Service Closed') {
            $('#good-service').addClass('is-hidden');
            $('.title').text('Interruptions on the ');
            $('#interruptions').append(undergroundName);

        }
        //$('#interruptions').addClass('is-hidden');
    }*/
};

/*var count = 0;
        for (var i = 0; i < messageBoard.messages.length; i++) {
            count += messageBoard.messages[i].votes;
        } return count;
        
    };*/

//Display Asteriods

app.displayAsteriods = function(asteriodResponse) {

    moment.tz.add(['America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0']);

    var nasaAPIDay = moment().tz('America/Los_Angeles').format('YYYY-MM-DD');
    var asteriod = asteriodResponse.near_earth_objects[nasaAPIDay];

    for (var i = 0; i < asteriod.length; i++) {
        var asteriodData = asteriod[i].is_potentially_hazardous_asteroid;

        if (asteriodData) {
            return $('#asteriod').text('Asteroids are nearby');
        } else {
            $('#asteriod').text('No nearby asteriods');
        }
    }
};


app.init = function() {
    app.getAJAX();
    app.displayWeather();
    app.displayUndergroundService();
    app.undergroundOverlay();
    app.displayUndergroundOverlay();
    app.displayAsteriods();
    app.getGoogleCalendar();
};

$(document).ready(app.init);