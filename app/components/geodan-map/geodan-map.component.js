import LeafletMap from './map.leaflet.js';

var GeodanMap = {
	templateUrl: 'components/geodan-map/geodan-map.template.html',
	controllerAs: 'model',
	controller: function(geodanMapService) {
		var model = this;

		model.$onInit = function() {
			showMap();
			showContent();
		}

		function showContent() {
			geodanMapService.getContent('components/geodan-map/assets/locations.json')
				.success(function( data ) {

					model.clients = data.clients;
					model.geodan = data.geodan[0];
					model.activeContent = 0;
			});
		}

		function showMap() {
			var map = new LeafletMap();
		}

		
	}
};

export default GeodanMap;