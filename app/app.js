(function() {
	'use strict';

	var module = angular.module('d3Assignments', ['ngComponentRouter']);

	module.value("$routerRootComponent", "d3App");

	module.component('appAbout', {
		template: 'this is an about page'
	})

	module.component('refugeesBarchart', {
		template: 'this is a page for the refugees'
	})

})();