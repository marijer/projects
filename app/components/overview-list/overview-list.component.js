(function() {
	"use strict";

	var module = angular.module('d3Assignments');

	function fetchItems($http) {
		return $http.get('components/overview-list/d3-list.json')
					.then(function(response){
						return response.data;
			})
	}

	function controller($http) {
		var model = this;

		model.refugeesPath = 'Refugees-barchart';

		model.$onInit = function() {
			fetchItems($http).then(function(items){
				model.list = items;
			})
		}
	}

	module.component('overviewList', {
		templateUrl: 'components/overview-list/overview-list.template.html',
		controller: ['$http', controller],
		controllerAs: 'model'
	});
})();