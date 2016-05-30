import d3 from 'd3';

var Barchart = function() {

	var w = getClientWidth();
	var h = 450;

	var padding = { top:10, 
					right: 10, 
					bottom: 30, 
					left: 120 };

	var heightScale = d3.scale.ordinal()
						.rangeRoundBands([ padding.top, h - padding.bottom ], 0.1);

	var widthScale = d3.scale.linear()
						.range([ 0, w - padding.right - padding.left ]);

	var yAxis = d3.svg.axis()
					.scale(heightScale)
					.orient("left");

	var xAxis = d3.svg.axis()
				.scale(widthScale)
				.orient("bottom")
				.tickFormat(d3.format("s"))
				.ticks(Math.round(w / 60))
				.tickSize(-h + (padding.bottom + padding.top + 5)); /* weird magic number here */

	//Now SVG goes into #container instead of body
	var svg = d3.select("#chart-container")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	var years = [2010, 2011, 2012, 2013, 2014],
		currentYear = years[4],
		totalShown = 20,
		transitionDuration = 1200,
		dataset;

	function initChart() {
		d3.csv("components/barchart/assets/data_worldbank.csv", function(data) {
			dataset = data;

		    var filtered_data = filterData(data);

			updateWidthScale(filtered_data);

			heightScale.domain(filtered_data.map(function(d) { return d.Country; } ));

			var rects = svg.selectAll("rect")
							.data(filtered_data)
							.enter()
							.append("rect");

			rects.attr("x", padding.left)
				.attr("y", function(d) {
					return heightScale(d.Country);
				})
				//Initially, set bar width to zero
				.attr("width", 0)
				.attr("height", heightScale.rangeBand())
				.on("mouseover", function(d) {

					//Get this bar's x/y values, then augment for the tooltip
					var xPosition = (d3.event.pageX);
					var yPosition = (d3.event.pageY - 28);

					var content = getTooltipContent(d);

					//Update the tooltip position and value
					d3.select("#tooltip")
					  .style("left", xPosition + "px")
					  .style("top", yPosition + "px")
					  .html(content);

					//Show the tooltip
					d3.select("#tooltip").classed("none", false);
				})
				.on("mouseout", function() {
					d3.select("#tooltip").classed("none", true);
				});


			updateBarChart(currentYear);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(" + padding.left + "," + (h - padding.bottom) + ")")
				.call(xAxis);

			svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + padding.left + ",0)")
				.call(yAxis);
		});
	}

	function filterData(data) {
		data.sort(function(a, b) {
			return d3.descending(+a[currentYear], +b[currentYear]);
		});

		data = data.filter(function(d, i) {
		    if( i < totalShown) { return true; }
		});

		return data;
	}

	function updateWidthScale(data) {
		widthScale.domain([ 0, d3.max(data, function(d) {
			return +d['2014'];
		}) ]);
	}

	function getClientWidth() {
		return document.getElementById("chart-container").clientWidth;
	}

	function updateWidth() {
		w = getClientWidth();
		widthScale.range([ 0, w - padding.right - padding.left ]);
		
		updateWidthScale(dataset)

		svg.attr("width", w);		
	}

	function updateXAxis() {
		xAxis.scale(widthScale)
			.ticks(Math.round(w / 60));

		svg.selectAll(".x.axis")
			.call(xAxis);
	}

	function resize() {
		updateWidth();
		updateXAxis();
		updateBarChart(currentYear);		
	}

	function initButtons() {
		var btn = d3.select('#button-wrapper')
				.append('div');
		
		btn.selectAll('div')
			.data(years)
			.enter()
			.append('button')
			.attr('type', 'button')
			.attr('class', function(d){
				var className='btn';

				if (d === currentYear) {
					className += ' active';
				}
				return className;
			})
			.text(function(d){ return d; })
			.on('click', function(d) {
				d3.select(".btn.active").classed("active", false);
				d3.select(this).classed("active", true);
				updateBarChart(d);
			})
	}

	function getTooltipContent(data) {
		var format = d3.format('s');
		var content = '';
		content += '<div class="tooltip-country-label">' + data.Country + '</div>'; 
		content += '<ul class="tooltip-years-list">';

		for (var i = years.length -1; i >= 0; i-- ){
			var className = '';
			if(years[i] === currentYear){
				className += 'active';
			}
			content += '<li class='+ className +'>';
			content += '<span class="year-label">' + years[i] + "</span>";
			content += '<span class="year-value">' + format(data[years[i]]) + "</span>";
			content += '</li>';
		}

		content += '</ul>';

		return content;
	}

	function updateBarChart(year) {
		currentYear = year;

		svg.selectAll("rect")
			.transition()
			.duration(transitionDuration)
			.attr("width", function(d) {
				return widthScale(d[currentYear]);
			});
	}

	initChart();

	initButtons();
	d3.select(window).on('resize', resize);

};

export default Barchart;