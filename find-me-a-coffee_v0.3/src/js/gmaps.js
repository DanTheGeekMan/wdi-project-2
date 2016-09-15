(function(globals) {
  "use strict";

  if (!("App" in globals)) { globals.App = {}; }

  globals.App.initMap = function() {
    // Logos
    const costaLogo   = `http://forgeshopping.com/userfiles/images/stores/food-drink/cost-logo.png`;

    // Markers
    const costaMarker = 'http://www.costa.co.uk/img/store_locator/pins/costa_shadow.png';


    $('.location').on('click', this.getCurrentLocation.bind(this));
    var startingPoint = {lat: 51.5153485, lng: -0.0746975};
    // var startingPoint = {lat: 51.8910852, lng: -0.4981471};
    let canvas  = document.getElementById('map-canvas');

    this.infowindow = new google.maps.InfoWindow();
    globals.App.createMap(startingPoint, canvas);
    globals.App.getPlaces(startingPoint);
  };

  globals.App.getPlaces= function(startingPoint){
    var service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: startingPoint,
      radius: 1000,
      keyword: 'coffee'
    }, this.gotPlaces.bind(this));
  };

  globals.App.createMap = function(startingPoint, canvas) {
  this.map = new google.maps.Map(canvas, {
    center: startingPoint,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
    styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#597c84"},{"lightness":"-37"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":"0"},{"saturation":"0"},{"color":"#f5f5f2"},{"gamma":"1"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"-3"},{"gamma":"1.00"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bae5ce"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#fac9a9"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"hue":"#0a00ff"},{"saturation":"-77"},{"gamma":"0.57"},{"lightness":"0"}]},{"featureType":"transit.station.rail","elementType":"labels.text.fill","stylers":[{"color":"#43321e"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"hue":"#ff6c00"},{"lightness":"4"},{"gamma":"0.75"},{"saturation":"-68"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#a8d7d8"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-49"},{"saturation":"-53"},{"gamma":"0.79"}]}]
  });
};

  globals.App.getCurrentLocation = function() {
  $('#myModal').modal('hide');
  navigator.geolocation.getCurrentPosition(function(position) {
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      map: globals.App.map,
      animation: google.maps.Animation.DROP,
      icon: {
        url: "http://furtaev.ru/preview/user_on_map_2_small.png",
        scaledSize: new google.maps.Size(56, 56)
      }
    });

    globals.App.map.setCenter(marker.getPosition());
  });
};

  globals.App.gotPlaces = function(results, status) {
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
      position: place.geometry.location,
      icon: {
        url: '../images/8106_new_new.png',
        scaledSize: new google.maps.Size(30, 30)
      }
    });

    google.maps.event.addListener(marker, 'click', () => {
      let url = `http://localhost:3000/api/coffee/${place.place_id}`;
      globals.App.ajaxRequest(url, "GET", null, (data) => {
        let shop = data.json.result;
        let open_now = shop.opening_hours.open_now;
        let openStatus = "";
        if (open_now) {
          openStatus = 'Now open';
        } else {
          openStatus = 'Now closed';
        }

        globals.App.infowindow.setContent(`<div><h3>${shop.name}</h3><br>
          <h4>${openStatus}</h4><br>
          ${shop.reviews[0].author_name} says<br>\"${shop.reviews[0].text}\"<br><br>
          ${shop.formatted_address}<br>
          ${shop.formatted_phone_number}<br>

          <a href="${shop.website}">Website</a></div>`);
        globals.App.infowindow.open(globals.App.map, marker);
      });
    });
  };

})(window);
