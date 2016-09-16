(function(globals) {
  "use strict";

  if (!("App" in globals)) { globals.App = {}; }

  globals.App.init = function(){
    this.initMap();
    this.initAuth();
  };

  $(globals.App.init.bind(globals.App));

})(window);
