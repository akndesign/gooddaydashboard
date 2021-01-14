var app = {};

app.getAJAX = function() {

    var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=';
    var apiWeatherKey = 'ea43d349fe09f49a0d21b5607b77208c';
    
    var tflUrl = 'https://api.tfl.gov.uk/line/mode/tube/status?';
    var app_id = 'app_id=2a49b2c6';
    var apiUndergroundKey = '&app_key=19d97bbedc6a5b79a885b824afc220c3';

    var asteroidUrl = 'https://ssd-api.jpl.nasa.gov/fireball.api?date-min=';
    var nasaAPIDay = moment.tz('America/Los_Angeles').format('YYYY-MM-DD');

    var asteriodURL = (asteroidUrl + nasaAPIDay); 

    console.log("Looking at my code, are we? ;) Why don't we have a chat -- email me at alexander@akndesign.com");

    $.when(
        
        $.get(weatherUrl + apiWeatherKey),
        //$.getJSON('js/dummy-json/weather/clouds.json'),
        //$.get(tflUrl + app_id + apiUndergroundKey),
        $.getJSON('js/dummy-json/tube/nighttube.json'), //<-- this causes a huge bug!
        $.get(asteroidUrl + nasaAPIDay),
        //$.getJSON('js/dummy-json/asteroidtrue.json'),
        //$.get(asteroidUrl + apiKey)
        //MAKE SURE TO MANUALLY CHANGE TO THE CURRENT DATE IN CALIFORNIA, OR CHANGE TO LIVE VERSION

     ).done(function(weatherResponse, undergroundResponse, asteroidResponse) {

        var weatherandAsteroidArray = [];
        var asteroidArray = [];
        var weatherCondition = weatherResponse[0].weather[0].main;

        var asteroidCount = asteroidResponse[0].count;


        asteroidArray.push(asteroidCount);

        $('.service-board').hover(function() {
            $('#service-notifications').fadeOut();
        }, function() { 
            $('#service-notifications').fadeIn();
        });

        weatherandAsteriodArray = asteroidArray.concat(weatherCondition);
        
        app.displayUndergroundOverlay(undergroundResponse);
        app.displayWeather(weatherCondition, weatherResponse);
        app.displayAsteroids(asteroidArray);
        app.displayBadDay(weatherCondition, asteroidArray, undergroundResponse[0]);
        app.runClock(weatherResponse);

      });
 };
  
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
    var otherLines = [' lines'];
    var pluralLines = [' lines'];
    var singleLine = [' line'];

    undergroundResponse[0].forEach(function(line) {

         var undergroundID = line.id;
         var undergroundName = line.name;
         var undergroundStatus = line.lineStatuses[0].statusSeverityDescription;
         var addLineID = $('#undergroundStatus').attr('id', undergroundID);

         var dayorEvening = moment().add('Europe/London').format('e');

        switch (undergroundStatus) {

            case 'Good Service':

            goodService.push(undergroundName);

                $('#good-service').text('Good').append('<div id="good-title"></div>');
                $('#good-title').text('service');
                $('#weatherStart').addClass('is-hidden');
               
                $('.service-board').hover(function() {
                        $(addLineID).removeClass('is-trans-hidden');
                        $('.undergroundStatus').removeClass('is-trans-hidden');
                        $(addLineID).text(undergroundName); 
                        //$(addLineID).append('<img class="good-icon">');
                        $(addLineID).append('<span class="undergroundStatus">' + undergroundStatus + '<img class="good-icon">' + '</span>');
                    }, function() { 
                        $('.undergroundStatus').addClass('is-trans-hidden');
                        $(addLineID).addClass('is-trans-hidden');

                        });

                break;

             case 'Part Closure': 
             case 'Planned Closure':   

                    partClosure.push(undergroundName);

                    if ($(partClosure).length === 1) {

                        var partclosureSingleLine = partClosure.join(', ').concat(singleLine);

                        $('#partclosure').text('Planned closure on the ' + partclosureSingleLine);
                        $('#partclosure').addClass('interruptions');
                        $('#interruptions').removeClass('interruptions').addClass('closure-interruptions');

                        $('#closed-title').addClass('is-hidden');

                        $('.service-board').hover(function() {
                            $(addLineID).removeClass('is-trans-hidden');
                            $(addLineID).text(undergroundName); 
                            //$(addLineID).append('<img class="interruptions-icon">');
                            $(addLineID).append('<span class="undergroundStatus">' + undergroundStatus + '<img class="interruptions-icon">' + '</span>');
                        }, function() { 
                            $(addLineID).addClass('is-trans-hidden');
                        });
                    

                    } else if ($(partClosure).length === 2) {

                        var partclosurePluralLines = partClosure.join(' and ').concat(pluralLines);
                        

                        $('#partclosure').text('Planned Closures on the ' + partclosurePluralLines);
                        $('#partclosure').addClass('interruptions');
                        $('#interruptions').removeClass('interruptions').addClass('closure-interruptions');
                        $('#interruptions-title').text('Closures');
                        $('#good-service').addClass('is-hidden');
                        //$('#interruptions-title').addClass('interruptions-text-title');

                        $('.service-board').hover(function() {
                            $(addLineID).removeClass('is-trans-hidden');
                            $('.undergroundStatus').removeClass('is-trans-hidden');
                            $(addLineID).text(undergroundName); 
                            //$(addLineID).append('<img class="interruptions-icon">');
                            $(addLineID).append('<span class="undergroundStatus">' + undergroundStatus + '<img class="interruptions-icon">' + '</span>');
                           
                        }, function() { 
                            $('.undergroundStatus').addClass('is-trans-hidden');
                            $(addLineID).addClass('is-trans-hidden');
                        });
                        //$(interruptionPluralLine.push('and'));

                    } else {


                        var partclosureOtherLines = //partClosure.join(', ').concat(otherLines).last('hello');
                        [partClosure.slice(0, -1).join(', '), partClosure.slice(-1)[0]].join(partClosure.length < 2 ? '' : ' and ').concat(otherLines);
                        

                        $('#partclosure').text('Planned Closures on the ' + partclosureOtherLines);
                        $('#partclosure').addClass('interruptions');
                        $('#interruptions').removeClass('interruptions').addClass('closure-interruptions');
                        $('#interruptions-title').text('Some').append('<div id="interruptions-subtitle"></div>');
                        $('#interruptions-subtitle').text('Closures');
                        
                        //$('#closed-title').removeClass('is-hidden').text('Closures');
                        //$('#interruptions-title').addClass('interruptions-text-title');

                        $('.service-board').hover(function() {
                            $(addLineID).removeClass('is-trans-hidden');
                            $('.undergroundStatus').removeClass('is-trans-hidden');
                            $(addLineID).text(undergroundName); 
                            //$(addLineID).append('<img class="interruptions-icon">');
                            $(addLineID).append('<span class="undergroundStatus">' + undergroundStatus + '<img class="interruptions-icon">' + '</span>');
                        }, function() { 
                            $('.undergroundStatus').addClass('is-trans-hidden');
                            $(addLineID).addClass('is-trans-hidden');

                        });



                    } break;

            case 'Service Closed':

                serviceClosed.push(undergroundName);

                if ($(serviceClosed).length === 1) {

                    var serviceClosedSingle = serviceClosed.concat(singleLine);

                    $('#service-closed').text('Service Closed on the ').addClass('interruptions');
                    $('#service-closed').append(serviceClosedSingle);

                    $('.service-board').hover(function() {
                            $(addLineID).removeClass('is-trans-hidden');
                            $('.undergroundStatus').removeClass('is-trans-hidden');
                            $(addLineID).text(undergroundName); 
                            $(addLineID).append('<img class="closed-icon">');
                            $(addLineID).append('<span class="undergroundStatus">' + undergroundStatus + '</span>');
                        }, function() { 
                            $('.undergroundStatus').addClass('is-trans-hidden');
                            $(addLineID).addClass('is-trans-hidden');
                    });

                    //$(serviceClosedString.push('and'));

                } else if ($(serviceClosed).length === 2) {

                    var serviceClosedPlural = serviceClosed.join(' and ').concat(pluralLines);

                    $('#service-closed').text('Service Closed on the ').addClass('closure-interruptions');
                    $('#service-closed').append(serviceClosedPlural);
                    //$(addLineID).append('<img class="closed-icon">');

                    $('.service-board').hover(function() {
                            $(addLineID).removeClass('is-trans-hidden');
                            $('.undergroundStatus').removeClass('is-trans-hidden');
                            $(addLineID).text(undergroundName); 
                            $(addLineID).append('<img class="closed-icon">');
                            $(addLineID).append('<span class="undergroundStatus">' + undergroundStatus + '</span>');
                        }, function() { 
                            $('.undergroundStatus').addClass('is-trans-hidden');
                            $(addLineID).addClass('is-trans-hidden');
                        });
                    //$(serviceClosedString.push('and'));

                } else {

                    //COMMENT THIS BACK IN ONCE NIGHT TUBE SERVICE IS AVAILABLE

                    /*var today = moment().add('Europe/London').format('e');

                    if (today === '5' || today === '6') {

                        var nightTubeGoodService = [goodService.slice(0, -1).join(', '), goodService.slice(-1)[0]].join(goodService.length < 2 ? '' : ' and ').concat(otherLines);

                        $('#night-tube').text('Good Service on the ' + nightTubeGoodService).addClass('interruptions');
                        $('#good-service').addClass('is-hidden');
                        $('#interruptions-title').text('Night Tube Service').addClass('interruptions-text-title');
                        $('#service-closed').addClass('is-hidden');
                        $('#weatherStart').addClass('is-hidden');
                        $('#tflCommentary').text("Woohoo, Night Tube – Party On! Otherwise, it's");

                        $('.service-board').hover(function() {
                            $(addLineID).removeClass('is-trans-hidden');
                            $('.undergroundStatus').removeClass('is-trans-hidden');
                            $(addLineID).text(undergroundName); 
                            $(addLineID).append('<img class="closed-icon">');
                            $(addLineID).append('<span class="undergroundStatus">' + undergroundStatus + '</span>');
                        }, function() { 
                            $('.undergroundStatus').addClass('is-trans-hidden');
                            $(addLineID).addClass('is-trans-hidden');
                        });

                    } else {*/

                        $('#good-service').addClass('is-hidden');
                        $('#interruptions-title').addClass('text-title');
                        $('#interruptions-title').text('Service Closed');
                        //$('#closed-title').text('closed');
                        $('#service-closed').addClass('is-hidden');
                        $('#tflCommentary').text("Night Bus Hour :( Otherwise it's");
                        $('#weatherStart').addClass('is-hidden');

                       $('.service-board').hover(function() {
                            $(addLineID).removeClass('is-trans-hidden');
                            $('.undergroundStatus').removeClass('is-trans-hidden');
                            $(addLineID).text(undergroundName); 
                            $(addLineID).append('<img class="closed-icon">');
                            $(addLineID).append('<span class="undergroundStatus">' + undergroundStatus + '</span>');
                        }, function() { 
                            $('.undergroundStatus').addClass('is-trans-hidden');
                            $(addLineID).addClass('is-trans-hidden');
                        });
                    };
               
            break;

               

            default:

                interruption.push(undergroundName);

           
                if ($(interruption).length === 1) {

                    var interruptionSingleLine = interruption.join(' ').concat(singleLine);

                    $('#interruptions').text('Interruption on the ' + interruptionSingleLine);
                    $('#service-closed').removeClass('interruptions').addClass('closure-interruptions');

                    $('.service-board').hover(function() {
                            $(addLineID).removeClass('is-trans-hidden');
                            $(addLineID).text(undergroundName); 
                            $(addLineID).append('<img class="interruptions-icon">');
                            $(addLineID).append('<span class="undergroundStatus">' + undergroundStatus + '</span>');
                            
                        }, function() { 
                            $('.undergroundStatus').addClass('is-trans-hidden');
                            $(addLineID).addClass('is-trans-hidden');
                        });
                    //$(interruptionSingleLine.push('and'));

                } else if ($(interruption).length === 2) {

                    var interruptionPluralLines = interruption.join(' and ').concat(pluralLines);

                    $('#interruptions').text('Interruptions on the ' + interruptionPluralLines).addClass('interruptions');
                    $('#service-closed').removeClass('interruptions').addClass('closure-interruptions');
                    $('#weatherStart').addClass('is-hidden');
                    $('#tflCommentary').text('Replan travels on the Underground if needed, otherwise');

                      $('.service-board').hover(function() {
                            $(addLineID).removeClass('is-trans-hidden');
                            $(addLineID).text(undergroundName); 
                            $(addLineID).append('<img class="interruptions-icon">');
                            $(addLineID).append('<span class="undergroundStatus">' + undergroundStatus + '</span>');
                            
                        }, function() { 
                            $('.undergroundStatus').addClass('is-trans-hidden');
                            $(addLineID).addClass('is-trans-hidden');
                        });

                } else {

                    var interruptionOtherLines = [interruption.slice(0, -1).join(', '), interruption.slice(-1)[0]].join(interruption.length < 2 ? '' : ' and ').concat(otherLines);

                    $('#good-service').addClass('is-hidden');
                    $('#service-closed').removeClass('interruptions').addClass('closure-interruptions');
                    $('#interruptions').text('Interruptions on the ' + interruptionOtherLines).addClass('interruptions');
                    $('#interruptions-title').text('Interrupted Service').addClass('interruptions-text-title');
                    $('#weatherStart').addClass('is-hidden');
                    $('#tflCommentary').text("The Underground looks a bit broken today – otherwise it's");

                    $('.service-board').hover(function() {
                        $(addLineID).removeClass('is-trans-hidden');
                        $(addLineID).text(undergroundName); 
                        $(addLineID).append('<img class="interruptions-icon">');
                        $(addLineID).append('<span class="undergroundStatus">' + undergroundStatus + '</span>');
                        
                    }, function() { 
                        $('.undergroundStatus').addClass('is-trans-hidden');
                        $(addLineID).addClass('is-trans-hidden');
                    });
                }
                
                break;
        }
    });
};

//Display Weather 

app.displayWeather = function(weatherCondition, weatherResponse) {

    var city = weatherResponse[0].name;
    var temperature = Math.round(weatherResponse[0].main.temp-273.15);
    var tempFahrenheit = Math.round((weatherResponse[0].main.temp)*9/5 - 459.67);
    var feelsLike = Math.round(weatherResponse[0].main.feels_like-273.15);
    var currentCondition = weatherResponse[0].weather[0].main;
    
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

    //console.log('Actual Temperature ', temperature,'°C',';', 'Feels Like', feelsLike,'°C');

    if (temperature >= 29) {

            $('.tile-weather').addClass('hot');
            $('#temperature').text(temperature + '°C');
            $('#tempFahrenheit').text(tempFahrenheit + '°F');
            //$('#temperaturecondition').text("It's hot! ");
            $('#hot').text(' a hot day!');
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

    switch (currentCondition) {

            case 'Fog':
            case 'Clouds':

            $('.tile-weather').addClass('clouds');
            $('#weathercondition').text(currentCondition);
            $('#weatherCommentary').text(' an average, grey day in London.');

            break;

            case 'Haze':

            $('.tile-weather').addClass('haze');
            $('#weathercondition').text(currentCondition);
            $('#weatherCommentary').text(' an average day in London.');

            break;

            case 'Clear':

            $('.tile-weather').addClass('clear');
            $('#weathercondition').text(currentCondition);
            $('#weatherCommentary').text(' a good day in London.');

                //app.displayBadDay(weatherCondition);

                break;

            case 'Rain':
            case 'Light Rain':
            case 'Heavy Rain':
            

                $('.tile-weather').addClass('rain');
                $('#weathercondition').text(currentCondition + ' :(');
                $('#weatherStart').addClass('is-hidden');
                $('#weatherStart').addClass('is-hidden');
                $('#weatherCommentary').text(' best to bring an umbrella!');

                
                break;

            case 'Thunderstorm': 
            
            $('.tile-weather').addClass('thunderstorm');
            $('#weathercondition').text(currentCondition + ' ⚡');
            $('#weatherStart').addClass('is-hidden');
            $('#weatherStart').addClass('is-hidden');
            $('#weatherCommentary').text(' best to stay indoors!');  

            break; 

            case 'Snow':

                $('.tile-weather').addClass('snow');
                $('#weathercondition').text(currentCondition);
                $('#weatherStart').addClass('is-hidden');
                $('#hot').append(' snowing in London?? Madness!');

                break;
            
            case 'Mist':
            case 'Drizzle':

                $('.tile-weather').addClass('mist');
                $('#weathercondition').text(currentCondition);
                $('#weatherStart').addClass('is-hidden');
                $('#weatherCommentary').text(' weather that is like your eyes watching Jack slip in ocean (spoiler!)');

                break;

            case 'Smoke':    
            case 'Ash':
            case 'Squall':
            case 'Tornado': 
            case 'Dust':
            case 'Sand':
        
                $('.tile-weather').addClass('hot');
                $('#weathercondition').text(currentCondition);
                $('#weatherStart').addClass('is-hidden');
                $('#weatherCommentary').text(' a pretty unusual day out there, stay safe mate!');

            break;

            default:
                $('#weathercondition').text(currentCondition);

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

/*
    if (feelsLike === temperature) {
            $('#feelslike').text('Feels similar');
        } else  if (feelsLike >= (temperature + 2)) { 
            $('#feelslike').text('Feels warmer');
        } else  if (feelsLike < (temperature + 2)) {
            $('#feelslike').text('Feels like ' + feelsLike + '°C');    
        } else  if (feelsLike >= (temperature + -2)) { 
            $('#feelslike').text('Feels cooler');
        } else  if (feelsLike < (temperature + -2)) {
            $('#feelslike').text('Feels like ' + feelsLike + '°C');
        }
    };    
*/
//Display Asteroids

app.displayAsteroids = function(asteroidArray) {

    //console.log('Any Hazardous Asteroids? ' + asteroidArray);

    if (asteroidArray > 0 ){

        $('#asteroid').text('Nearby');
        $('#asteroid-title').text('Asteroids');
        $('#asteroid-svg').attr('src', 'img/asteroid2.svg');
        $('.tile-asteroid').addClass('asteroid-near');
    
    } else {

    { $('#asteroid').text('No Near');
            $('#asteroid-svg').attr('src', 'img/asteroid.svg');
            $('#asteroid-title').text('Asteroids');
    } 
}
};

app.displayBadDay = function(weatherCondition, asteroidArray, undergroundResponse) {

    //console.log(weatherCondition);

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

    if (asteroidArray >= 1 ){

            asteroidArraySimplified = 'Nearby Asteroids';
    
            asteroid.push(asteroidArraySimplified);
            asteriodWeather.push(asteroidArraySimplified);
            asteriodUnderground.push(asteroidArraySimplified);
            reallyBadDay.push(asteroidArraySimplified); 
            //console.log(asteriodWeather);

    };

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

            //console.log(asteriodUnderground);

    break;
    
        }
    };

    switch (weatherCondition) {

            case 'Rain':
            case 'Smoke':    
            case 'Ash':
            case 'Squall':
            case 'Tornado': 
            case 'Dust':
            case 'Sand':
            case 'Thunderstorm':
            case 'Fog':

            weather.push(weatherCondition);
            asteriodWeather.push(weatherCondition);
            undergroundWeather.push(weatherCondition);
            reallyBadDay.push(weatherCondition);

            //console.log(asteriodWeather);
    break;
    
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


app.runClock = function(weatherResponse) {


    londonTime = moment.tz.add('Europe/London|BST BDST GMT|0 -10 -20|0101010101010101010101010101010101010101010101010121212121210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2axa0 Rc0 1fA0 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 2Rz0 Dc0 1zc0 Oo0 1zc0 Rc0 1wo0 17c0 1iM0 FA0 xB0 1fA0 1a00 14o0 bb0 LA0 xB0 Rc0 1wo0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1a00 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1tA0 IM0 90o0 U00 1tA0 U00 1tA0 U00 1tA0 U00 1tA0 WM0 1qM0 WM0 1qM0 WM0 1tA0 U00 1tA0 U00 1tA0 11z0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 14o0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00');

    var hours = moment.tz('Europe/London').format('hh');
    var daylightSavings = moment.tz('Europe/London').isDST();

    var londonDate = moment.tz(londonTime).format('dddd, MMMM Do, YYYY');
    var londonEpoch = moment.tz(londonTime).format('X');

    var sunriseDataEpoch = weatherResponse[0].sys.sunrise;
    var sunsetDataEpoch = weatherResponse[0].sys.sunset;
    
    var sunriseDifferenceinSeconds = (sunriseDataEpoch - (+londonEpoch));
        //(sunriseDataEpoch - (+londonEpoch));
    var sunriseinHours = Math.round(sunriseDifferenceinSeconds / 3600);

    var sunsetDifferenceinSeconds = (sunsetDataEpoch - (+londonEpoch));
    var sunsetinHours = Math.round(sunsetDifferenceinSeconds / 3600);

    $('#day-label').text(londonDate);

    if (daylightSavings) {   
        $('#currenttimezone').text('BST');
        } else {
        $('#currenttimezone').text(' GMT');
    } 
    
    (function sunRise () {
                    
        if (sunriseDifferenceinSeconds <= 29400 && sunriseDifferenceinSeconds > 3600 ) {
            $('.tile-clock').addClass('nightime');
            $('#moon-svg').attr('src', 'img/moon.svg');
            $('#sunrise').removeClass('is-hidden');
            $('#sunset').addClass('is-hidden');
            $('#moon-svg').attr('src', 'img/moon.svg');
            $('#sunrise').text('Sunrise is in ' + sunriseinHours + ' hours '); 
            
        } else if (sunriseDifferenceinSeconds === 3600) {
            $('.tile-clock').removeClass('nightime').addClass('sunset-after');
            $('#sunrise').removeClass('is-hidden');
            $('#sunset').addClass('is-hidden');
            $('#moon-svg').addClass('is-hidden');
            $('#sunrise').text('Sunrise is in an hour '); 

        } else if (sunriseDifferenceinSeconds < 3600 && sunriseDifferenceinSeconds >= 500) {
            $('#sunrise').removeClass('is-hidden');
            $('#sunset').addClass('is-hidden');
            $('#moon-svg').addClass('is-hidden');
            $('.tile-clock').addClass('sunset-after');
            $('#sunrise').text('Sunrise is soon'); 

        }  else if (sunriseDifferenceinSeconds < 500 && sunriseDifferenceinSeconds >= ~7200 ) { 
            $('#sunrise').removeClass('is-hidden');
            $('#sunset').addClass('is-hidden');
            $('#moon-svg').addClass('is-hidden');
            $('.tile-clock').addClass('sunset');
            $('#sunrise').text('Dawn'); 

        } else if (sunriseDifferenceinSeconds < ~7200 && sunriseDifferenceinSeconds >= ~18000 ) { 
            $('#sunset').addClass('is-hidden');
            $('#moon-svg').addClass('is-hidden');
            $('.tile-clock').removeClass('sunset');
            $('#sunrise').text('Sunrise was ' + (sunriseinHours * -1) + ' hours ago '); 

        } else if (sunriseDifferenceinSeconds < ~18000 && sunriseDifferenceinSeconds >= ~21600 ) { 
            $('#sunrise').text('Midday');
            $('#moon-svg').addClass('is-hidden');  
            $('.tile-clock').removeClass('sunset');
        }

    setTimeout(sunRise, 1000);

    })(); 

   (function sunSet () {
    
        if (sunsetDifferenceinSeconds <= 10800 && sunsetDifferenceinSeconds > 3600 ) {
            $('#sunrise').addClass('is-hidden');
            $('#sunset').text('Sunset is in ' + sunsetinHours + ' hours '); 
            $('#moon-svg').addClass('is-hidden');
            
        } else if (sunsetDifferenceinSeconds === 3600) {
            $('.tile-clock').addClass('sunset-before');
            $('#moon-svg').addClass('is-hidden');
            $('#sunset').text('Sunset is in an hour '); 

        } else if (sunsetDifferenceinSeconds < 3600 && sunsetDifferenceinSeconds >= 500) {
            $('#sunrise').addClass('is-hidden');
            $('.tile-clock').removeClass('sunset').addClass('sunset-before');
            $('#moon-svg').addClass('is-hidden');
            $('#sunset').text('Sunset is soon'); 

        }  else if (sunsetDifferenceinSeconds < 500 && sunsetDifferenceinSeconds >= ~3600 ) { 
            $('#sunrise').addClass('is-hidden');
            $('.tile-clock').removeClass('sunset-before').addClass('sunset');
            $('#moon-svg').addClass('is-hidden');
            $('#sunset').text('Sunset'); 

        } else if (sunsetDifferenceinSeconds < ~3600 && sunsetDifferenceinSeconds > ~7200) {
            $('.tile-clock').removeClass('sunset').addClass('sunset-after');
            $('#sunrise').text('Sunset was an hour ago '); 
            $('#moon-svg').addClass('is-hidden');
        } 

        else if (sunsetDifferenceinSeconds <= ~7200 && sunsetDifferenceinSeconds >= ~10800) {
            $('.tile-clock').removeClass('sunset-after').addClass('nightime');
            $('#sunrise').text('Sunset was ' + (sunsetinHours * -1) + ' hours ago '); 
            $('#moon-svg').attr('src', 'img/moon.svg');

        } 

        else if (sunsetDifferenceinSeconds < ~10800 && sunsetDifferenceinSeconds > ~29400) {
            $('.tile-clock').addClass('nightime');
            $('#sunrise').addClass('is-hidden');
            $('#sunset').text('Nightime ');
            $('#moon-svg').attr('src', 'img/moon.svg');

        }

    setTimeout(sunSet, 1000);

    })(); 

    var dialLines = $('.diallines');

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

app.loaderFadeOut = function(){

var twentyFourHours = moment.tz('Europe/London').format('HH');
var userTimeZone = moment.tz.guess(true);
var userTimeZonetwentyFourHours = moment.tz("'" + userTimeZone + "'").format('HH');

(function loaderGreeting () {

if (userTimeZonetwentyFourHours >= 1 && userTimeZonetwentyFourHours < 5 ) {
    $('.loader-greeting').text('Hello night owl');

} else if (userTimeZonetwentyFourHours >= 5 && userTimeZonetwentyFourHours < 12) {
    $('.loader-greeting').text('Morning');

} else if (userTimeZonetwentyFourHours >= 12 && userTimeZonetwentyFourHours < 17) {
    $('.loader-greeting').text('Afternoon');

} else if (userTimeZonetwentyFourHours >= 17 || userTimeZonetwentyFourHours < 1) {
    $('.loader-greeting').text('Good evening');
            
}
    setTimeout(loaderGreeting, 5000);
    
})();

setTimeout(function() {
       $('.loading-text').removeClass("fadeInUp");
       $('.loading-text').addClass("fadeOutUp");
       $('#loader-1').removeClass("fadeInUp");
       $('#loader-1').addClass("fadeOutUp");
       $('.loading-header').addClass("animated animatedFadeInUp fadeOutUp");
   } .bind(this), 1000);

}; 

app.removeWidget = function(){

    $('#closeMessage').on('click', function(c){
        $(this).closest('.tile-message').fadeOut('slow');
    }); 
};

app.init = function() {
    app.loaderFadeOut();
    app.getAJAX();
    app.removeWidget();
};

$(document).ready(app.init);
