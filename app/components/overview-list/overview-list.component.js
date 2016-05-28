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

var OverviewList = {
	templateUrl: 'components/overview-list/overview-list.template.html',
	controller: ['$http', controller],
	controllerAs: 'model'
};

export default OverviewList;