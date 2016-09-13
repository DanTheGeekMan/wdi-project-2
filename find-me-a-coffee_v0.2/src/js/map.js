alert("hello2");
console.log("what");

const googleMap = googleMap || {};

googleMap.mapSetup = function() {
  console.log('hello33333');
  let canvas = document.getElementById('map-canvas');
  let mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  //this.getRestaurants();
};

$(googleMap.mapSetup.bind(googleMap));
