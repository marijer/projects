import AreaChart from 'components/areachart/areachart.d3.js';

var AreachartComponent = {
	templateUrl: 'components/areachart/areachart.template.html',
	controller: function() {
		var chart = new AreaChart();
	}
}

export default AreachartComponent;