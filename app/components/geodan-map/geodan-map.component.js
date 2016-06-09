import LeafletMap from './map.leaflet.js';

var GeodanMap = {
	templateUrl: 'components/geodan-map/geodan-map.template.html',
	controllerAs: 'model',
	controller: function(geodanMapService, $window, $scope) {
		var model = this;
		var leafletMap;

		model.$onInit = function() {
			showContent();
		}

		function showContent() {
			geodanMapService.getContent('components/geodan-map/assets/locations.json')
				.success(function( data ) {

					model.clients = data.clients;
					model.geodan = data.geodan[0];
					model.activeContent = 0;
					showMap();
			});
		}

		function showMap() {
			leafletMap = new LeafletMap();
			leafletMap.updateMarker(model.geodan);
		}

		model.isActive = function( el ) {
	    	return el === model.activeContent ? true : false;
	    }
		
		angular.element($window).bind("scroll", function() {

			var pageYOffset = this.pageYOffset,
			  height = this.innerHeight;

			var articles = document.getElementsByTagName('article');

			// not perfect, need to be rewritten
			var setActive = function(){
			    var memo = 0;
			    var buffer = (height * 0.2);

			  for (var i = 0; i < articles.length; i++) {
			    var el = articles[i];

			    memo += el.offsetHeight;
			    var bool = pageYOffset < (memo - buffer) ? true : false;

			     if (bool) {
			      model.activeContent = i;
			      if (model.activeContent === 0){
			      	 leafletMap.updateMarker(model.geodan);
			      } else {
			      	 leafletMap.updateMarker(model.clients[model.activeContent - 1]);
			      }
			     
			      break;
			    }
			  }

			}

			setActive();

			$scope.$apply();
        });

		
	}
};

export default GeodanMap;