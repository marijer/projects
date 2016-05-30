import Barchart from './barchart.d3.js';

var BarChart = {
	templateUrl: 'components/barchart/barChart.template.html',
	controller: function() {
		var chart = new Barchart();
	}
};

export default BarChart;