$.getJSON('js/dummy-json/asteriodtrue.json', function(asteriodResponse) {

     var testst = moment.tz.add('America/Los_Angeles|PST PDT|80 70|01010101010|1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0');

     console.log(moment.tz);
     var asteriodArray = [];
     Date.prototype.yyyymmdd = function() {
         var mm = this.getMonth() + 1; // getMonth() is zero-based
         var dd = this.getDate();

         return [this.getFullYear(), !mm[1] && '0', mm, !dd[1] && '0', dd].join(''); // padding
     };

     var date = new Date();
     date.yyyymmdd();

     $.each(asteriodResponse.near_earth_objects, function(i, item) {


         var nasaAPIDay = [moment.tz('America/Los_Angeles').format('YYYY-MM-DD')];

         console.log(nasaAPIDay, typeof(nasaAPIDay));
         //for (var i = 0; i < asteriodResponse.near_earth_objects[nasaAPIDay].length; i++) {

         asteriod = asteriodResponse.near_earth_objects;
         asteriod2 = asteriod[nasaAPIDay];


         console.log(asteriod2);

         var asteriodHazard = asteriodResponse.near_earth_objects['2016-09-02'];
         var asteriodtest = asteriodResponse.near_earth_objects[nasaAPIDay];
         var aseriodtest2 = asteriodResponse.near_earth_objects.yyyymmdd;
         console.log(asteriodHazard, asteriodtest, aseriodtest2, typeof(asteriodHazard), typeof(asteriodtest), typeof(aseriodtest2));

         //asteriodArray.push(asteriodHazard);
         //app.displayAsteriods(asteriodArray);
     });
 });

app.displayAsteriods = function(asteriodArray) {

    console.log(asteriodArray);

    var element = 'true';
    
    var idx = asteriodArray.indexOf(element);
    
    if (idx = -1) {
        console.log('happy');
    } else {
        console.log('sad');
    };