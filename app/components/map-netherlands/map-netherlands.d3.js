import Barchart from 'components/map-netherlands/barchart-netherlands.d3.js';
import d3 from 'd3';

var projection = d3.geo.mercator().scale(1).translate([0,0]).precision(0);
var path = d3.geo.path().projection(projection);

var colorRange= ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'],
	color = d3.scale.quantize()
              .range(colorRange);

function setColorDomain(data) {
    color.domain([
        d3.min(data, function(d) { return +d.properties.bevolking2014; }),
        d3.max(data, function(d) { return +d.properties.bevolking2014; })
    ]);
}

var MapNetherlands = {
 	svg: undefined,
	width: 530,
	height: 500,
	orig_geo_data: undefined,
	html_hook: '#country-hook',
	dispatch: d3.dispatch("mouseover", "mouseout"),

	renderSvg: function() {
		MapNetherlands.svg = d3.select(MapNetherlands.html_hook)
						.append('svg')
						.attr('width', MapNetherlands.width)
						.attr('height', MapNetherlands.height);
	},

	init: function(geo_data) {
		MapNetherlands.renderSvg();

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
				MapNetherlands.dispatch.mouseover(d);
			})
			.on('mouseout', function(d) {
				MapNetherlands.dispatch.mouseout(d);
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