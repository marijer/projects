(function() {
	'use strict';

	var module = angular.module('d3Assignments');

	module.component('d3App', {
		templateUrl: 'components/d3-app/d3-app.template.html',
		$routeConfig: [
			{ path: '/', component: 'overviewList', name: 'Home' },
			{ path: '/about', component: 'appAbout', name: 'About'},
			{ path: '/refugees', component: 'refugeesBarchart', name: 'Refugees-barchart'},
			{ path: '/**', redirectTo: ['Home']}
		]
	});
})();