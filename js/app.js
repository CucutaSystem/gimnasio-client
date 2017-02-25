'use strict';

var appGimnasio = angular.module("gimnasio",["angular-jwt","ngRoute","ngResource","ui.calendar","ngProgress","ui.bootstrap","ngSanitize","ngAnimate","ngQuantum","barcodeGenerator"]);

appGimnasio.constant('CONFIG', {
	URLRESOURCE: "/gimnasio-cucutasystem/gimnasio-laravel/public",
	URLHTTP: "/gimnasio-laravel/public",
	URLFRONT: "/gimnasio-angularjs",
	HOMEPATH: "#/inicio"
});


appGimnasio.run(function ($rootScope) {
    $rootScope.loginStatus = true; //global variable
    $rootScope.user = {name:"",dataurl:""};
    $rootScope.idpc = 1;
    $rootScope.listenBio = "";
    $rootScope.status = {
      arrmsg: ['Cliente Vigente', 'Cliente Por Vencer', 'Cliente Vencido', 'Sin Primer Pago', 'Usuario No Existe'],
      msg: "",
      css: ""
    };

  setTimeout(function(){
    var myElementHtml = angular.element(document).find('html');
    myElementHtml = myElementHtml.toggleClass('menu-active');
    var myElementSidebar = angular.element(document).find('#sidebar');
    myElementSidebar = myElementSidebar.toggleClass('toggled');
  }, 1700);

  });



appGimnasio.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = function(Token) {
    return localStorage.jwt;
  }

  $httpProvider.interceptors.push('jwtInterceptor');
	// $locationProvider.html5Mode(true);
})
.factory('authHttpResponseInterceptor',['$q','$location',function($q,$location){
  return {
    response: function(response){
      if (response.status === 401) {
        console.log("Response 401");

      }

      if (response.status === 400) {
        console.log("Response 400");

      }
      return response || $q.when(response);
    },
    responseError: function(rejection) {
      if (rejection.status === 401) {
        console.log("Response Error 401",rejection);
        $location.path('/');
								//var $route = $injector.get('$route');
								//$route.reload();
								location.reload();
              }
              if (rejection.status === 400) {
                console.log("Response Error 400",rejection);
                //$location.path('/').search('returnTo', $location.path());
                $location.path('/');
								//var $route = $injector.get('$route');
								//$route.reload();
								location.reload();

              }
              return $q.reject(rejection);
            }
          }
        }])
.config(['$httpProvider',function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
  }]);






appGimnasio.controller("EmptyCtrl", function($scope,ServicePathDomain,Sessions,$http,CONFIG){});
