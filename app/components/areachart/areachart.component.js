import AreaChart from './areachart.d3.js';
import Tooltip from './areachart.tooltip.js';

var AreachartComponent = {
	templateUrl: 'components/areachart/areachart.template.html',
	controllerAs: 'model',
	controller: function($scope) {
		var model = this;

		model.$onInit = function() {
			var chart = new AreaChart({
				datasource: 'components/areachart/assets/data_refugee_by_origin.csv',
				startYear: 1990,
				endYear: 2004
			});

			chart.dispatch.on('mouseover', componentMouseOver);
			chart.dispatch.on('mouseout', componentMouseOut);
		}

		function componentMouseOver(data) {
			model.tooltipContent = Tooltip.get(data);
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
}

export default AreachartComponent;