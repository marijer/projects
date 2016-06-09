import L from 'Leaflet';

function LeafletMap() {

  var zoomlevel = 9,
      markersLayer = new L.LayerGroup(),
      markers = [];

   var map = L.map('mapLeaflet', {
   		center: new L.LatLng(52.341758, 4.911880),
   		zoom: zoomlevel,
   		zoomControl: false
    });

  var customIcon = L.icon({
      iconUrl: 'components/geodan-map/assets/marker_test_02.gif',
     // shadowUrl: 'leaf-shadow.png',

      iconSize:     [30, 33], // size of the icon
     // shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [15, 16], // point of the icon which will correspond to marker's location
    //  shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -18] // point from which the popup should open relative to the iconAnchor
  });

  	// add an OpenStreetMap tile layer
  L.tileLayer('http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
  		attribution: '&copy; <a href="http://osm.org/copyright">Stamen</a> contributors',
      opacity: 0.5,
      detectRetina: true,
      updateWhenIdle: true,
      reuseTiles: true
  	}).addTo(map);

   // remove all map zooms etc
   var disableMapEvents = function () {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      if (map.tap) map.tap.disable();
   }

   function removePreviousMarkers() {
      for(var i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
      }
   }

    this.updateMarker = function (obj) {
      removePreviousMarkers();
        updateView( obj );
        setMarkers( obj.coord, obj.name );
    }

    var updateView = function (obj) {
      var latlng = new L.LatLng( obj.coord[0].lat, obj.coord[0].long );
    
      var offset = map._getNewTopLeftPoint(latlng).subtract(map._getTopLeftPoint());
      map.panBy(offset, {duration: 2});

    }
   
    var setMarkers = function (coord, name) {
      var popupContent = name;
      markers = [];
      for( var i = 0; i < coord.length; i++){

          var marker = L.marker([coord[i].lat, coord[i].long], {icon: customIcon})
                        .bindPopup( popupContent );


          markersLayer.addLayer(marker); 

          markers.push(marker);
      }

      markersLayer.addTo(map);
    };

    disableMapEvents();
}

export default LeafletMap;