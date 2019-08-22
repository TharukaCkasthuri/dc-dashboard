// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 70, left: 90},
width = 400 - margin.left - margin.right,
height = 550 - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

var x = d3.scaleLinear()
        .range([0, width]);
        
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// get the data
d3.csv("http://localhost:8000/transaction.csv", function(error, data) {
    if (error) throw error;
   
    // define count object that holds count for each category
    var countObj = {};

    // count how much each category occurs in list and store in countObj
    data.forEach(function(d) {
        var TAXONOMY_0 = d.TAXONOMY_0;
        if(countObj[TAXONOMY_0] === undefined) {
            countObj[TAXONOMY_0] = 0;
        } else {
            countObj[TAXONOMY_0] = countObj[TAXONOMY_0] + 1;
        }
        });

    data.forEach(function(d) {
        var TAXONOMY_0 = d.TAXONOMY_0;
        d.count = countObj[TAXONOMY_0];
    });

    // Scale the range of the data in the domains
    x.domain([0, d3.max(data, function(d){ return d.count; })])
    y.domain(data.map(function(d) { return d.TAXONOMY_0; }));
    //x.domain(data.map(function(d) { return d.TAXONOMY_0; }));
    //y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        //.attr("x", function(d) { return x(d.TAXONOMY_0); })
        .attr("width", function(d) {return x(d.count); } )
        .attr("y", function(d) { return y(d.TAXONOMY_0); })
        .attr("height", y.bandwidth())
        .on("mouseover", function(d) {
            d3.select("#tooltip")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px")
              .select("#value")
			  .text(d.TAXONOMY_0 +" = "+ d.count);
            d3.select("#tooltip").classed("hidden", false);
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });


    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,10)rotate(-45)")
            .style("text-anchor", "end");

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));


});
