import Barchart from './barchart.d3.js';
import tooltipContent from './barchart.tooltip.js';
import Buttons from './buttons.d3.js';

var BarChart = {
	templateUrl: 'components/barchart/barChart.template.html',
	controllerAs: 'model',
	controller: function($scope) {
		var model = this;
		var years = [2010, 2011, 2012, 2013, 2014],
			selectedYear = years[years.length -1];

		var chart, buttons;

		this.$onInit = function() {
			setBarchart();
			setButtons();
		}

		function setBarchart() {
			chart = new Barchart({
				years: years,
				selectedYear: selectedYear,
				dataUrl: 'components/barchart/assets/data_worldbank.csv',
				htmlHook: '#chart-container'
			});

			chart.dispatch.on('mouseover', componentMouseOver);
			chart.dispatch.on('mouseout', componentMouseOut);
		}

		function setButtons() {
			buttons = new Buttons();
			buttons.render(years, selectedYear);
			buttons.dispatch.on('btnClick', onBtnClick);
		}

		function componentMouseOver(data) {
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

		function onBtnClick(d) {
			chart.update(d);
		}
	}
};

export default BarChart;