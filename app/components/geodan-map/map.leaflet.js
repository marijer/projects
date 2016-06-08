import L from 'Leaflet';

function LeafletMap() {

  var zoomlevel = 12;
  var markersLayer = new L.LayerGroup();

   var map = L.map('map', {
   		center: new L.LatLng(52.341758, 4.911880),
   		zoom: 7,
   		zoomControl: false
    });


  var testIcon = L.icon({
      iconUrl: 'img/plus_sign.gif',
     // shadowUrl: 'leaf-shadow.png',

      iconSize:     [37, 33], // size of the icon
     // shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [18, 16], // point of the icon which will correspond to marker's location
    //  shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -18] // point from which the popup should open relative to the iconAnchor
  });



  var testIcon2 = L.icon({
      iconUrl: 'img/marker_test_02.png',
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
   var disableMapEvents = function(){
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      if (map.tap) map.tap.disable();
   }

    // scope.$watch('activeContent', function( newValue, oldValue ){
    //     if( !newValue && newValue === oldValue ) return;

    //     var obj = scope.clients[scope.activeContent - 1];
    //         obj = scope.activeContent - 1 < 0 ? scope.geodan : obj;
        
    //     if( markersLayer ) markersLayer.clearLayers(); //map.removeLayer( markersLayer );
    //     updateView( obj );
    //     setMarkers( obj.coord, obj.name );
      
    // });

    var updateView = function( obj ){
      var latlng = new L.LatLng( obj.coord[0].lat, obj.coord[0].long );
    
      var offset = map._getNewTopLeftPoint(latlng).subtract(map._getTopLeftPoint());
      map.panBy(offset, {duration: 2});

    }
   
    var setMarkers = function( coord, name ){
      var popupContent = name;
      for( var i = 0; i < coord.length; i++){
         // var marker = L.marker([coord[i].lat, coord[i].long], {icon: testIcon2})
         //               .bindPopup( popupContent );

          var marker = L.marker([coord[i].lat, coord[i].long])
                        .bindPopup( popupContent );


          markersLayer.addLayer(marker); 
      }

      markersLayer.addTo(map);
    };

    disableMapEvents();
}

export default LeafletMap;