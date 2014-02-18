(function($) {
	'use strict';


var xSlider,
	handle;

var years = [0, 1, 2];
var year = 0,
curr_data = year;

var init = function() {
	makeSlider();
	makeTransition();
	$('#intro').delay(2500).fadeIn(2500);
};


$('#next').on('click', function() {
	if (curr_data === 2) {
		curr_data = 0;
	} else {
		curr_data += 1;
	}
	setBrush(curr_data);
	makeTransition();
});

$('#prev').on('click', function() {
	if (curr_data === 0) {
		curr_data = 2;
	} else {
		curr_data -= 1;
	}
	setBrush(curr_data);
	makeTransition();
});

var makeTransition = function() {
	if (curr_data == 0) {
		$('#base-map').delay(500).fadeIn(1000);
		$('#circuit8').fadeOut('fast');
		$('#circuit12').fadeOut('fast');
		$('#lead').fadeIn('slow');
		$('#middle').fadeOut('fast');
		$('#last').fadeOut('fast');
		$('#year1').addClass('pointer');
		$('#year2').addClass('without-pointer').removeClass('pointer');
		$('#year3').addClass('without-pointer').removeClass('pointer')
	}
	else if (curr_data == 1) {
		$('#base-map').fadeOut('fast');
		$('#circuit8').fadeIn('slow');
		$('#circuit12').fadeOut('fast');
		$('#lead').fadeOut('fast');
		$('#middle').fadeIn('slow');
		$('#last').fadeOut('fast');
		$('#year1').addClass('without-pointer').removeClass('pointer')
		$('#year2').addClass('pointer');
		$('#year3').addClass('without-pointer').removeClass('pointer')
	}
	else {
		$('#base-map').fadeOut('fast');
		$('#circuit8').fadeOut('fast');
		$('#circuit12').fadeIn('slow');
		$('#lead').fadeOut('fast');
		$('#middle').fadeOut('fast');
		$('#last').fadeIn('slow');
		$('#year1').addClass('without-pointer').removeClass('pointer')
		$('#year2').addClass('without-pointer').removeClass('pointer')
		$('#year3').addClass('pointer');
	}
};


var makeSlider = function() {
var margin = {top: 10, right: 20, bottom: 10, left: 20},
    width = 300 - margin.left - margin.right,
    height = 60 - margin.bottom - margin.top;

xSlider = d3.scale.linear()
    .domain(d3.extent(years))
    .range([0, width])
    .clamp(true);

var brush = d3.svg.brush()
    .x(xSlider)
    .extent([0, 0])
    .on("brush", brushed);

var svg = d3.select("#slider").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height / 2 + ")")
    .call(d3.svg.axis()
      .scale(xSlider)
      .orient("bottom")
      .ticks(2)
      .tickSize(0)
      .tickPadding(12))
  .select(".domain")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halo");

var slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", height);

handle = slider.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + height / 2 + ")")
    .attr("r", 9);
    //.attr("fill", purple);

var sliderStarted = false;


function brushed() {
  var value = brush.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value = xSlider.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
  }

	var diff = 1,
		nearestYear = value;

	years.forEach(function(year, i) {
		var thisDiff = Math.abs(year - value);

		if (thisDiff < diff) {
			diff = thisDiff;
			nearestYear = year;
			console.log(nearestYear);
			}
		});

		setBrush(nearestYear);

		if (sliderStarted) {
			if (nearestYear !== curr_data) {
				curr_data = nearestYear;
				console.log(curr_data);
			//if (nearestYear.toString() !== year) {
			//	year = years.indexOf(nearestYear.toString());
			
				//drawCircles();
			}
		}
		makeTransition();
		sliderStarted = true;

}

};

var setBrush = function(x) {
	handle.attr('cx', xSlider(x));
};

init();

})(jQuery);