'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.factory('FingerprintF',function($http,$rootScope,$interval,ServicePathDomain,CONFIG){

  function statusaccess() {

    $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/statusaccess/" + $rootScope.idpc)
      .success(function (response) {
        console.log(response.currentstatusclient);

        $rootScope.status.css = "status-" + response.currentstatusclient + "-client";
        $rootScope.status.msg = $rootScope.status.arrmsg[response.currentstatusclient - 1];

        if (response.currentstatusclient == 0) {
          $rootScope.status.msg = "Huella No Registrada";
          $rootScope.status.css = "";
        }

        if (response.currentstatusclient == 5) {
          $rootScope.status.msg = "Esperando Huella";
          $rootScope.status.css = "";
        }

      });
  }


  return {
      
      startStatusAccess: function(){
        $rootScope.listenBio = $interval(function () {
          statusaccess();
        }, 2000);
      },
      calcelStatusAccess: function(){

        if ($rootScope.listenBio != "") {
          $interval.cancel($rootScope.listenBio);
        }
      },
      initAccess: function(){
        $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/initaccess/" + $rootScope.idpc)
        .success(function (response) {
        });
      }
  }

});
