var app = {};

var undergroundName;
var undergroundStatus;
var currentTime;

app.getUnderground = function(){
   
   /* var tflUrl = 'https://api.tfl.gov.uk/line/mode/tube/status?';
    var app_id = 'app_id=2a49b2c6';
    var apiKey = '&app_key=19d97bbedc6a5b79a885b824afc220c3';

    $.ajax({
        url: tflUrl + app_id + apiKey,
        method: "GET",
        success: function(response){
            app.undergroundService(response);
            app.statusOverlay(response);
        }
    });
};*/

 //Dummy Data JSON Request
    $.getJSON('js/dummy-json/goodservice.json', function( response ) {
         app.undergroundService(response);
         app.undergroundNotifications(response);
        });
};

app.undergroundService = function(name){ 

            for (var i=0; i < name.length; i++) {
                
                var undergroundID = name[i].id;
                var undergroundName = name[i].name;
                var undergroundStatus = name[i].lineStatuses[0].statusSeverityDescription;

                var addLineID = $('#tfl').attr('id', undergroundID);
                var addLine = '<h6>' + undergroundName + ' '+ undergroundStatus + '</h6>';
                $(addLineID).append(addLine);             
            }
};


app.undergroundNotifications = function(service) {

    for (var i = 0; i < service.length; i++) {

        var undergroundName = service[i].name + ', ';
        var undergroundStatus = service[i].lineStatuses[0].statusSeverityDescription;
        //var makeList = JSON.parse(stringify); 

    
        var overlay = $('.toggle').hover(function() {
                $('#service-notifications').fadeOut('fast');
            }, function() {
                $('#service-notifications').fadeIn('fast');
        });      
        //if (undergroundStatus === 'Minor Delays' || 'Severe Delays' || 'Part Closure' || 'Part Suspended' || 'Suspended')  {

        if (undergroundStatus === 'Good Service'){
                    console.log('Good Service');
                    $('#good-service').text('Good Service'); 
        }

        else if (undergroundStatus === 'Service Closed'){
                    console.log('Service Closed');
                    $('.status-title').text('Service Closed on the ');
                    //$('#interruptions').addClass('is-hidden');
                    $('#service-closed').append(undergroundName);                   
                
        } else if (undergroundStatus !== 'Good Service' && 'Service Closed' ) {
                    console.log(undergroundStatus); 
                    $('#good-service').addClass('is-hidden');
                    $('.title').text('Interruptions on the ');
                    $('#interruptions').append(undergroundName);   

        } 
            //$('#interruptions').addClass('is-hidden');
        } 
}; 

app.statusLength = function(service){

};

app.init = function() {
    $(document).ready(app.getUnderground);
    $(document).ready(app.undergroundService);
    $(document).ready(app.undergroundNotifications);
};

$(document).ready(app.init);