(function(globals) {
  "use strict";

  if (!("App" in globals)) { globals.App = {}; }

  globals.App.initMap = function() {
    var pyrmont = {lat: 51.5038, lng: -0.1141};
    let canvas  = document.getElementById('map-canvas');

    this.map = new google.maps.Map(canvas, {
      center: pyrmont,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      zoomControl: true
    });

    this.infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(this.map); 
    service.nearbySearch({
      location: pyrmont,
      radius: 5000,
      keyword: 'coffee'
    }, this.callback.bind(this));
  };

  globals.App.callback = function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
    }
  };

  globals.App.createMarker = function(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: globals.App.map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', () => {
      globals.App.infowindow.setContent(place.name);
      globals.App.infowindow.open(globals.App.map, this);
    });
  };

})(window);
