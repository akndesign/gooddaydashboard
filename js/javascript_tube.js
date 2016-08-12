var app = {};

var serviceStatus;
var serviceName;
var currentTime;

app.getUnderground = function(){
    var weatherUrl = 'https://api.tfl.gov.uk/line/mode/tube,tram/status?';
    var app_id = 'app_id=2a49b2c6';
    var apiKey = '&app_key=19d97bbedc6a5b79a885b824afc220c3';

    $.ajax({
        url: weatherUrl + app_id + apiKey,
        method: "GET",
        success: function(response){
            app.undergroundService(response);
            //app.undergroundLine(response);
        }
    });
};

/*app.undergroundLine = function(name){
    for (var i=0; i < name.length; i++) {
            var serviceName = name[i].name;
            console.log(serviceName);
           //$('#status').text(serviceName); 
       }
};*/

app.undergroundService = function(name, services){
            
            for (var i=0; i < name.length; i++) {
                var undergroundID = name[i].id;
                var undergroundName = name[i].name;
                var undergroundStatus = name[i].lineStatuses[0].statusSeverityDescription;

                var addLineID = $('#tfl').attr('id', undergroundID);
                var addLine = '<h6>' + undergroundName + undergroundStatus + '</h6>';
                //var addLineService = '<div class="status">' + undergroundStatus + '</div>';
                
                $(addLineID).append(addLine);

                if (undergroundStatus !== 'Good Service'){
                     console.log(undergroundStatus);
                    //return false;
                }

                //'<li>'+ serviceName + '</li>';
                //var task = '<li>' + serviceStatus + '</li>'

                /*var serviceStatus = name[i].lineStatuses[0].statusSeverityDescription;

                if (serviceStatus === 'Good Service'){
                    $('#js-tfl' + serviceName).append(serviceStatus);
                    console.log(serviceStatus);
                }
                
                if (serviceStatus !== 'Good Service'){
                    console.log('Interruption' + serviceStatus);
                    //$('#js-tfl'+ serviceName).append(serviceStatus);
                }*/
            }
            //$('#js-tfl' + nameofLine );
            //console.log(serviceName);
            //$('#status').text(serviceName); 
};

app.timeofDay = function(){
    var currentTime = new Date();
    $("#time").text(currentTime);
};

app.init = function() {
    $(document).ready(app.timeofDay);
    $(document).ready(app.getUnderground);
    
};

$(document).ready(app.init);