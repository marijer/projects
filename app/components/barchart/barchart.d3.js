import d3 from 'd3';

var Barchart = function(config) {
	var self = this;

	var dataUrl = config.dataUrl,
		htmlHook = config.htmlHook,
		years = config.years,
		currentYear = config.selectedYear;

	var totalShown = 20,
		transitionDuration = 1200,
		dataset;

	var dispatch = d3.dispatch("mouseover", "mouseout");
	this.dispatch = dispatch;

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

	var svg = d3.select(htmlHook)
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	function loadData() {
		d3.csv(dataUrl, function(data) {
			initChart(data);
		});
	}

	function initChart(data) {
		var filtered_data = filterData(data);

		dataset = data;
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
			.on('mouseover', mouseOver)
			.on('mouseout', mouseOut);

		self.update(currentYear);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(" + padding.left + "," + (h - padding.bottom) + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + padding.left + ",0)")
			.call(yAxis);
	}

	function mouseOver(d) {
		dispatch.mouseover(d);
	}

	this.getYears = function() {
		return years;
	}

	this.getCurrentYear = function() {
		return currentYear;
	}

	function mouseOut() {
		dispatch.mouseout();
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
		self.update(currentYear);		
	}

	this.update = function(year) {
		currentYear = year;

		svg.selectAll("rect")
			.transition()
			.duration(transitionDuration)
			.attr("width", function(d) {
				return widthScale(d[currentYear]);
			});
	}

	loadData();

	d3.select(window).on('resize', resize);
};

export default Barchart;