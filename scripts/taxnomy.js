// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 600 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
var y = d3.scaleLinear()
        .range([height, 0]);
        
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")");

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
        console.log(d.count)
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.TAXONOMY_0; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.TAXONOMY_0); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return height - y(d.count); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

});
