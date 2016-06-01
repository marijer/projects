import Barchart from 'components/map-netherlands/barchart-netherlands.d3.js';
import MapNetherlands from 'components/map-netherlands/map-netherlands.d3.js';

var MapChartComponent = {
	templateUrl: 'components/map-netherlands/map-netherlands.template.html',
	controllerAs: 'model',
	controller: function() {
		this.test ='tooltip test'

		function init() {
			initPopulationData();
		}

		var populationData = 'components/map-netherlands/assets/Bevolking_grootte_2014_edited.csv',
			mapsource = "components/map-netherlands/assets/wgs84_edited.json";

		function mergeData(data, dataset2, fn) {
			var dataset = data;
			for( var i = 0, l = dataset.length; i < l; i++) {
				var gemeenteCode = dataset[i].properties.GM_CODE.split("GM")[1]; //GM_CODE: "GM0003"
				for (var j = 0, jlen = dataset2.length; j < jlen; j++ ) {
					var compareKey = dataset2[j].code; //Gemcode: "0003"
					if (+gemeenteCode === +compareKey) {
						fn(dataset[i].properties, dataset2[j])
						break;
					}
				}
			}
			return dataset;			
		}

		function initCharts(data) {
			MapNetherlands.init(data);
			MapNetherlands.dispatch.on('mouseover', componentMouseOver);
			MapNetherlands.dispatch.on('mouseout', componentMouseOut);
			
			Barchart.dispatch.on('mouseover', componentMouseOver);
			Barchart.dispatch.on('mouseout', componentMouseOut);

		    Barchart.init(data);
		}

		function componentMouseOver(d) {
			MapNetherlands.mouseOver(d);
			Barchart.mouseOver(d);
			//	Tooltip.set(d);
		}

		function componentMouseOut(d) {
			MapNetherlands.mouseOut(d);
			Barchart.mouseOut(d);
		}

		function geodataLoaded (geo_data, populationdata) {
			var mergedData = mergeData(geo_data.features, populationdata, function(d, d2) {
				d.bevolking2014 = d2.aantal;
			});
			initCharts(mergedData)
		}

		function initGeodata(populationdata) {
			d3.json(mapsource, function(data) {
				MapNetherlands.orig_geo_data = data;
				geodataLoaded(data, populationdata);
			})
		}

		function initPopulationData () {
			d3.csv(populationData, function(populationdata) {
				initGeodata(populationdata);
			})		
		}

		init();

	}
}

export default MapChartComponent;