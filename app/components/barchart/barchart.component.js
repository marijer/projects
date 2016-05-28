import Barchart from './d3-barchart.js';

var BarChart = {
	templateUrl: 'components/barchart/barChart.template.html',
	controller: function() {
		var chart = new Barchart();
	}
};

export default BarChart;