var data = [{"year":2003,"africaCT":667.71},
{"year":2004,"africaCT":737.80},
{"year":2005,"africaCT":705.08},
{"year":2006,"africaCT":756.20},
{"year":2007,"africaCT":866.34},
{"year":2008,"africaCT":1083.61},
{"year":2009,"africaCT":990.79},
{"year":2010,"africaCT":923.73},
{"year":2011,"africaCT":989.97},
{"year":2012,"africaCT":1156.56}];


//maximums for each chart set
var costTonMax = 2100;

// recycleable vars

var label = "cost per ton";

var color1 = "#78c679";
var color2 = "#238443";
var color3 = "#004529";

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 300 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

//one of these for each country and each row
charts("africaCT", '#CTafrica', costTonMax, label, color1, '$');

//run chart function with specific max for each row

// 'region' is the part of the world, 'id' is used to call the chart within the page, 'max' is the maximum value for that row of charts and 'label' is the y axis label

function charts(region, chartID, max, label, color, prefix){

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x2 = d3.scale.ordinal()
  .rangeBands([0, width], 0);

var y = d3.scale.linear()
    .range([height, 0]);
  
var xFormat = d3.time.format('%y');

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(function(d) {
      var z = d.toString();
      var a = z.split("");
      return "'"+a[2]+a[3];
    })
    .orient("bottom");
    
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

  //specifying where to put it
  var svg = d3.select(chartID).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//d3.tsv("data/data.tsv", type, function(error, data) {
    x.domain(data.map(function(d) { return +d.year})); //same for all
    x2.domain(data.map(function(d) { return 200; }));
    y.domain([0, max]); // var for max for set

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
		.attr("fill", "#7c7c7c")
        .text(label);

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr('data-value', function(d){return d[region]})
        .attr("x", function(d) { return x(d.year); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d[region]); })
		.attr("height", function(d) { return height - y(d[region]); })
		.attr("fill", color)
		.attr("index_year", function(d, i) { return "index-" + d.year; })
        .attr("class", function(d){return "bar " + "bar-index-" + d.year;})
		.attr("color_value", color)
		.on('mouseover', synchronizedMouseOver)
        .on("mouseout", synchronizedMouseOut);
        
	var yTextPadding = 5;
	
	svg.selectAll(".bartext")
	   .data(data)
	   .enter()
       .append("text")
	   .attr("text-anchor", "middle")
	   .attr("x", function(d,i) {
			return x(d.year)+x.rangeBand()/2;
		})
		.attr("y", function(d,i) {
			return height - (height - y(d[region])) - yTextPadding;
		})
		.text(function(d){
			 return d3.format(prefix)(d3.round(d[region]));
	    })
		.attr("index_year", function(d, i) { return "index-" + d.year; })
	    .attr("class", function(d){return "bartext " + "label-index-" + d.year;})
        .attr("opacity","0");
        .on("mouseover", synchronizedMouseOver)
        .on("mouseout", synchronizedMouseOut);
		
		var synchronizedMouseOver = function() {
          var bar = d3.select(this);
		  console.log(bar);
          var indexValue = bar.attr("index_year");

          var barSelector = "." + "bar " + ".bar-" + indexValue;
          var selectedBar = d3.selectAll(barSelector);
          selectedBar.style("fill", "#f7fcb9");

          var labelSelector = "." + "bartext " + ".label-" + indexValue;
          var selectedLabel = d3.selectAll(labelSelector);
          selectedLabel.style("opacity", "1");

          };

        var synchronizedMouseOut = function() {
          var bar = d3.select(this);
          var indexValue = bar.attr("index_year");

          var barSelector = "." + "bar " + ".bar-" + indexValue;
          var selectedBar = d3.selectAll(barSelector);
          var colorValue = selectedBar.attr("color_value");
          selectedBar.style("fill", colorValue);

          var labelSelector = "." + "bartext " + ".label-" + indexValue;
          var selectedLabel = d3.selectAll(labelSelector);
          selectedLabel.style("opacity", "0");
		  };
		
     // });
};

function type(d) {
  d.region = +d.region; //coerces values to number
  return d;
}
