var aggregateCountries = ['ARB', 'CEB', 'CSS','ECA', 'EAP', 'EAS', 'ECS', 'EMU', 'EUU', 'FCS', 'HIC', 'HPC', 'LAC', 'LCN', 'LDC', 'LIC', 'LMC', 'LMY', 'MEA', 'MIC', 'MNA', 'NAC', 'NOC', 'OEC', 'OED', 'OSS', 'PSS', 'SAS', 'SSA', 'SSF', 'SST', 'UMC', 'WLD'];
var country_code;

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function transformData(data, years) {
	var dataset = [];
	for (var i = 0; i < data.length; i++) {

		var continentArr = country_code.filter(function(d, index){
			if (!d.iso3_code || !data[i]) {
				return false;
			}
			return d.iso3_code === data[i].Code 
		});

		var continent = continentArr[0] ? continentArr[0].continent : undefined;

		dataset[i] = {
			country: data[i].Country,
			values: [],
			total: 0,
			continent: continent
		};

		for (var j = 0; j < years.length; j++) {

			//Default value, used in case no value is present
			var amount = 0;

			// If value is not empty
			if (data[i][years[j]]) {
				amount = +data[i][years[j]];
				dataset[i].total += amount;
			}

			dataset[i].values.push({
				x: years[j],
				y: amount
			});
		}
	}
	return dataset;
}

export default class AreaChartService {
	constructor() {
    	this.dispatch = d3.dispatch("csvloaded");
 	}

 	getCsv(dataPath, fn) {
 		var self = this;

 		d3.csv(dataPath, function(data) {
			fn(data);
		});
 	}

 	set country_code(dataset) {
 		country_code = dataset;
 	}

 	createYearsArr(start, end) {
		var arr = [];
		for (var i = start; i <= end; i++ ) {
			arr.push(String(i));
		}
		return arr;
	}

 	filterWorldData(data, years) {
		var filteredData = data.filter(function(d) {
			for(var i = 0; i < aggregateCountries.length; i++) {
				if (d.Code === aggregateCountries[i]) { return false; }
			}
			return true;
		});

		var dataset = transformData(filteredData, years);

		return dataset;
	}

	filterContinents(data, continent) {
		data = data.filter(function(d, i) {
		    if( d.continent === continent) { 
		    	return true; 
		    }
		});
		return data;
	}

	getUniqueContinents() {
		var continents = country_code.map(function(obj) { 
			return obj.continent; 
		});

		var uniqueContinents = continents.filter(onlyUnique);
		return uniqueContinents;
	}

 }