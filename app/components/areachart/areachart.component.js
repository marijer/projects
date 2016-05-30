import AreaChart from 'components/areachart/d3-areachart.js';

var AreachartComponent = {
	templateUrl: 'components/areachart/areachart.template.html',
	controller: function() {
		var chart = new AreaChart();
	}
}

export default AreachartComponent;