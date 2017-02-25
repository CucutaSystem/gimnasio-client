'use strict';

var appGimnasio = angular.module("gimnasio");



appGimnasio.controller('PaymentListCtrl', ['$scope', '$rootScope','FingerprintF', '$http', 'ServicePathDomain', 'Payments', '$route', '$routeParams', 'CONFIG', function ($scope, $rootScope,FingerprintF, $http, ServicePathDomain, Payments, $route, $routeParams, CONFIG) {


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
    $scope.pageSize = 25;
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

        Payments.get(function (data)
        {
          $scope.msg_btn_deletes = 'Mostrar Invalidados';
          deletes = false;
          $scope.data = data.invoices;
        });

      } else {

        $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/facturas_con_eliminados")
                .success(function (response) {
                  $scope.msg_btn_deletes = 'Ocultar Invalidados';
                  deletes = true;
                  $scope.data = response.invoices;

                });

      }

    }

    $scope.getData();

    $scope.remove = function (id)
    {
      Payments.delete({id: id}).$promise.then(function (data) {
        if (data.msg)
        {
          $route.reload();
        }
      });
    }

    $scope.find = function ()
    {

      var $urlfilter = "";
      $scope.msg_btn_deletes = 'Mostrar Invalidados';
      deletes = false;

      if ($.trim($scope.filtertext) != "") {
        $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/facturas_con_filtro/" + $scope.filtertext
      } else {
        $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/facturas_con_filtro";
      }

      $http.get($urlfilter)
              .success(function (response) {
                $scope.data = response.invoices;
              });

    }




  }]);











appGimnasio.controller('PaymentCreateCtrl', ['$scope', '$rootScope','FingerprintF', '$http', '$timeout', '$location', '$routeParams', 'Payments', 'Bonds', 'Discounts', 'Plans', 'Clients', 'ServicePathDomain', 'CONFIG', function ($scope, $rootScope,FingerprintF, $http, $timeout, $location, $routeParams, Payments, Bonds, Discounts, Plans, Clients, ServicePathDomain, CONFIG) {
    $rootScope.loginStatus = false;

    $rootScope.user.name = localStorage.user_name;
FingerprintF.calcelStatusAccess();
    $rootScope.user.dataurl = localStorage.user_dataurl;

    $scope.settings = {
      pageTitle: "Nuevo Pago",
      action: "New",
      success: false,
      processing: false
    };


    $scope.status = {
      arrmsg: ['Cliente Vigente', 'Cliente Por Vencer', 'Cliente Vencido', 'Sin Primer Pago'],
      msg: "",
      css: ""
    };

    $scope.validateTheForm = true;

    $scope.current_bond = "";
    $scope.current_discount = "";

    $scope.changePlanClient = false;
    var current_days = 0;
    var percentage_discount_cop = 0;
    var plan_cop = 0;
    var discount_cop = 0;



    $scope.payment = {
      clients_id: "",
      plan: null,
      percentage_discount: 0,
      discount: null,
      bond: null,
      users_id: 1,
      observations: "",
      total_value: 0,
      days_without_save: 0,
      status: 0

    };

    $scope.payment.clients_id = $routeParams.id;


    Clients.get({id: $scope.payment.clients_id}, function (data)
    {
      $scope.client = data.client;
      $scope.payment.plan = data.client.plan;
      plan_cop = data.client.plan.value;

      current_days = data.client.plan.duration;
      $scope.payment.days_without_save = parseInt(current_days);

      $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/days/" + $scope.payment.clients_id)
              .success(function (response) {

                if (response.days != 0) {
                  current_days = response.days;
                  $scope.payment.days_without_save = parseInt(current_days);
                }

              });

      updateTotalValue();
    });

    Plans.get(function (data) {
      $scope.plans = data.plans
    });


    Discounts.get(function (data)
    {
      $scope.discounts = data.discounts;
    });


    function updateTotalValue() {
      percentage_discount_cop = (plan_cop * ($scope.payment.percentage_discount / 100));
      $scope.payment.total_value = plan_cop - discount_cop - percentage_discount_cop;

      if ($scope.payment.total_value < 0) {
        $scope.payment.total_value = 0;
      }
    }

    $scope.changePercentageDiscount = function () {
      percentage_discount_cop = (plan_cop * ($scope.payment.percentage_discount / 100));
      updateTotalValue();
    }

    $scope.changePlan = function () {
      plan_cop = $scope.payment.plan.value;
      current_days = $scope.payment.plan.duration;
      $scope.changeBondDays();
      updateTotalValue();
    }

    $scope.changeDiscountCOP = function () {

      if ($scope.payment.discount != null) {
        discount_cop = $scope.payment.discount.value;
        $scope.current_discount = $scope.payment.discount.description;
      } else {
        discount_cop = 0;
        $scope.current_discount = "";
      }

      updateTotalValue();

    }

    $scope.changeBondDays = function () {

      if ($scope.payment.bond != null) {
        $scope.payment.days_without_save = parseInt($scope.payment.bond.duration_days) + parseInt(current_days);
        $scope.current_bond = $scope.payment.bond.description;
      } else {
        $scope.payment.days_without_save = parseInt(current_days);
        $scope.current_bond = "";
      }

    }



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
          Payments.save($scope.payment).$promise
                  .then(function (data)
                  {
                    if (data.msg)
                    {
                      angular.copy({}, $scope.payment);
                      $location.path("/pagos/factura/" + data.invoice_id);
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

    $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/status/" + $scope.payment.clients_id)
            .success(function (response) {
              $scope.status.css = "status-" + response.status + "-client";
              $scope.status.msg = $scope.status.arrmsg[response.status - 1];
              $scope.payment.status = response.status;
            });


    $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/bonos_aplicables")
            .success(function (response) {
              $scope.bonds = response.bonds;
            });


  }]);
