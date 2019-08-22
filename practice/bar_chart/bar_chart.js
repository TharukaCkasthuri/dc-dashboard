var margin = {top: 20, right: 30, bottom: 30, left: 50},
    width = 480 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var width = 480,
    height = 250;
    barHeight = 20;

var y = d3.scale.linear().range([height,0])

var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);
//console.log(x);

//console.log(chart);


var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .on("mouseover", function(){
        d3.select(this)
          .style("fill", "orange");

        // Get current event info
        console.log(d3.event);
        
        // Get x & y co-ordinates
        console.log(d3.mouse(this));
    })
    .on("click", function(){
        d3.select(this)
        .style("fill", "orange")
    });
    
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

d3.tsv("http://localhost:8000/data.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  var bar = chart.selectAll("g")
      .data(data)
      .enter().append("rect")
      .attr("class","bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", x.rangeBand())
      .on("click", function(){
        var nextColor = this.style.fill == "red" ? "magenta" : "red";
        d3.select(this).style("fill", nextColor);
      });
  
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10, "%");

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");

  bar.append("rect")
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", x.rangeBand());

  bar.append("text")
      .attr("x", x.rangeBand() / 2)
      .attr("y", function(d) { return y(d.value) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d.value; });
  console.log(yAxis.text)
});


function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}