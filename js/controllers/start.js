'use strict';

var appGimnasio = angular.module("gimnasio");


appGimnasio.controller("StartCtrl", function($scope){

  $scope.eventSourcesCalendar = [];

  //$location.hash('skin-blur-ocean');

  //$anchorScroll();

});


appGimnasio.controller("StatusCtrl", function($scope,ServicePathDomain,$http,Statusclients,CONFIG){

  $scope.statusclients = Statusclients.get();

  $http.get(ServicePathDomain.domain()+CONFIG.URLHTTP+"/clientesp/estadosClientes")
  .success(function (response) {

    $scope.statusclients.in_force = Math.round(response.in_force);
    $scope.statusclients.expiring = Math.round(response.expiring);
    $scope.statusclients.expired = Math.round(response.expired);
    $scope.statusclients.without_first_payment = Math.round(response.without_first_payment);
  });


});
