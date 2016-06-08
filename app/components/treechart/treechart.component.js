import Treechart from './treechart.d3.js';

var TreeChart = {
	templateUrl: 'components/treechart/treechart.template.html',
	controllerAs: 'model',
	controller: function($scope) {
		var model = this;

		var tree = new Treechart();	
	}
};

export default TreeChart;