'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.controller('AccessVerifyCtrl', ['FingerprintF','$scope', '$interval', '$rootScope', '$http', 'ServicePathDomain', '$routeParams', 'CONFIG', 'Clients', function (FingerprintF,$scope, $interval, $rootScope, $http, ServicePathDomain, $routeParams, CONFIG, Clients) {

    $rootScope.user.name = localStorage.user_name;
    $rootScope.user.dataurl = localStorage.user_dataurl;

    FingerprintF.calcelStatusAccess();

    //
    //$('html').toggleClass('menu-active');
    //$('#sidebar').toggleClass('toggled');

  setTimeout(function(){
    var myElementHtml = angular.element(document).find('html');
    myElementHtml = myElementHtml.toggleClass('menu-active');
    var myElementSidebar = angular.element(document).find('#sidebar');
    myElementSidebar = myElementSidebar.toggleClass('toggled');
  }, 1500);

    //

    $rootScope.loginStatus = false;
    $scope.settings = {
      pageTitle: "Detalle Bono",
      action: "Show",
      dateFormat: 'yyyy/MM/dd',
      success: false,
      processing: false
    };


    FingerprintF.initAccess();

    FingerprintF.startStatusAccess();


    $scope.isEdit = function () {
      return false;
    }

    $scope.isShow = function () {
      return true;
    }


  }]);