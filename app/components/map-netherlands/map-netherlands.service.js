import d3 from 'd3';

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

export default class ExampleService {
	constructor($http) {
    	this.$http = $http;
    	this.dispatch = d3.dispatch("loaded");
 	}

 	getData() {
 		this.getPopulationData();
 	}

	getPopulationData() {
		var self = this;
		d3.csv(populationData, function(populationdata) {
			self.getGeodata(populationdata);
		})		
	}

 	getGeodata(populationdata) {
 		var self = this;
		d3.json(mapsource, function(data) {
			self.mergeData(data, populationdata);
		})
	}

	mergeData(geo_data, populationdata) {
		var self = this;
		var mergedData = mergeData(geo_data.features, populationdata, function(d, d2) {
			d.bevolking2014 = d2.aantal;
		});
		
		self.dispatch.loaded(geo_data, mergedData);
	}
 }

ExampleService.$inject = ['$http'];
