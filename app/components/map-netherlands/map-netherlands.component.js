import Barchart from 'components/map-netherlands/barchart-netherlands.d3.js';
import MapNetherlands from 'components/map-netherlands/map-netherlands.d3.js';

var MapChartComponent = {
	templateUrl: 'components/map-netherlands/map-netherlands.template.html',
	controllerAs: 'model',
	controller: function(mapNetherlandsService) {

		this.test ='tooltip test';

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
			MapNetherlands.mouseOver(d);
			Barchart.mouseOver(d);
			//	Tooltip.set(d);
		}

		function componentMouseOut(d) {
			MapNetherlands.mouseOut(d);
			Barchart.mouseOut(d);
			//Tooltip.hide()
		}

		init();

	}
}

export default MapChartComponent;