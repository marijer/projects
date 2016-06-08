import angular from 'angular';
import ngComponentRouter from 'ngComponentRouter';
import ngSanitize from 'ngSanitize';

import OverviewList from '../overview-list/overview-list.component.js';
import Barchart from '../barchart/barchart.component.js';
import Areachart from '../areachart/areachart.component.js';
import Mapchart from '../map-netherlands/map-netherlands.component.js';
import Treechart from '../treechart/treechart.component.js';

import Tooltip from 'common/tooltip/tooltip.component.js';

import MapNetherlandsService from 'components/map-netherlands/map-netherlands.service.js';
import AreaChartService from 'components/areachart/areachart.service.js';

var module = angular.module('d3Assignments', ['ngComponentRouter', 'ngSanitize']);

var module = angular.module('d3Assignments');
module.value("$routerRootComponent", "d3App");

module.component('d3App', {
	templateUrl: 'components/d3-app/d3-app.template.html',
	$routeConfig: [
		{ path: '/', component: 'overviewList', name: 'Home' },
		{ path: '/refugee-population-by-country', component: 'barChart', name: 'Refugees-barchart'},
	 	{ path: '/refugee-population-by-country-of-origin', component: 'areaChart', name: 'Refugees-areachart'},
	 	{ path: '/where-do-people-in-the-netherlands-live', component: 'mapChart', name: 'Municipalities-mapchart'},
	 	{ path: '/flow-experiment', component: 'treeChart', name: 'Flow-experiment'},
	 	{ path: '/**', redirectTo: ['Home']}
	]
});

module
	.component('overviewList', OverviewList)
	.component('barChart', Barchart)
	.component('areaChart', Areachart)
	.component('mapChart', Mapchart)
	.component('treeChart', Treechart)
	.component('tooltip', Tooltip)
	.service('mapNetherlandsService', MapNetherlandsService)
	.service('areaChartService', AreaChartService);

