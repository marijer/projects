import d3 from 'd3';
import MapNetherlandsService from 'components/map-netherlands/map-netherlands.service.js';

var projection = d3.geo.mercator().scale(1).translate([0,0]).precision(0),
	path = d3.geo.path().projection(projection),
	mapService = new MapNetherlandsService();

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

	init: function(orig_geo_data, geo_data) {
		MapNetherlands.renderSvg();

		var bounds = path.bounds(orig_geo_data),
			color =	mapService.color;

		mapService.setColorDomain(color, geo_data);

		var scale = .95 / Math.max((bounds[1][0] - bounds[0][0]) / MapNetherlands.width,
		  (bounds[1][1] - bounds[0][1]) / MapNetherlands.height);

		var transl = [(MapNetherlands.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
		  (MapNetherlands.height - scale * (bounds[1][1] + bounds[0][1])) / 2];
		
		projection.scale(scale).translate(transl);

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