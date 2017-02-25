'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.service('Fingerprint', function($interval,RootUrl){

  var ping;

  this.start = function(){
    this.stop();
    ping = $interval(function(){
      RootUrl.get(function (data)
      {
        console.log("Escuchando Huella Digital");
      });

    },2000);
  };


  this.stop = function() {
    $interval.cancel(ping);
  };


});
