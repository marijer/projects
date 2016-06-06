import Barchart from './barchart.d3.js';
import tooltipContent from './barchart.tooltip.js';

var BarChart = {
	templateUrl: 'components/barchart/barChart.template.html',
	controllerAs: 'model',
	controller: function($scope) {
		var model = this;

		var years = [2010, 2011, 2012, 2013, 2014];

		var chart = new Barchart({
			years: years,
			dataUrl: 'components/barchart/assets/data_worldbank.csv',
			htmlHook: '#chart-container'
		});
		chart.dispatch.on('mouseover', componentMouseOver);
		chart.dispatch.on('mouseout', componentMouseOut);

		function componentMouseOver(data, year, currentYear) {
			var years = chart.getYears(),
				currentYear = chart.getCurrentYear();

			model.tooltipContent = tooltipContent.getContent(data, years, currentYear);
			model.tooltipVisible = true;
			model.tooltipXPos = event.pageX;
			model.tooltipYPos = event.pageY;

			$scope.$apply();
		}

		function componentMouseOut() {
			model.tooltipVisible = false;
			$scope.$apply();
		}
	}
};

export default BarChart;