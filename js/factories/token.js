'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.factory('Token',function($resource,CONFIG){

  var jwt = "";

  return {
    get: function() {
      return jwt;
    },
    set: function(value){
     jwt = value;
    }
  };

});
