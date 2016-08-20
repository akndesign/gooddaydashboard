var app = {};

//WEATHER APP

app.getWeather = function() {
    var weatherUrl = 'http://api.openweathermap.org/data/2.5/find?q=';
    var city = 'london';
    var celcius = '&units=metric';
    var apiKey = '&appid=ea43d349fe09f49a0d21b5607b77208c';

    $.ajax({
        url: weatherUrl + city + celcius + apiKey,
        method: 'GET',
        beforeSend: function(){ 
        $('#weather').html('Loading...');
        },
        success: function(response) {
            for (var key in response.list[0]) {
                if (key === 'name') {
                    $('#city').text(response.list[0][key]);
                } else if (key === 'main') {
                    var temperature = Math.round(response.list[1].main.temp);
                    $('#temperature').text(temperature + '°C');
                } else if (key === 'weather') {
                    var weatherCondition = response.list[1].weather[0].main;
                    $('#weathercondition').text(weatherCondition + ', ');
                }
            }
        }
    });
};

//UNDERGROUND

app.getUndergroundData = function() {

    var tflUrl = 'https://api.tfl.gov.uk/line/mode/tube/status?';
    var app_id = 'app_id=2a49b2c6';
    var apiKey = '&app_key=19d97bbedc6a5b79a885b824afc220c3';

    $.ajax({
        url: tflUrl + app_id + apiKey,
        method: 'GET',
        beforeSend: function(){ 
        $('#service-board').html('Loading...');
        },
        success: function(response){
            app.displayUndergroundService(response);
            app.undergroundNotifications(response);
        }
    });
};

  /*  //Dummy Data JSON Request
    $.getJSON('js/dummy-json/serviceclosed.json', function(response) {
        app.displayUndergroundService(response);
        app.undergroundNotifications(response);
    });
};*/

app.displayUndergroundService = function(name) {

    if (!name) {
        name = [];
    }

    for (var i = 0; i < name.length; i++) {

        var undergroundID = name[i].id;
        var undergroundName = name[i].name;
        var undergroundStatus = name[i].lineStatuses[0].statusSeverityDescription;

        var addLineID = $('#tfl').attr('id', undergroundID);
        var addLine = '<h6>' + undergroundName + ' ' + undergroundStatus + '</h6>';
        $(addLineID).append(addLine);
    }
};

//RESPONSES

app.undergroundNotifications = function(service) {

    var serviceClosed = [];

    if (!service) {
        service = [];
    }

    for (var i = 0; i < service.length; i++) {

        var undergroundName;
        //var linePural = service.length(count >= 1 ? this: 's');

        if (i === service.length - 2) {
            undergroundName = service[i].name + ' and ';
        } else if (i === service.length - 1) {
            undergroundName = service[i].name + ' lines';
        } else {
            undergroundName = service[i].name + ', ';
        }
        //else if (i === service.length - 4) {
        //undergroundName = service[i].name + ' and other ';

        var undergroundStatus = service[i].lineStatuses[0].statusSeverityDescription;

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
    }
};

app.undergroundNotificationsOverlay = function(service) {

    $('.toggle').hover(function() {
        $('#service-notifications').fadeOut('fast');
    }, function() {
        $('#service-notifications').fadeIn('fast');
    });
};

/*var count = 0;
        for (var i = 0; i < messageBoard.messages.length; i++) {
            count += messageBoard.messages[i].votes;
        } return count;
        
    };*/

app.getAsteriods = function() {

    var asteriodUrl = 'https://api.nasa.gov/neo/rest/v1/feed/today?detailed=false';
    var apiKey = '&api_key=PT3Ux5XFGFqnK869ovrGVMS5SBciZGmQ0I0LnkrC';

    $.ajax({
        url: asteriodUrl + apiKey,
        method: 'GET',
        beforeSend: function(){ 
        $('#asteriod').html('Loading...');
        },
        success: function(response) {

            moment.tz.add(['America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0']);

            var nasaAPIDay = moment().tz('America/Los_Angeles').format('YYYY-MM-DD');
            var asteriod = response.near_earth_objects[nasaAPIDay];

            for (var i = 0; i < asteriod.length; i++) {
                var asteriodData = asteriod[i].is_potentially_hazardous_asteroid;

                if (asteriodData) {
                    return $('#asteriod').text('Asteroids are nearby');
                } else {
                    $('#asteriod').text('No nearby asteriods');
                }
            }

        }
    });
};

app.getGoogleCalendar = function() {

    /*$.ajax({
        url: 'https://www.googleapis.com/auth/calendar.readonly' + "559328610579-le432q0suco7hf1l4mohephcsvss0amm.apps.googleusercontent.com",
        method: "GET",
        dataType: 'json',
        success: function(response) { 
            checkAuth(response); 
            handleAuthResult(response); 
            handleAuthClick(response);
        }
    });
      /**
       * Check if current user has authorized this application.
       */
      function checkAuth() {
        console.log(hello);
        gapi.auth.authorize(
          {
            'client_id': "559328610579-le432q0suco7hf1l4mohephcsvss0amm.apps.googleusercontent.com",
            'scope': ["https://www.googleapis.com/auth/calendar.readonly"].join(' '),
            'immediate': true
          }, handleAuthResult);
      }

      /**
       * Handle response from authorization server.
       *
       * @param {Object} authResult Authorization result.
       */
      function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

      /**
       * Load Google Calendar client library. List upcoming events
       * once client library is loaded.
       */
      function loadCalendarApi() {
        gapi.client.load('calendar', 'v3', listUpcomingEvents);
      }

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
          appendPre('Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendPre(event.summary + ' (' + when + ')')
            }
          } else {
            appendPre('No upcoming events found.');
          }

        });
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('output');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }
};

//var asteriod = asteriodResponse + nasaAPIDay;

//console.log(asteriod);

/*for (var key in asteriod) {
    console.log(response);
}*/

app.init = function() {
    app.getGoogleCalendar();
    app.getUndergroundData();
    app.displayUndergroundService(name);
    app.undergroundNotificationsOverlay();
    // app.undergroundNotifications();
    app.getWeather();
    app.getAsteriods();
};

$(document).ready(app.init);