import AreaChart from './areachart.d3.js';
import Tooltip from './areachart.tooltip.js';

var AreachartComponent = {
	templateUrl: 'components/areachart/areachart.template.html',
	controllerAs: 'model',
	controller: function($scope, areaChartService) {
		var model = this,
			mainChart;

		model.$onInit = function() {
			areaChartService.getCsv('components/areachart/assets/country_code.csv', function (dataset) {
				areaChartService.country_code = dataset;
				getMainData();
			});
		}

		function getMainData() {
			areaChartService.getCsv('components/areachart/assets/data_refugee_by_origin.csv', function (dataset) {
				var years = areaChartService.createYearsArr(1990, 2004);
				var filteredData = areaChartService.filterWorldData(dataset, years);

				renderMainChart(filteredData, years);
				renderSmallMultiples(filteredData, years);
			});
		}

		function renderMainChart(data, years) {
			
			mainChart = new AreaChart({
				htmlHook: '#main-chart-hook',
				label: 'WORLD',
				dataset: data,
				width: 940,
				height: 400,
				years: years
			});

			mainChart.dispatch.on('mouseover', componentMouseOver);
			mainChart.dispatch.on('mouseout', componentMouseOut);
		}

		function renderSmallMultiples(dataset, years) {
			var uniqueContinents = areaChartService.getUniqueContinents();

			// // create small multiples
			for (var i = 0; i < uniqueContinents.length; i++) {
				// lets skip the arctic
				if (uniqueContinents[i] === 'ARCTIC') { return false; }

				var mapContinents = areaChartService.filterContinents(dataset, uniqueContinents[i]);

				var smallMultiple = new AreaChart({
					htmlHook: '#small-multiples-hook',
					label: uniqueContinents[i],
					dataset: mapContinents,
					width: 300,
					height: 200,
					years: years
				});

				smallMultiple.dispatch.on('mouseover', componentMouseOver);
				smallMultiple.dispatch.on('mouseout', componentMouseOut);
			}
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