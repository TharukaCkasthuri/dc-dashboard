var margin = {top: 20, right: 20, bottom: 70, left: 90},
width = 400 - margin.left - margin.right,
height = 550 - margin.top - margin.bottom;


// get the div id
var taxChart = dc.barChart("#tax");
var hourChart = dc.barChart("#hour");
var weekChart = dc.barChart("#weekday");
var monthChart = dc.barChart("#month");

var scaleWeek = d3.scaleOrdinal()
                .domain(['Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ])
                .range([0,1,2,3,4,5,6]);

var scaleMonth = d3.scaleOrdinal()
                .domain(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November' , 'December'  ])
                .range([0,1,2,3,4,5,6,7,8,9,10,11]);

d3.csv("http://localhost:8000/transaction.csv", function(error, data) {
    if (error) throw error;
   
    data.forEach(function(d) {
        d.taxonomy_0 = d.TAXONOMY_0;
    });
    
    var ndx = crossfilter(data)
    var taxDimension = ndx.dimension(function(d) {return d.TAXONOMY_0;})
    var taxGroup = taxDimension.group();

    var hourDimension = ndx.dimension(function(d){return parseInt(d.Hour);})
    var hourGroup = hourDimension.group();

    //SUBMITTED_DATE = 9/22/2017 18:27
    var weekDimension = ndx.dimension(function(d){return moment(d.SUBMITTED_DATE, "MM/DD/YYYY HH:mm").format('dddd');})
    var weekGroup = weekDimension.group();
    
    var monthDimension = ndx.dimension(function(d){return moment(d.SUBMITTED_DATE, "MM/DD/YYYY HH:mm").format('MMMM');})
    var monthGroup = monthDimension.group();

    taxChart
        .width(600)
        .height(600)
        .x(d3.scaleOrdinal().domain(taxDimension))
	    .xUnits(dc.units.ordinal)
        .brushOn(false)
        .yAxisLabel("Taxonomy")
        .elasticX(true)
        .margins({left: 60, right: 30, top: 30, bottom: 80})
        .dimension(taxDimension)
        .group(taxGroup);
    taxChart.render();

    taxChart.on("postRender", function(chart) {
        chart.select('.axis.x')
            .attr("text-anchor", "end")
            .selectAll("text")
            .attr("transform", "rotate(-30)")
            .attr("dy", "-0.7em")
            .attr("dx", "-1em");
        });

    hourChart
        .width(600)
        .height(200)
        .x(d3.scaleOrdinal().domain(hourDimension))
        .xUnits(dc.units.ordinal)
        .elasticX(true)
        .brushOn(false)
        .yAxisLabel("Hour")
        .margins({left:60, right:30, top:20, bottom:30})
        .dimension(hourDimension)
        .ordinalColors(['#ff4d94'])
        .group(hourGroup);
    hourChart.render();

    weekChart
        .width(600)
        .height(200)
        .x(d3.scaleOrdinal().domain(moment.weekdays()))
        .xUnits(dc.units.ordinal)
        .elasticX(true)
        .brushOn(false)
        .yAxisLabel("Number of Transactions")
        .xAxisLabel("Week Days")
        .margins({left:60, right:30, top:20, bottom:50})
        .dimension(weekDimension)
        .ordinalColors(['#33ff33'])
        .group(weekGroup)
        .ordering(function(k){
            return scaleWeek(k.key);
          });
    weekChart.render();


    monthChart
        .width(600)
        .height(200)
        .x(d3.scaleOrdinal().domain(moment.months()))//.x(d3.scaleTime().domain(moment.months())) //.x(d3.scaleTime().domain(monthDimension))
        .xUnits(dc.units.ordinal) //.xUnits(d3.timeMonths)  //.xUnits(d3.scaleTime.months)
        .elasticX(true)
        .brushOn(false)
        .yAxisLabel("Number of Transactions")
        .xAxisLabel("Month Name")
        .margins({left:60, right:30, top:20, bottom:50})
        .dimension(monthDimension)
        .ordinalColors(['#8c1aff'])
        .group(monthGroup)
        .on("postRender", function(chart) {
            chart.select('.axis.x')
                .attr("text-anchor", "end")
                .selectAll("text")
                .attr("transform", "rotate(-20)")
                .attr("dy", "-0.7em")
                .attr("dx", "-1em");
            })
        .ordering(function(k){
            return scaleMonth(k.key);
            });

            /* monthChart.xAxis()
            .tickFormat(d3.timeFormat('%c'))
            .ticks(d3.timeMonths); */ 
    monthChart.render();

    console.log(moment.months());
    var myDate =  "9/22/2017 18:27";
    var weekday = moment(myDate, "MM/DD/YYYY HH:mm").format('dddd');
    console.log(moment.weekdays());
});
