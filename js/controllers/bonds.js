'use strict';

var appGimnasio = angular.module("gimnasio");



appGimnasio.controller('BondListCtrl', ['$scope', '$rootScope','FingerprintF', '$http', 'ServicePathDomain', 'Bonds', '$route', '$routeParams', 'CONFIG', function ($scope, $rootScope,FingerprintF, $http, ServicePathDomain, Bonds, $route, $routeParams, CONFIG) {
    

    $rootScope.loginStatus = false;

    $rootScope.user.name = localStorage.user_name;
    FingerprintF.calcelStatusAccess();
    $rootScope.user.dataurl = localStorage.user_dataurl;

    $scope.msg_btn_deletes = 'Mostrar Eliminados';
    var deletes = true;

  setTimeout(function(){
    var myElementHtml = angular.element(document).find('html');
    myElementHtml = myElementHtml.toggleClass('menu-active');
    var myElementSidebar = angular.element(document).find('#sidebar');
    myElementSidebar = myElementSidebar.toggleClass('toggled');
  }, 1500);

    // For pagination
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.data = []; // initialize
    $scope.filtertext = "";


    $scope.sumCurrentPage = function () {
      $scope.currentPage = $scope.currentPage + 1;
    }

    $scope.lessCurrentPage = function () {
      $scope.currentPage = $scope.currentPage - 1;
    }


    $scope.numberOfPages = function () {

      if ($scope.data != undefined) {
        return Math.ceil($scope.data.length / $scope.pageSize);
      } else {
        return 0;
      }
    }
    // ##############



    $scope.getData = function ()
    {

      $scope.filtertext = "";

      if (deletes) {

        Bonds.get(function (data)
        {
          $scope.msg_btn_deletes = 'Mostrar Eliminados';
          deletes = false;
          $scope.data = data.bonds;
        });

      } else {

        $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/bonos_con_eliminados")
                .success(function (response) {
                  $scope.msg_btn_deletes = 'Ocultar Eliminados';
                  deletes = true;
                  $scope.data = response.bonds;

                });

      }

    }

    $scope.date = "";

    $scope.currentDate = function () {

      $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/currentDate")
              .success(function (response) {
                $scope.date = response.date;
                $scope.getData();
              });

    }

    $scope.currentDate();


    $scope.remove = function (id)
    {
      Bonds.delete({id: id}).$promise.then(function (data) {
        if (data.msg)
        {
          $route.reload();
        }
      });
    }

    $scope.find = function ()
    {

      var $urlfilter = "";
      $scope.msg_btn_deletes = 'Mostrar Eliminados';
      deletes = false;

      if ($.trim($scope.filtertext) != "") {
        $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/bonos_con_filtro/" + $scope.filtertext
      } else {
        $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/bonos_con_filtro";
      }

      $http.get($urlfilter)
              .success(function (response) {
                $scope.data = response.bonds;
              });

    }

  }]);






appGimnasio.controller('BondShowCtrl', ['$scope', '$rootScope','FingerprintF', '$http', 'ServicePathDomain', '$routeParams', 'Bonds', 'CONFIG', function ($scope, $rootScope,FingerprintF, $http, ServicePathDomain, $routeParams, Bonds, CONFIG) {
    $rootScope.loginStatus = false;

    $rootScope.user.name = localStorage.user_name;
    FingerprintF.calcelStatusAccess();
    $rootScope.user.dataurl = localStorage.user_dataurl;

    $scope.settings = {
      pageTitle: "Detalle Bono",
      action: "Show",
      dateFormat: 'yyyy/MM/dd',
      success: false,
      processing: false
    };

    var id = $routeParams.id;


    Bonds.get({id: id}, function (data)
    {

      data.bond.duration_days = parseInt(data.bond.duration_days);
      $scope.bond = data.bond;

    });


    $scope.isEdit = function () {
      return false;
    }

    $scope.isShow = function () {
      return true;
    }


  }]);


appGimnasio.controller('BondCreateCtrl', ['$scope', '$rootScope','FingerprintF', '$timeout', '$location', '$http', 'Bonds', 'ServicePathDomain', 'CONFIG', function ($scope, $rootScope,FingerprintF, $timeout, $location, $http, Bonds, ServicePathDomain, CONFIG) {
    $rootScope.loginStatus = false;

    $rootScope.user.name = localStorage.user_name;
    FingerprintF.calcelStatusAccess();
    $rootScope.user.dataurl = localStorage.user_dataurl;


    $scope.settings = {
      pageTitle: "Nuevo Bono",
      action: "New",
      dateFormat: 'yyyy/MM/dd',
      openedDateBirthday: false,
      success: false,
      processing: false
    };

    $scope.validateTheForm = true;
    $scope.formatNumberValue = 0;


    $scope.bond = {
      name: "",
      duration_days: 1,
      description: "",
      effective_date: ""

    };


    $scope.submit = function (form) {

      $scope.settings.processing = true;
      $scope.settings.success = false;
      $scope.validateTheForm = true;
      $timeout(function () {
        $scope.validateTheForm = form.$valid
      }, 1000);

      $timeout(function () {
        if (form.$valid) {

          $scope.settings.processing = true;
          Bonds.save($scope.bond).$promise
                  .then(function (data)
                  {
                    if (data.msg)
                    {
                      $location.path("/bonos");
                    }
                    $scope.settings.processing = false;

                  }).catch(function (data)
          {
            $scope.settings.processing = false;
            $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Si el error persiste comuniquese con el administrador";
          });

        } else {
          $scope.settings.processing = false;
        }
      }, 1000);

    }


    $scope.isEdit = function () {
      return false;
    }

    $scope.isShow = function () {
      return false;
    }

    $scope.openDateEndBond = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.settings.openedDateBirthday = true;
    };


  }]);



appGimnasio.controller('BondEditCtrl', ['$scope', '$rootScope','FingerprintF', '$timeout', '$location', '$http', 'Bonds', 'ServicePathDomain', 'CONFIG', '$routeParams', function ($scope, $rootScope,FingerprintF, $timeout, $location, $http, Bonds, ServicePathDomain, CONFIG, $routeParams) {

    $rootScope.loginStatus = false;

    $rootScope.user.name = localStorage.user_name;
    FingerprintF.calcelStatusAccess();
    $rootScope.user.dataurl = localStorage.user_dataurl;

    $scope.settings = {
      pageTitle: "Editar bono",
      action: "Edit",
      dateFormat: 'yyyy/MM/dd',
      openedDateBirthday: false,
      success: false,
      processing: false
    };

    var id = $routeParams.id;

    $scope.validateTheForm = true;
    $scope.formatNumberValue = 0;



    Bonds.get({id: id}, function (data)
    {

      data.bond.duration_days = parseInt(data.bond.duration_days);
      $scope.bond = data.bond;


    });




    $scope.submit = function (form) {

      $scope.settings.processing = true;
      $scope.settings.success = false;
      $scope.validateTheForm = true;
      $timeout(function () {
        $scope.validateTheForm = form.$valid
      }, 1000);

      $timeout(function () {
        if (form.$valid) {

          $scope.settings.processing = true;
          Bonds.update({id: id}, $scope.bond).$promise
                  .then(function (data)
                  {
                    if (data.msg)
                    {
                      $scope.settings.success = "Bono Editado correctamente";
                    }
                    $scope.settings.processing = false;

                  }).catch(function (data)
          {
            $scope.settings.processing = false;
            $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Si el error persiste comuniquese con el administrador";
          });

        } else {
          $scope.settings.processing = false;
        }
      }, 500);

    }



    $scope.isEdit = function () {
      return true;
    }

    $scope.isShow = function () {
      return false;
    }

    $scope.openDateEndBond = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.settings.openedDateBirthday = true;
    };


  }]);
