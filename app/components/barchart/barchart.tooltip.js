var tooltipContent = {
	getContent: function(data, years, currentYear) {
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
}

export default tooltipContent;