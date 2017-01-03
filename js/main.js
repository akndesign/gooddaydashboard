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
        //$.getJSON('js/dummy-json/weather/clear.json'),
        $.get(tflUrl + app_id + apiUndergroundKey),
        //$.getJSON('js/dummy-json/tube/mixedservice.json'),
        $.get(asteroidUrl + apiKey)
        //$.getJSON('js/dummy-json/asteroidtrue.json',

     ).done(function(weatherData, undergroundData, asteroidResponse) {


        app.displayWeather(weatherData[0]);
        app.displayUndergroundService(undergroundData[0]);
        app.undergroundOverlay(undergroundData[0]);
        app.displayUndergroundOverlay(undergroundData[0]);

        console.log('Asteroids Data ', asteroidResponse, weatherData);

        var asteroidArray = [];
        
        moment.tz.add('America/Los_Angeles|PST PDT|80 70|01010101010|1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0');
        var nasaAPIDay = moment.tz('America/Los_Angeles').format('YYYY-MM-DD');
        var asteroid = asteroidResponse[0].near_earth_objects[nasaAPIDay];
        
        for (var i = 0; i < asteroid.length; i++) {
            var asteroidData = asteroid[i].is_potentially_hazardous_asteroid;
            asteroidArray.push(asteroidData);
        
        } app.displayAsteroids(asteroidArray);

    });
/*
   $(document).ajaxStop(function() {
  // place code to be executed on completion of last outstanding ajax call here
    console.log('happy!!');
    
    app.displayBadDay(asteroidArray);

    });*/

          
app.getGoogleCalendar = function() {

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
       */
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
};


   /*if ( $.inArray(true, asteroidResponse) > -1 ){
       
        $('#asteroid').text('Nearby');
        $('#asteroid-title').text('Asteroids');
        $('#asteroid-svg').attr('src', 'img/asteroid2.svg');
        $('.tile-asteroid').addClass('asteroid-near');
        $('#asteroidCommentary').text('Stay away from windows today?');
    
    } else { $('#asteroid').text('No Near');
            $('#asteroid-svg').attr('src', 'img/asteroid.svg');
            $('#asteroid-title').text('Asteroids');
    }
};

    $('#overallCommentary').text("It's a good day in London!");*/

//Display Underground, Per-Line

app.displayUndergroundService = function(undergroundResponse) {

    console.log(undergroundResponse[0]);

    if (!undergroundResponse) {
        undergroundResponse = [];
    }

    for (var i = 0; i < undergroundResponse.length; i++) {

        var undergroundID = undergroundResponse[i].id;
        var undergroundName = undergroundResponse[i].name;
        var undergroundStatus = undergroundResponse[i].lineStatuses[0].statusSeverityDescription;

        var addLineID = $('#tfl').attr('id', undergroundID);
        var addLine = '<h4>' + undergroundName + ' ' + undergroundStatus + '</h4>';
        $(addLineID).append(addLine);
    }
};

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

//Display Underground Overlay

app.displayUndergroundOverlay = function(undergroundResponse) {

    var goodService = [];
    var serviceClosed = [];
    var partClosure = [];
    var interruption = [];

    var severalOtherLines = [' & several other lines'];
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
                $('#weatherStart').addClass('is-hidden');

                break;

            case 'Service Closed':

                //moment().tz("Europe/London").format();
                //moment.tz.add(['Europe/London']);

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
                        $('#service-closed').append(serviceSlice);
                        $('#interruptions-title').text('Night Tube Available').addClass('interruptions-text-title');
                        $('#weatherStart').addClass('is-hidden');
                        $('#tflCommentary').text("Woohoo, Night Tube – Party On! Otherwise, it's");

                    } else {
                        $('#good-service').addClass('is-hidden');
                        $('#service-closed').text('Service Closed');
                        $('#service-closed').addClass('text-title');
                        $('#weatherStart').addClass('is-hidden');
                        $('#tflCommentary').text("Night Bus Hour :( Otherwise it's");
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
                        console.log('Part Closure on the', partclosureSingleLine);

                    } else if ($(partClosure).length === 2) {

                        var partclosurePluralLines = partClosure.join(' & ').concat(pluralLines);

                        $('#partclosure').text('Part or Planned Closures on the ' + partclosurePluralLines);
                        $('#partclosure').addClass('interruptions');
                        $('#interruptions').addClass('closure-interruptions');
                        console.log(partclosurePluralLines);
                        //$(interruptionPluralLine.push('and'));

                    } else {

                        var partclosureOtherLines = partClosure.join(', ').concat(otherLines);

                        $('#partclosure').text('Part or Planned Closures on the ' + partclosureOtherLines);
                        $('#partclosure').addClass('interruptions');
                        $('#interruptions').addClass('closure-interruptions');
                        
                        console.log(partclosureOtherLines);

                    } break;

            default:

                interruption.push(undergroundName);

                var interruptedService = 'hello';
                app.displayBadDay(interruptedService);

                if ($(interruption).length === 1) {

                    var interruptionSingleLine = interruption.join(' ').concat(singleLine);

                    $('#interruptions').text('Interruption on the ' + interruptionSingleLine);
                    //$(interruptionSingleLine.push('and'));

                } else if ($(interruption).length === 2) {

                    var interruptionPluralLines = interruption.join(', ').concat(pluralLines);

                    $('#interruptions').text('Interruptions on the ' + interruptionPluralLines);
                    $('#weatherStart').addClass('is-hidden');
                    $('#tflCommentary').text('Replan travels on the Underground if needed, otherwise');
                    //$(interruptionPluralLine.push('and'));

                } else {

                    var interruptionOtherLines = interruption.join(', ').concat(otherLines);

                    $('#good-service').addClass('is-hidden');
                    $('#interruptions').text('Interruptions on the ' + interruptionOtherLines);
                    $('#interruptions-title').text('Interrupted Service ');
                    $('#interruptions-title').addClass('interruptions-text-title');
                    $('#weatherStart').addClass('is-hidden');
                    $('#tflCommentary').text("The Underground looks a bit broken today – otherwise it's");
                }
                
                break;
        }
          
    });
};

//Display Weather 

app.displayWeather = function(weatherResponse) {

    console.log('Weather Data ', weatherResponse);

    var test = weatherResponse.current_observation;
    console.log(test);

    var weatherCondition = weatherResponse.current_observation.weather;
    var city = weatherResponse.current_observation.city;
    var temperature = Math.round(weatherResponse.current_observation.temp_c);
    var temperatureString = '' + temperature;

    var feelsLike = weatherResponse.current_observation.feelslike_c;

    //console.log('Actual Temperature ', temperature,'°C',';', 'Feels Like', feelsLike,'°C');

    $('#city').text(city);

    if (temperature >= 29) {

            $('.tile-weather').addClass('hot');
            $('#temperature').text(temperature + '°C');
            $('#temperaturecondition').text("It's hot!");
            $('#hot').text(" a hot day! ");
            $('#weatherCommentary').addClass('is-hidden');

        } else if (temperature <= 5) {

            $('#temperature').text(temperature + '°C');
            $('#temperaturecondition').text('Brr!');
            $('#hot').text("best to bring a winter jacket!");
            $('#weatherCommentary').addClass('is-hidden');

        } else {
            $('#temperature').text(temperature + '°C');
        }

    var lightWeather = weatherCondition.includes('Light');

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
                $('#weatherCommentary').text(" an average, grey day in London.");

                break;

            case 'Clear':

                $('.tile-weather').addClass('clear');
                $('#weathercondition').text(weatherCondition);
                $('#weatherCommentary').text(' a good day in London.');

                break;

            case 'Light Rain':
            case 'Heavy Rain':
            case 'Light Drizzle':
            case 'Heavy Drizzle':
            case 'Thunderstorm':

                $('.tile-weather').addClass('rain');
                $('#weathercondition').text(weatherCondition);
                $('#temperaturecondition').text(':(');
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

    if (feelsLike === temperatureString) {
            $('#feelslike').text('Feels similar');
        } else {
            $('#feelslike').text('Feels like ' + feelsLike + '°C');
        }
    };    

    /*if (feelsLike || "") { //if the 'feelsLike is 0, which returns as undefined, whereas the temp is still an object'
            $('#feelslike').text('Feels similar');
        } else if (feelsLike = temperatureString) {
            $('#feelslike').text('Feels similar');
        } else {
            $('#feelslike').text(feelsLike);
        }
    };*/



app.displayGoogleCalendar = function(events) {

            };
    //console.log('hello', weatherResponse, undergroundResponse);
    /*
    switch (description) {

                case 'Good Service':  

                    $('#good-service').text('Good').append("<div id='good-title'></div>");
                    $('#good-title').text('service');
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

                        var today = new Date();
                        
                        if (today.getDay() === 6 || today.getDay() === 0) {
                                $('#good-service').addClass('is-hidden');
                                $('#service-closed').text('Night Tube Available');
                            } else { $('#good-service').addClass('is-hidden');
                                    $('#service-closed').text('Service Closed');
                                    $('#service-closed').addClass('text-title');
                        }

                    }

                    break;

            }
            */
};

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

/*var count = 0;
        for (var i = 0; i < messageBoard.messages.length; i++) {
            count += messageBoard.messages[i].votes;
        } return count;
        
    };*/

//Display Asteroids

app.displayAsteroids = function(asteroidArray) {

    console.log('Any Hazardous Asteroids? ' + asteroidArray);
    

    if ( $.inArray(true, asteroidArray) > -1 ){

        //var nearbyAsteriods = 'true';
        //app.displayBadDay(nearbyAsteriods);
       
        $('#asteroid').text('Nearby');
        $('#asteroid-title').text('Asteroids');
        $('#asteroid-svg').attr('src', 'img/asteroid2.svg');
        $('.tile-asteroid').addClass('asteroid-near');

    
    } else { $('#asteroid').text('No Near');
            $('#asteroid-svg').attr('src', 'img/asteroid.svg');
            $('#asteroid-title').text('Asteroids');
    } 
};

app.displayBadDay = function(asteroidArray, interruptedService, nearbyAsteriods) {

        $.when(interruptedService, nearbyAsteriods);

         var badDay = [];

         badDay = interruptedService.concat(nearbyAsteriods);

         console.log(badDay);

     //$('#asteroidCommentary').text('Stay away from windows today?');

 };   

app.displayClock = function() {
    
    $('#arrow' ).on('click', function() {
        $('.google').addClass('is-hidden').fadeOut('slow');
        $('.clock').fadeIn('slow').removeClass('is-hidden');
    }); app.runClock();
};

app.runClock = function() {

    londonTime = moment.tz.add('Europe/London|BST BDST GMT|0 -10 -20|0101010101010101010101010101010101010101010101010121212121210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2axa0 Rc0 1fA0 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 2Rz0 Dc0 1zc0 Oo0 1zc0 Rc0 1wo0 17c0 1iM0 FA0 xB0 1fA0 1a00 14o0 bb0 LA0 xB0 Rc0 1wo0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1a00 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1tA0 IM0 90o0 U00 1tA0 U00 1tA0 U00 1tA0 U00 1tA0 WM0 1qM0 WM0 1qM0 WM0 1tA0 U00 1tA0 U00 1tA0 11z0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 14o0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00');

    var londonDate = moment.tz(londonTime).format('dddd, MMMM Do, YYYY');
    var hours = moment.tz('Europe/London').format('hh');
    var daylightSavings = moment.tz('Europe/London').isDST();

    $('#day-label').append(londonDate);

    if (daylightSavings) {    
        $('.clock-label').text('British Summer Time');
        } else {
        $('.clock-label').text('Greenwhich Mean Time');
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

/*app.displayClock = function() {

    (function() {
        // Initialise the locale-enabled clocks
        initInternationalClocks();
        // Initialise any local time clocks
        initLocalClocks();
        // Start the seconds container moving
        moveSecondHands();
        // Set the intial minute hand container transition, and then each subsequent step
        setUpMinuteHands();
    })();

    /*
     *  Set up an entry for each locale of clock we want to use
     
    function getTimes() {
        moment.tz.add([
            'Eire|GMT IST|0 -10|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00',
        ]);
        var now = new Date();
        // Set the time manually for each of the clock types we're using
        var times = [{jsclass: 'js-london', jstime: moment.tz(now, 'Eire')}, ];
        return times;
    }

    /*
     * Set up the clocks that use moment.js
     
    function initInternationalClocks() {
        // Initialise the clock settings and the three times
        var times = getTimes();
        for (i = 0; i < times.length; ++i) {
            var hours = times[i].jstime.format('h');
            var minutes = times[i].jstime.format('mm');
            var seconds = times[i].jstime.format('ss');

            var degrees = [{
                hand: 'hours',
                degree: (hours * 30) + (minutes / 2)
            }, {
                hand: 'minutes',
                degree: (minutes * 6)
            }, {
                hand: 'seconds',
                degree: (seconds * 6)
            }];
            for (var j = 0; j < degrees.length; j++) {
                var elements = document.querySelectorAll('.active .' + times[i].jsclass + ' .' + degrees[j].hand);
                for (var k = 0; k < elements.length; k++) {
                    elements[k].style.webkitTransform = 'rotateZ(' + degrees[j].degree + 'deg)';
                    elements[k].style.transform = 'rotateZ(' + degrees[j].degree + 'deg)';
                    // If this is a minute hand, note the seconds position (to calculate minute position later)
                    if (degrees[j].hand === 'minutes') {
                        elements[k].parentNode.setAttribute('data-second-angle', degrees[j + 1].degree);
                    }
                }
            }
        }
        // Add a class to the clock container to show it
        var elements = document.querySelectorAll('.clock');
        for (var l = 0; l < elements.length; l++) {
            elements[l].className = elements[l].className + ' show';
        }
    }

    /*
     * Starts any clocks using the user's local time
     
    function initLocalClocks() {
        // Get the local time using JS
        var date = new Date;
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hours = date.getHours();

        // Create an object with each hand and it's angle in degrees
        var hands = [{
            hand: 'hours',
            angle: (hours * 30) + (minutes / 2)
        }, {
            hand: 'minutes',
            angle: (minutes * 6)
        }, {
            hand: 'seconds',
            angle: (seconds * 6)
        }];
        // Loop through each of these hands to set their angle
        for (var j = 0; j < hands.length; j++) {
            var elements = document.querySelectorAll('.local .' + hands[j].hand);
            for (var k = 0; k < elements.length; k++) {
                elements[k].style.transform = 'rotateZ(' + hands[j].angle + 'deg)';
                // If this is a minute hand, note the seconds position (to calculate minute position later)
                if (hands[j].hand === 'minutes') {
                    elements[k].parentNode.setAttribute('data-second-angle', hands[j + 1].angle);
                }
            }
        }
    }

    /*
     * Move the second containers
     
    function moveSecondHands() {
        var containers = document.querySelectorAll('.bounce .seconds-container');
        setInterval(function() {
            for (var i = 0; i < containers.length; i++) {
                if (containers[i].angle === undefined) {
                    containers[i].angle = 6;
                } else {
                    containers[i].angle += 6;
                }
                containers[i].style.webkitTransform = 'rotateZ(' + containers[i].angle + 'deg)';
                containers[i].style.transform = 'rotateZ(' + containers[i].angle + 'deg)';
            }
        }, 1000);
        for (var i = 0; i < containers.length; i++) {
            // Add in a little delay to make them feel more natural
            var randomOffset = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
            containers[i].style.transitionDelay = '0.0' + randomOffset + 's';
        }
    }

    /*
     * Set a timeout for the first minute hand movement (less than 1 minute), then rotate it every minute after that
     
    function setUpMinuteHands() {
        // More tricky, this needs to move the minute hand when the second hand hits zero
        var containers = document.querySelectorAll('.minutes-container');
        var secondAngle = containers[containers.length - 1].getAttribute('data-second-angle');
        console.log(secondAngle);
        if (secondAngle > 0) {
            // Set a timeout until the end of the current minute, to move the hand
            var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
            console.log(delay);
            setTimeout(function() {
                moveMinuteHands(containers);
            }, delay);
        }
    }

    /*
     * Do the first minute's rotation, then move every 60 seconds after
     
    function moveMinuteHands(containers) {
        for (var i = 0; i < containers.length; i++) {
            containers[i].style.webkitTransform = 'rotateZ(6deg)';
            containers[i].style.transform = 'rotateZ(6deg)';
        }
        // Then continue with a 60 second interval
        setInterval(function() {
            for (var i = 0; i < containers.length; i++) {
                if (containers[i].angle === undefined) {
                    containers[i].angle = 12;
                } else {
                    containers[i].angle += 6;
                }
                containers[i].style.webkitTransform = 'rotateZ(' + containers[i].angle + 'deg)';
                containers[i].style.transform = 'rotateZ(' + containers[i].angle + 'deg)';
            }
        }, 60000);
    }
};*/


app.init = function() {
    app.getAJAX();
    app.displayClock();
    $('.footer').removeClass('is-hidden');
};

$(document).ready(app.init);
