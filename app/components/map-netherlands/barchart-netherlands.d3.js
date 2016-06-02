import d3 from 'd3';
import MapNetherlandsService from 'components/map-netherlands/map-netherlands.service.js';

var mapService = new MapNetherlandsService();

var Barchart = {
	width: 400,
	height: 500,
	topCitiesShown: 20,
	transitionDuration: 1000,
	selectedValue: 'bevolking2014',

	padding: { top:10, 
				right: 20, 
				bottom: 20, 
				left: 120 },

	heightScale: undefined,
	widthScale: undefined,
	yAxis: undefined,
	xAxis: undefined,
	svg: undefined,
	dispatch: d3.dispatch("mouseover", "mouseout"),

	renderSvg: function() {
		Barchart.heightScale = d3.scale.ordinal()
					.rangeRoundBands([ Barchart.padding.top, Barchart.height - Barchart.padding.bottom ], 0.2);
	
		Barchart.widthScale =  d3.scale.linear()
					.range([ 0, Barchart.width - Barchart.padding.right - Barchart.padding.left ]);

		Barchart.yAxis = d3.svg.axis()
					.scale(Barchart.heightScale)
					.orient("left");

		Barchart.xAxis= d3.svg.axis()
				.scale(Barchart.widthScale)
				.orient("bottom")
				.tickFormat(d3.format("s"))
				.ticks(Math.round(Barchart.width / 60))
				.tickSize(-Barchart.height + (Barchart.padding.bottom + Barchart.padding.top + 5));/* weird magic number here */	

		Barchart.svg = d3.select("#chart-hook")
			.append("svg")
			.attr("width", Barchart.width)
			.attr("height", Barchart.height);
	},

	init: function(data) {
		Barchart.renderSvg();
		data = Barchart.removeEmptyValues(data);
		data = Barchart.sortData(data);
		data = Barchart.filterData(data, Barchart.topCitiesShown);

		var color = mapService.color;

		Barchart.heightScale.domain(data.map(function(d) { return d.properties.GM_NAAM; } ));

		var rects = Barchart.svg.selectAll("rect")
						.data(data)
						.enter()
						.append("rect")

		rects.attr({
				x: Barchart.padding.left,
				y: function(d) {
					return Barchart.heightScale(d.properties.GM_NAAM);
				},
				width: 0,
				height: Barchart.heightScale.rangeBand(),
				class: function(d){
					return 'bar ' + d.properties.GM_CODE;
				},
			    fill: function(d) { 
	            	if (d.properties.bevolking2014) {
	            		return color(d.properties.bevolking2014);
	            	} else {
	            		return 'yellow';
	            	}
	            }
			})
			.on('mouseover', function(d) {
				Barchart.dispatch.mouseover(d);
			})
			.on('mouseout', function(d){
				Barchart.dispatch.mouseout(d);
			})

		Barchart.updateWidthScale(data);
		Barchart.updateChart(Barchart.selectedValue);

		Barchart.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(" + Barchart.padding.left + "," + (Barchart.height - Barchart.padding.bottom) + ")")
			.call(Barchart.xAxis);

		Barchart.svg.append("g")
			.attr("class", "y axis barchart")
			.attr("transform", "translate(" + Barchart.padding.left + ",0)")
			.call(Barchart.yAxis);		
	},

	mouseOver: function(d) {
		Barchart.svg.selectAll('.' + 'bar')
			.classed('fadeout', true);

        Barchart.svg.select('.' + d.properties.GM_CODE)
        	.classed('active', true);
	},

	mouseOut: function(d) {
		Barchart.svg.selectAll('.' + 'bar')
			.classed('fadeout', false);

        Barchart.svg.select('.' + d.properties.GM_CODE)
        	.classed('active', false);
	},

	sortData: function(data) {
		data.sort(function(a, b) {
			return d3.descending(+a.properties[Barchart.selectedValue], +b.properties[Barchart.selectedValue]);
		});
		return data;
	},

	removeEmptyValues: function(data) {
		for( var i = 0, l = data.length; i < l; i++) {
			if(!data[i].properties[Barchart.selectedValue] || !data[i].properties.GM_NAAM) {
				data[i].properties[Barchart.selectedValue] = 0;
			}
		}
		return data;	
	},

	filterData: function(data, top) {
		data = data.filter(function(d, i) {
		    if( i < top) { return true; }
		});
		return data;	
	},

	updateWidthScale: function(data) {
		Barchart.widthScale.domain([ 0, d3.max(data, function(d) {
			if(d.properties[Barchart.selectedValue]){
				return +d.properties[Barchart.selectedValue];
			}else {
				return 0;
			}
		}) ]);
	},

	updateChart: function(value) {
		Barchart.svg.selectAll("rect")
			.transition()
			.duration(Barchart.transitionDuration)
			.attr("width", function(d) {
				return Barchart.widthScale(+d.properties[value]);
			});	
	}

};

export default Barchart;