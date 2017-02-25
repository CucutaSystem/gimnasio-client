'use strict';

var appGimnasio = angular.module("gimnasio");





appGimnasio.controller("StartCtrl", function ($scope, $rootScope,FingerprintF, $location, jwtHelper, ServicePathDomain, Bonds, $http, CONFIG) {


  /*
   if(localStorage.jwt == null || localStorage.jwt == ''){
   $location.path("/");
   }
   
   if(jwtHelper.isTokenExpired(localStorage.jwt)){
   $location.path("/");
   }
   */

  $scope.eventSourcesCalendar = [];
  $rootScope.loginStatus = false;
  $rootScope.user.name = localStorage.user_name;
  FingerprintF.calcelStatusAccess();
  $rootScope.user.dataurl = localStorage.user_dataurl;
  $scope.totalInvoices = 0
  $scope.totalInvoicesSpecial = 0
  $scope.amountInvoices = 0;
  $scope.amountPlans = 0;
  $scope.amountClients = 0;

  setTimeout(function(){
    var myElementHtml = angular.element(document).find('html');
    myElementHtml = myElementHtml.toggleClass('menu-active');
    var myElementSidebar = angular.element(document).find('#sidebar');
    myElementSidebar = myElementSidebar.toggleClass('toggled');
  }, 1500);


  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/total_facturas")
          .success(function (response) {

            $scope.totalInvoices = response.total;
          });

  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/total_facturas_planes_especiales")
          .success(function (response) {
              console.log(" Total especiales: "+ response.total);
              if(response.total != null){
               $scope.totalInvoicesSpecial = response.total; 
              }else{
                $scope.totalInvoicesSpecial = 0; 
              }
            
          });    
    
          

  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/cantidad_facturas")
          .success(function (response) {
            $scope.amountInvoices = response.amount;
          });

  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/cantidad_planes")
          .success(function (response) {
            $scope.amountPlans = response.amount;
          });

  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/cantidad_clientes")
          .success(function (response) {
            $scope.amountClients = response.amount;
          });


  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/bonos_solo_cuatro")
          .success(function (response) {
            $scope.bonds = response.bonds;
          });

});



appGimnasio.controller("StatusCtrl", function ($scope, $rootScope,FingerprintF, ServicePathDomain, $http, Statusclients, CONFIG) {
  $rootScope.loginStatus = false;

  $rootScope.user.name = localStorage.user_name;
  FingerprintF.calcelStatusAccess();
  $rootScope.user.dataurl = localStorage.user_dataurl;

  $scope.statusclients = Statusclients.get();

  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientesp/estadosClientes")
          .success(function (response) {

            $scope.statusclients.in_force = Math.round(response.in_force);
            $scope.statusclients.expiring = Math.round(response.expiring);
            $scope.statusclients.expired = Math.round(response.expired);
            $scope.statusclients.without_first_payment = Math.round(response.without_first_payment);
          });


});
