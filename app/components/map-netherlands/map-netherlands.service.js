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

var colorRange= ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'];

export default class MapNetherlandsService {
	constructor() {
    	this.dispatch = d3.dispatch("loaded");
 	}

 	setColorDomain(color, data) {
	    color.domain([
	        d3.min(data, function(d) { return +d.properties.bevolking2014; }),
	        d3.max(data, function(d) { return +d.properties.bevolking2014; })
	    ]);
	}

	get color() {
		return d3.scale.quantize()
              		.range(colorRange);
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