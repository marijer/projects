import angular from 'angular';
import ngComponentRouter from 'ngComponentRouter';
import OverviewList from '../overview-list/overview-list.component.js';
import Barchart from '../barchart/barchart.component.js';

var module = angular.module('d3Assignments', ['ngComponentRouter']);

var module = angular.module('d3Assignments');
module.value("$routerRootComponent", "d3App");

module.component('d3App', {
	templateUrl: 'components/d3-app/d3-app.template.html',
	$routeConfig: [
	 	{ path: '/refugees', component: 'barChart', name: 'Refugees-barchart'},
		{ path: '/', component: 'overviewList', name: 'Home' },
	 	{ path: '/**', redirectTo: ['Home']}
	]
});

module
	.component('overviewList', OverviewList)
	.component('barChart', Barchart);
