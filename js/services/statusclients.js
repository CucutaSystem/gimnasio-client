'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.service('Statusclients', function(){

  var status = {

    in_force:0,
    expiring:0,
    expired:0,
    without_first_payment:0

  };

  return {
    get: function() {
      return status;
    }
  };

});
