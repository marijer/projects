var Buttons = function() {
	var dispatch = d3.dispatch("btnClick");
	this.dispatch = dispatch;

	function btnClick(d) {
		d3.select(".btn.active").classed("active", false);
		d3.select(this).classed("active", true);

		dispatch.btnClick(d);
	}

	this.render = function(years, selectedYear) {
		var btn = d3.select('#button-wrapper')
				.append('div');
		
		btn.selectAll('div')
			.data(years)
			.enter()
			.append('button')
			.attr('type', 'button')
			.attr('class', function(d){
				var className='btn';

				if (d === selectedYear) {
					className += ' active';
				}
				return className;
			})
			.text(function(d){ return d; })
			.on('click', btnClick);
	}
}

export default Buttons;