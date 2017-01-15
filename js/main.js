var app = {};

app.getAJAX = function() {

    var weatherUrl = 'https://api.wunderground.com/api/';
    var apiWeatherKey = 'c2ca7887db0ced3d';
    var conditions = '/conditions/q/';
    var city = 'UK/London.json';
    
    var tflUrl = 'https://api.tfl.gov.uk/line/mode/tube/status?';
    var app_id = 'app_id=2a49b2c6';
    var apiUndergroundKey = '&app_key=19d97bbedc6a5b79a885b824afc220c3';

    var asteroidUrl = 'https://api.nasa.gov/neo/rest/v1/feed/today?detailed=false';
    var apiKey = '&api_key=PT3Ux5XFGFqnK869ovrGVMS5SBciZGmQ0I0LnkrC';

    console.log("Looking at my code, are we? ;) Why don't we have a chat -- email me at alexander@akndesign.com");

    $.when(
        
        $.get(weatherUrl + apiWeatherKey + conditions + city),
        //$.getJSON('js/dummy-json/weather/rain.json'),
        $.get(tflUrl + app_id + apiUndergroundKey),
        //$.getJSON('js/dummy-json/tube/twodelayedservices.json'),
        $.get(asteroidUrl + apiKey)
        //$.getJSON('js/dummy-json/asteroidtrue.json')
        //MAKE SURE TO MANUALLY CHANGE TO THE CURRENT DATE IN CALIFORNIA

     ).done(function(weatherResponse, undergroundResponse, asteroidResponse) {

        //var weatherandAsteroidArray = [];
        var asteroidArray = [];

        var weatherCondition = weatherResponse[0].current_observation.weather;

        
        moment.tz.add('America/Los_Angeles|PST PDT PWT PPT|80 70 70 70|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261q0 1nX0 11B0 1nX0 SgN0 8x10 iy0 5Wp1 1VaX 3dA0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1fA0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|15e6');
        moment.tz.setDefault('America/Los_Angeles');
            var nasaAPIDay = moment.tz('America/Los_Angeles').format('YYYY-MM-DD');
            var asteroid = asteroidResponse[0].near_earth_objects[nasaAPIDay];
        
        for (var i = 0; i < asteroid.length; i++) {
            var asteroidData = asteroid[i].is_potentially_hazardous_asteroid;
            asteroidArray.push(asteroidData);
        }

        //weatherandAsteriodArray = asteroidArray.concat(weatherCondition);
        //console.log(weatherandAsteriodArray); 

        app.displayWeather(weatherCondition, weatherResponse);
        app.undergroundOverlay(undergroundResponse);
        app.displayUndergroundOverlay(undergroundResponse);
        app.displayAsteroids(asteroidArray);
        app.displayBadDay(weatherCondition, asteroidArray, undergroundResponse[0]);

      });
  
/*app.getGoogleCalendar = function() {

    $('#noGoogle' ).addClass('is-hidden');

    var CLIENT_ID = '898526595344-15r6oqg7ibui899rt34ieha6l0ilkoqk.apps.googleusercontent.com';
    var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

    var googleResponse = gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        immediate: false
    });

    gapi.client.load('calendar', 'v3', listUpcomingEvents);

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       
      function listUpcomingEvents() {
        var request = gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        });
      
    request.execute(function(resp) {
        var events = resp.items;

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
               $('#googleCalendar').append(event.summary + ' (' + when + ')');
               console.log(events);
            }
          } else {
            $('#googleCalendar').append('No upcoming events found.');
          }

           $('#googletitle').text('Upcoming events:');

        });
      }
};*/

//Hide Underground Overlay, on Hover

app.undergroundOverlay = function(undergroundResponse) {

    $('.toggle').hover(function() {
        $('#service-notifications').fadeOut('fast');
        $('#lines').removeClass('text-hidden');
        //$('#lines').fadeIn('fast');
    }, function() {
        $('#service-notifications').fadeIn('fast');
        //$('#lines h6').fadeOut('fast');
        $('#lines').addClass('text-hidden');
    });
    setTimeout(function() {
        if ($('#lines').removeClass('text-hidden')) {
            $('#service-notifications').fadeIn('fast');
            $('#lines').addClass('text-hidden');
        }
    }, 10);

};

//Display Underground, Per-Line, display Underground Overlay

app.displayUndergroundOverlay = function(undergroundResponse) {

    if (!undergroundResponse) {
        undergroundResponse = [];
    }

    var goodService = [];
    var serviceClosed = [];
    var partClosure = [];
    var interruption = [];

    var severalOtherLines = [' and several other lines'];
    var otherLines = [' other lines'];
    var pluralLines = [' lines'];
    var singleLine = [' line'];

    //THIS IS A DUPLICATION OF YOUR PROCESSING ABOVE

    undergroundResponse[0].forEach(function(line) {

        var undergroundID = line.id;
        var undergroundName = line.name;
        //var description = line.lineStatuses[0].statusSeverityDescription;
        var undergroundStatus = line.lineStatuses[0].statusSeverityDescription;
        
        
        var addLineID = $('#tfl').attr('id', undergroundID);
        var addLine = '<h4>' + undergroundName + ' ' + undergroundStatus + '</h4>';
        $(addLineID).append(addLine);

        switch (undergroundStatus) {

            case 'Good Service':

                $('#good-service').text('Good').append("<div id='good-title'></div>");
                $('#good-title').text('service');
                $('#weatherStart').addClass('is-hidden');

                break;

            case 'Service Closed':

                serviceClosed.push(undergroundName);

                if ($(serviceClosed).length === 1) {

                    var serviceClosedSingle = serviceClosed.concat(singleLine);

                    $('#service-closed').text('Service Closed on the ');
                    $('#service-closed').append(serviceClosedSingle);
                    //$(serviceClosedString.push('and'));

                } else if ($(serviceClosed).length === 2) {

                    var serviceClosedPlural = serviceClosed.join(', ').concat(pluralLines);

                    $('#service-closed').text('Service Closed on the ');
                    $('#service-closed').append(serviceClosedPlural);
                    //$(serviceClosedString.push('and'));

                } else {

                    var today = moment().add('Europe/London').format('e');

                    if (today === '5' || today === '6') {

                        var serviceClosedOtherLines = serviceClosed.join(', ');
                        var serviceSlice = serviceClosedOtherLines.slice(0, 26).concat(severalOtherLines);

                        $('#good-service').addClass('is-hidden');
                        $('#service-closed').text('Service Closed on the ');
                        $('#service-closed').text(serviceSlice);
                        $('#interruptions-title').text('Night Tube Available').addClass('interruptions-text-title');
                        $('#weatherStart').addClass('is-hidden');
                        $('#tflCommentary').text("Woohoo, Night Tube – Party On! Otherwise, it's");

                    } else {
                        $('#good-service').addClass('is-hidden');
                        $('#interruptions-title').addClass('text-title');
                        $('#interruptions-title').text('Service Closed');
                        $('#service-closed').addClass('is-hidden');
                        $('#tflCommentary').text("Night Bus Hour :( Otherwise it's");
                        $('#weatherStart').addClass('is-hidden');
                    }

                }

                break;

                case 'Part Closure': 
                case 'Planned Closure':   

                    partClosure.push(undergroundName);

                    if ($(partClosure).length === 1) {

                        var partclosureSingleLine = partClosure.join(', ').concat(singleLine);

                        $('#partclosure').text('Part Closure on the ' + partclosureSingleLine);
                        $('#partclosure').addClass('interruptions');
                        $('#interruptions').addClass('closure-interruptions');
                    

                    } else if ($(partClosure).length === 2) {

                        var partclosurePluralLines = partClosure.join(' & ').concat(pluralLines);

                        $('#partclosure').text('Part or Planned Closures on the ' + partclosurePluralLines);
                        $('#partclosure').addClass('interruptions');
                        $('#interruptions').addClass('closure-interruptions');
                        $('#interruptions-title').text('Planned or Part Closures');
                        $('#good-service').addClass('is-hidden');
                        $('#interruptions-title').addClass('interruptions-text-title');
                        //$(interruptionPluralLine.push('and'));

                    } else {

                        var partclosureOtherLines = partClosure.join(', ').concat(otherLines);

                        $('#partclosure').text('Part or Planned Closures on the ' + partclosureOtherLines);
                        $('#partclosure').addClass('interruptions');
                        $('#interruptions').addClass('closure-interruptions');
                        $('#interruptions-title').text('Planned or Part Closures');
                        $('#good-service').addClass('is-hidden');
                        $('#interruptions-title').addClass('interruptions-text-title');

                    } break;

            default:

                interruption.push(undergroundName);

            
                if ($(interruption).length === 1) {

                    var interruptionSingleLine = interruption.join(' ').concat(singleLine);

                    $('#interruptions').text('Interruption on the ' + interruptionSingleLine);
                    //$(interruptionSingleLine.push('and'));

                } else if ($(interruption).length === 2) {

                    var interruptionPluralLines = interruption.join(', ').concat(pluralLines);

                    $('#interruptions').text('Interruptions on the ' + interruptionPluralLines);
                    $('#weatherStart').addClass('is-hidden');
                    $('#tflCommentary').text('Replan travels on the Underground if needed, otherwise');


                } else {

                    var interruptionOtherLines = interruption.join(', ').concat(otherLines);

                    $('#good-service').addClass('is-hidden');
                    $('#interruptions').text('Interruptions on the ' + interruptionOtherLines);
                    $('#interruptions-title').text('Interrupted Service');
                    $('#interruptions-title').addClass('interruptions-text-title');
                    $('#weatherStart').addClass('is-hidden');
                    $('#tflCommentary').text("The Underground looks a bit broken today – otherwise it's");
                }
                
                break;
            }

        }); //app.displayBadDay(tflAsteroidArray);
    };
};

//Display Weather 

app.displayWeather = function(weatherCondition, weatherResponse) {

    var city = weatherResponse[0].current_observation.display_location.city;
    var temperature = Math.round(weatherResponse[0].current_observation.temp_c);
    var tempFahrenheit = Math.round(weatherResponse[0].current_observation.temp_f);
    var feelsLike = Math.round(weatherResponse[0].current_observation.feelslike_c);

    //weatherandAsteroidArray = [];

    $('#city').text(city);

    $('#tempCheck').change(function(e) {
        if (this.checked) {    
        $('#tempFahrenheit').fadeOut('slow', function(){
            $('#temperature').fadeIn('slow');
        });
    } else { 
        $('#temperature').fadeOut('slow', function(){
        $('#tempFahrenheit').fadeIn('slow');
                });
        }
    });

   /* $('#tempCheck').change(function() {
        if (this.checked) {
            $('#temperature').animate({'opacity': 100}, 100).text(temperature + '°C');
            $('#tempFahrenheit').animate({'opacity': 0}, 500);
        } else {
            $('#temperature').animate({'opacity': 0}, 500);
            $('#tempFahrenheit').animate({'opacity': 100}, 100).text(tempFahrenheit + '°F');
            
        }
    });*/

    console.log('Actual Temperature ', temperature,'°C',';', 'Feels Like', feelsLike,'°C');

    if (temperature >= 29) {

            $('.tile-weather').addClass('hot');
            $('#temperature').text(temperature + '°C');
            $('#tempFahrenheit').text(tempFahrenheit + '°F');
            //$('#temperaturecondition').text("It's hot! ");
            $('#hot').text(" a hot day! ");
            $('#weatherCommentary').addClass('is-hidden');

        } else if (temperature <= 5) {

            $('#temperature').text(temperature + '°C');
            $('#tempFahrenheit').text(tempFahrenheit + '°F');
            //$('#temperaturecondition').text('Brr! ');
            $('#hot').text("best to bring a winter jacket!");
            $('#weatherCommentary').addClass('is-hidden');

        } else {
            $('#temperature').text(temperature + '°C');
            $('#tempFahrenheit').text(tempFahrenheit + '°F');
        }

    //var lightWeather = weatherCondition.includes('Light');

    switch (weatherCondition) {

            case 'Clouds':
            case 'Fog':
            case 'Patches of Fog':
            case 'Shallow Fog':
            case 'Partial Fog':
            case 'Light Freezing Fog':
            case 'Partly Cloudy': 
            case 'Mostly Cloudy' : 
            case 'Scattered Clouds':
            case 'Overcast':

                $('.tile-weather').addClass('clouds');
                $('#weathercondition').text(weatherCondition);
                $('#weatherCommentary').text(' an average, grey day in London.');

                break;

            case 'Clear':

                $('.tile-weather').addClass('clear');
                $('#weathercondition').text(weatherCondition);
                $('#weatherCommentary').text(' a good day in London.');

                //app.displayBadDay(weatherCondition);

                break;

            case 'Light Rain':
            case 'Heavy Rain':
            case 'Rain':
            case 'Light Drizzle':
            case 'Heavy Drizzle':
            case 'Thunderstorm':

                $('.tile-weather').addClass('rain');
                $('#weathercondition').text(weatherCondition + ' :(');
                $('#weatherStart').addClass('is-hidden');
                $('#weatherStart').addClass('is-hidden');
                $('#weatherCommentary').text(' best to bring an umbrella!');

                
                break;

            case 'Snow':

                $('.tile-weather').addClass('snow');
                $('#weathercondition').text(weatherCondition);
                $('#weatherStart').addClass('is-hidden');
                $('#hot').append(' (Snowing in London?? Madness!)');

                break;

            case 'Mist':

                $('.tile-weather').addClass('mist');
                $('#weathercondition').text(weatherCondition);
                $('#weatherStart').addClass('is-hidden');
                $('#weatherCommentary').text(' weather that is like your eyes watching Jack slip in ocean (spoiler!)');

                break;

            default:
                $('#weathercondition').text(weatherCondition);

        }

    if (feelsLike === temperature) {
            $('#feelslike').text('Feels similar');
        } else  if (feelsLike <= temperature) {
            $('#feelslike').text('Feels cooler');
        } else  if (feelsLike >= temperature) {
            $('#feelslike').text('Feels warmer');
            //$('#feelslike').text('Feels like ' + feelsLike + '°C');
            //else  if (Math.abs(temperature - feelsLike) <= 2) {
        }
    };    

//Display Asteroids

app.displayAsteroids = function(asteroidArray) {

    //console.log('Any Hazardous Asteroids? ' + asteroidArray);

    if ( $.inArray(true, asteroidArray) > -1 ){

        $('#asteroid').text('Nearby');
        $('#asteroid-title').text('Asteroids');
        $('#asteroid-svg').attr('src', 'img/asteroid2.svg');
        $('.tile-asteroid').addClass('asteroid-near');
    
    } else { $('#asteroid').text('No Near');
            $('#asteroid-svg').attr('src', 'img/asteroid.svg');
            $('#asteroid-title').text('Asteroids');
    } 
};

app.displayBadDay = function(weatherCondition, asteroidArray, undergroundResponse) {

    if (!undergroundResponse) {
        undergroundResponse = [];
    }

    weather = [];
    underground = [];
    asteroid = [];
    asteriodWeather = [];
    asteriodUnderground = [];
    undergroundWeather = [];
    reallyBadDay = [];

    for (var i = 0; i < undergroundResponse.length; i++) {
            
    var undergroundStatus = undergroundResponse[i].lineStatuses[0].statusSeverityDescription;

     switch (undergroundStatus) {

            case 'Part Closure': 
            case 'Planned Closure':   
            case 'Severe Delays':
            case 'Minor Delays':
            case 'Part Suspended':
            case 'Special Service':

            underground.push(undergroundStatus);
            asteriodUnderground.push(undergroundStatus);
            undergroundWeather.push(undergroundStatus);
            reallyBadDay.push(undergroundStatus); 

    break;
    
        }
    }

    switch (weatherCondition) {

            case 'Light Rain':
            case 'Heavy Rain':
            case 'Light Drizzle':
            case 'Heavy Drizzle':
            case 'Thunderstorm':
            case 'Fog':
            case 'Patches of Fog':
            case 'Shallow Fog':
            case 'Partial Fog':
            case 'Light Freezing Fog':
            
            weather.push(weatherCondition);
            asteriodWeather.push(weatherCondition);
            undergroundWeather.push(weatherCondition);
            reallyBadDay.push(weatherCondition);
    break;
    
    }

    if ( $.inArray(true, asteroidArray) > -1 ){

            asteroidArraySimplified = 'true';
    
            asteroid.push(asteroidArraySimplified);
            asteriodWeather.push(asteroidArraySimplified);
            asteriodUnderground.push(asteroidArraySimplified);
            reallyBadDay.push(asteroidArraySimplified); 

    }

    if (asteriodWeather.length === 2) {
        $('#overallCommentary').text("Don't curse Mother Nature anymore than you have to today!");
    }

    if (asteriodUnderground.length >= 4) {
        $('#overallCommentary').text("You'd think you could hide from nearby asteroids, but TfL said no!");
    }


    if (undergroundWeather.length >= 4) {
        $('#overallCommentary').text("Hey, at least there's no asteriods coming your way... ");
    }

    if (reallyBadDay.length === 4) {
        $('#overallCommentary').text("As the French say, 'Comme ci, comme ça', ha!");
    } else if (reallyBadDay.length === 5) {
        $('#overallCommentary').text("Today could've been a bit better!");
    } else if (reallyBadDay.length >= 6) {
        $('#overallCommentary').text("Oh biscuits! It's a crummy day, isn't it? :(");
    }

    };

/*app.displayClock = function() {
    
    $('#arrow' ).on('click', function() {
        $('.google').addClass('is-hidden').fadeOut('slow');
        $('.clock').fadeIn('slow').removeClass('is-hidden');
    }); app.runClock();
};*/

app.runClock = function() {

    londonTime = moment.tz.add('Europe/London|BST BDST GMT|0 -10 -20|0101010101010101010101010101010101010101010101010121212121210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2axa0 Rc0 1fA0 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 2Rz0 Dc0 1zc0 Oo0 1zc0 Rc0 1wo0 17c0 1iM0 FA0 xB0 1fA0 1a00 14o0 bb0 LA0 xB0 Rc0 1wo0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1a00 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1tA0 IM0 90o0 U00 1tA0 U00 1tA0 U00 1tA0 U00 1tA0 WM0 1qM0 WM0 1qM0 WM0 1tA0 U00 1tA0 U00 1tA0 11z0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 14o0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00');

    var londonDate = moment.tz(londonTime).format('dddd, MMMM Do, YYYY');
    var hours = moment.tz('Europe/London').format('hh');
    var daylightSavings = moment.tz('Europe/London').isDST();

    $('#day-label').append(londonDate);

    if (daylightSavings) {    
        $('.clock-label').text('British Summer Time');
        } else {
        $('.clock-label').text('Greenwich Mean Time');
    }

    var dialLines = document.getElementsByClassName('diallines');

    for (var i = 1; i <= 60; i++) {
        dialLines[i] = $(dialLines[i - 1]).clone().insertAfter($(dialLines[i - 1]));
        $(dialLines[i]).css('transform', 'rotate(' + 6 * i + 'deg)');
    }

    function tick() {

        var seconds = moment.tz(londonTime).format('ss');
        var minutes = moment.tz(londonTime).format('mm');
        var hours = moment.tz('Europe/London').format('hh');

        var secAngle = seconds * 6;
        var minAngle = minutes * 6 + seconds * (360 / 3600);
        var hourAngle = hours * 30 + minutes * (360 / 720);

        if (secAngle === 0 ) {
            $('.sec-hand').removeClass('hand-movement');     
        } else {
            $('.sec-hand').addClass('hand-movement');
        }

        if (minAngle === 0 ) {
            $('.min-hand').removeClass('hand-movement');
        } else {
            $('.min-hand').addClass('hand-movement');
        }

        $('.sec-hand').css('transform', 'rotate(' + secAngle + 'deg)');
        $('.min-hand').css('transform', 'rotate(' + minAngle + 'deg)');
        $('.hour-hand').css('transform', 'rotate(' + hourAngle + 'deg)');
    }

    setInterval(tick, 100);

}; 

app.removeWidget = function(){

    $('#closeMessage').on('click', function(c){
        $(this).parent().fadeOut('slow', function(c){
        });
    }); 
};

app.init = function() {
    app.getAJAX();
    app.runClock();
    app.removeWidget();
};

$(document).ready(app.init);
