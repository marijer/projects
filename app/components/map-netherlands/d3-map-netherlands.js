import Barchart from './d3-barchart-netherlands.js';

var colorRange= ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'],
	populationData = 'components/map-netherlands/assets/Bevolking_grootte_2014_edited.csv',
	mapsource = "components/map-netherlands/assets/wgs84_edited.json";

var color = d3.scale.quantize()
                .range(colorRange);

function setColorDomain(data) {
    color.domain([
        d3.min(data, function(d) { return +d.properties.bevolking2014; }),
        d3.max(data, function(d) { return +d.properties.bevolking2014; })
    ]);
}

var Tooltip = {
	numFormat: d3.format("s"),

	set: function(d) {
		var num = Tooltip.numFormat(+d.properties.bevolking2014);

		if(num === '0'){
			num = 'onbekend';
		}

		Tooltip.updateContent(d.properties.GM_NAAM, num);
		Tooltip.show();
	},

	updateContent: function(title, content) {
		var html = '<div class="tooltip-label">' + title + '</div>';
		html += '<div class="tooltip-content">population 2014: <span class="tooltip-num">' + content + '</span></div>';
		
		d3.select("#tooltip").html(html);
	},

	updatePosition: function() {
		//Get this bar's x/y values, then augment for the tooltip
		var xPosition = (d3.event.pageX),
			yPosition = (d3.event.pageY - 28);

		var clientRect = d3.select("#tooltip").node().getBoundingClientRect();


		d3.select("#tooltip")
		  .style("left", (xPosition - clientRect.width / 2) + "px")
		  .style("top", yPosition - clientRect.height + "px");
	
	}, 

	show: function() {
		Tooltip.updatePosition();
		d3.select("#tooltip").classed("hidden", false);
	},

	hide: function() {
		d3.select("#tooltip").classed("hidden", true);
	}
};

function mergeData(data, dataset2, fn) {
	var dataset = data;
	for( var i = 0, l = dataset.length; i < l; i++) {
		var gemeenteCode = dataset[i].properties.GM_CODE.split("GM")[1]; //GM_CODE: "GM0003"
		for (var j = 0, jlen = dataset2.length; j < jlen; j++ ) {
			var compareKey = dataset2[j].code; //Gemcode: "0003"
			if (+gemeenteCode === +compareKey) {
				fn(dataset[i].properties, dataset2[j])
				break;
			}
		}
	}
	return dataset;			
}

function initCharts(data) {
	MapNetherlands.init(data);
    Barchart.init(data);
}

function geodataLoaded (geo_data, populationdata) {
	var mergedData = mergeData(geo_data.features, populationdata, function(d, d2) {
		d.bevolking2014 = d2.aantal;
	});
	initCharts(mergedData)
}

function initGeodata(populationdata) {
	d3.json(mapsource, function(data) {
		MapNetherlands.orig_geo_data = data;
		geodataLoaded(data, populationdata);
	})
}

function initPopulationData () {
	d3.csv(populationData, function(populationdata) {
		initGeodata(populationdata);
	})		
}

initPopulationData();
var projection = d3.geo.mercator().scale(1).translate([0,0]).precision(0);
var path = d3.geo.path().projection(projection);

var MapNetherlands = {
	svg: undefined,
	width: 530,
	height: 500,
	orig_geo_data: undefined,
	html_hook: '#country-hook',

	initSvg: function() {
		MapNetherlands.svg = d3.select(MapNetherlands.html_hook)
						.append('svg')
						.attr('width', MapNetherlands.width)
						.attr('height', MapNetherlands.height);
	},

	init: function(geo_data) {
		MapNetherlands.initSvg();

		var bounds = path.bounds(MapNetherlands.orig_geo_data);

		var scale = .95 / Math.max((bounds[1][0] - bounds[0][0]) / MapNetherlands.width,
		  (bounds[1][1] - bounds[0][1]) / MapNetherlands.height);

		var transl = [(MapNetherlands.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
		  (MapNetherlands.height - scale * (bounds[1][1] + bounds[0][1])) / 2];
		
		projection.scale(scale).translate(transl);

		setColorDomain(geo_data);

		MapNetherlands.svg.selectAll('path')
			.data(geo_data)
			.enter()
			.append('path')
			.filter(function(d) {
				return d.properties.WATER !== 'JA';
			})
			.attr({
				d: path,
	            fill: function(d) { 
	            	if(d.properties.bevolking2014){
	            		return color(d.properties.bevolking2014);
	            	} else {
	            		return '#EFEFEF';
	            	}
	            },
	            stroke: function(d) { return '#FFF' },
				class: function(d) { return 'gemeente ' + d.properties.GM_CODE; }
	          })
			.on('mouseover', function(d) {
	            Barchart.mouseOver(d);
	            MapNetherlands.mouseOver(d);
	            Tooltip.set(d);
			})
			.on('mouseout', function(d) {
				MapNetherlands.mouseOut(d);
					Barchart.mouseOut(d);
	            Tooltip.hide();
			})
	},

	mouseOver: function(d) {
		MapNetherlands.svg.select('.' + d.properties.GM_CODE)
			.classed('hover', true);

		MapNetherlands.svg.selectAll('.gemeente')
			.classed('fadeout', true);
	},

	mouseOut: function(d) {
		MapNetherlands.svg.select('.' + d.properties.GM_CODE)
			.classed('hover', false);

		MapNetherlands.svg.selectAll('.gemeente')
			.classed('fadeout', false);
	}
}

export default MapNetherlands;