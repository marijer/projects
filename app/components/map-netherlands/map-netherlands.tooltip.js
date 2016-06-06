var mapTooltip = {
	numFormat: d3.format("s"),

	get: function(d) {
		var num = this.numFormat(+d.properties.bevolking2014);

		if (num === '0') {
			num = 'onbekend';
		}
		var content = this.updateContent(d.properties.GM_NAAM, num);
		return content;
	},

	updateContent: function(title, content) {
		var html = '<div class="tooltip-label">' + title + '</div>';
		html += '<div class="tooltip-content">population 2014: <span class="tooltip-num">' + content + '</span></div>';
		
		return html
	},

	updatePosition: function() {
		//Get this bar's x/y values, then augment for the tooltip
		var xPosition = (d3.event.pageX),
			yPosition = (d3.event.pageY - 28);

		var clientRect = d3.select("#tooltip").node().getBoundingClientRect();

		d3.select("#tooltip")
		  .style("left", (xPosition - clientRect.width / 2) + "px")
		  .style("top", yPosition - clientRect.height + "px");
	
	}
};

export default mapTooltip;