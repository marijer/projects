import angular from 'angular';
import ngComponentRouter from 'ngComponentRouter';
import ngSanitize from 'ngSanitize';

import OverviewList from '../overview-list/overview-list.component.js';
import Barchart from '../barchart/barchart.component.js';
import Areachart from '../areachart/areachart.component.js';
import Mapchart from '../map-netherlands/map-netherlands.component.js';
import Tooltip from 'common/tooltip/tooltip.component.js';
import MapNetherlandsService from 'components/map-netherlands/map-netherlands.service.js';

var module = angular.module('d3Assignments', ['ngComponentRouter', 'ngSanitize']);

var module = angular.module('d3Assignments');
module.value("$routerRootComponent", "d3App");

module.component('d3App', {
	templateUrl: 'components/d3-app/d3-app.template.html',
	$routeConfig: [
		{ path: '/', component: 'overviewList', name: 'Home' },
		{ path: '/refugees', component: 'barChart', name: 'Refugees-barchart'},
	 	{ path: '/areachart', component: 'areaChart', name: 'Refugees-areachart'},
	 	{ path: '/mapNetherlands', component: 'mapChart', name: 'Municipalities-mapchart'},
	 	{ path: '/**', redirectTo: ['Home']}
	]
});

module
	.component('overviewList', OverviewList)
	.component('barChart', Barchart)
	.component('areaChart', Areachart)
	.component('mapChart', Mapchart)
	.component('tooltip', Tooltip)
	.service('mapNetherlandsService', MapNetherlandsService);

