class geodanMapService {
	constructor($http) {
		this.$http = $http
 	}

	getContent(json){
		return this.$http.get(json)
					.success(function( response ){
						return response;
					});
	};


 }

geodanMapService.$inject = ['$http'];

export default geodanMapService;