(function() {
	"use strict";

	var module = angular.module('d3Assignments');

	module.component("overviewList", {
		templateUrl: 'components/overview-list/overview-list.template.html',
		controller: function() {

			this.list = [
				{
					name: 'Bar chart',
					introduction: 'hello me and you'
				},
				{
					name: 'Area chart',
					introduction: 'hello me and you'
				},
				{
					name: 'Map',
					introduction: 'hello me and you'
				},
			]
		},
		controllerAs: 'model'
	});
})();