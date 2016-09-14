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
        // <a href="#"></a>

        // globals.App.infowindow.setContent('<div>' +
        //   shop.adr_address + '<br>' +
        //   'hello world' +
        //
        //   shop.website + '</div>');
        globals.App.infowindow.open(globals.App.map, marker);

      });

      //console.log(place.place_id);
      // $.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.place_id}&key=AIzaSyD5H0Rx_xq2rUKeMyr5fGyDYVBcJyZIIDg`).done(data => {
      // console.log(place.reference);
      // $.ajax({
      //   method: "GET",
      //   url: `https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJbd6czrkEdkgRz3Ef2IYbACQ&key=AIzaSyD5H0Rx_xq2rUKeMyr5fGyDYVBcJyZIIDg`,
      //   beforeSend: function(req) {
      //     req.setRequestHeader('Access-Control-Allow-Origin: *');
      //   },
      //   datatype: "jsonp"
      // }).done(data => {
      //   console.log("running");
      //   console.log(data);
      // });


      // globals.App.infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
      //           'Place ID: ' + place.place_id + '<br>' +
      //           'Open now: ' + place.opening_hours.open_now +
      //           'address' + place.formatted_address +
      //           '</div>');
      // globals.App.infowindow.open(globals.App.map, marker);


    });
  };

})(window);
