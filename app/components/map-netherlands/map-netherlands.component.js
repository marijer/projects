import Barchart from './barchart-netherlands.d3.js';
import MapNetherlands from './map-netherlands.d3.js';
import mapTooltip from './map-netherlands.tooltip.js';

var MapChartComponent = {
	templateUrl: 'components/map-netherlands/map-netherlands.template.html',
	controllerAs: 'model',
	controller: function($scope, mapNetherlandsService) {
		var model = this;

		function init() {
			var populationData = mapNetherlandsService.getData();
			mapNetherlandsService.dispatch.on('loaded', initCharts);
		}

		function initCharts(geo_data, data) {
			MapNetherlands.init(geo_data, data);
			MapNetherlands.dispatch.on('mouseover', componentMouseOver);
			MapNetherlands.dispatch.on('mouseout', componentMouseOut);
			
			Barchart.init(data);
			Barchart.dispatch.on('mouseover', componentMouseOver);
			Barchart.dispatch.on('mouseout', componentMouseOut);
		}

		function componentMouseOver(d) {
			model.tooltipVisible = true;
			MapNetherlands.mouseOver(d);
			Barchart.mouseOver(d);
			model.tooltipContent = mapTooltip.get(d);

			model.tooltipXPos = event.pageX;
			model.tooltipYPos = event.pageY;

			$scope.$apply();
		}

		function componentMouseOut(d) {
			MapNetherlands.mouseOut(d);
			Barchart.mouseOut(d);
			model.tooltipVisible = false;

			$scope.$apply();
		}

		init();

	}
}

export default MapChartComponent;