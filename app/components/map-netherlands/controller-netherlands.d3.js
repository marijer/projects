import Barchart from 'components/map-netherlands/barchart-netherlands.d3.js';
import MapNetherlands from 'components/map-netherlands/map-netherlands.d3.js';

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
		var html = '<div class="tooltip-label">' + title + '</div>' + 
					'<div class="tooltip-content">population 2014: <span class="tooltip-num">' + content + '</span></div>';
		
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