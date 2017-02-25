'use strict';

var appGimnasio = angular.module("gimnasio");


appGimnasio.controller('InvoiceShowCtrl', ['$scope', '$rootScope','FingerprintF', '$timeout', '$http', '$location', 'ServicePathDomain', '$routeParams', '$route', 'Payments', 'CONFIG', function ($scope, $rootScope,FingerprintF, $timeout, $http, $location, ServicePathDomain, $routeParams, $route, Payments, CONFIG) {
    $rootScope.loginStatus = false;
    $rootScope.user.name = localStorage.user_name;
    FingerprintF.calcelStatusAccess();
    $rootScope.user.dataurl = localStorage.user_dataurl;

    $scope.settings = {
      pageTitle: "Detalle Factura",
      action: "Show",
      success: false,
      processing: false
    };

    $scope.isPagePrint = false;
    $scope.isCanInvalidate = false;
    $scope.days = 0;

  setTimeout(function(){
    var myElementHtml = angular.element(document).find('html');
    myElementHtml = myElementHtml.toggleClass('menu-active');
    var myElementSidebar = angular.element(document).find('#sidebar');
    myElementSidebar = myElementSidebar.toggleClass('toggled');
  }, 1500);

    var id = $routeParams.id;


    $scope.linkCurrenInvoice = ServicePathDomain.domain() + CONFIG.URLFRONT + "/admin/#/pagos/factura/" + id;

    Payments.get({id: id}, function (data)
    {
      $scope.invoice = data.invoice;
      $scope.client = data.invoice.client;
      $scope.bond = data.invoice.bond;
      $scope.identification = data.identification;
      $scope.user = data.invoice.user;
      $scope.discount = data.invoice.discount;
      $scope.barcodewithformat = data.barcodewithformat;
      $scope.url_image_barcode = ServicePathDomain.domain() + CONFIG.URLFRONT + "/barcodes/bar_code_" + $scope.invoice.id + ".JPEG";


      $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/days/" + $scope.client.id)
              .success(function (response) {
                $scope.days = response.days;
              });


      $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/facturas_si_puede_invalidar/" + $scope.client.id)
              .success(function (response) {
                $scope.isCanInvalidate = response.isCanInvalidate;
              });


    });


    $scope.reload = function () {
      $route.reload();
    }

    $scope.printInvoice = function () {
      $scope.isPagePrint = true;
      $timeout(function () {
        var printContents = document.getElementById('print-invoice').innerHTML;
        document.body.innerHTML = printContents;
        $scope.isPagePrint = true;
        window.print();
      }, 1000);

    }



    $scope.removePayment = function (id)
    {
      Payments.delete({id: id}).$promise.then(function (data) {
        if (data.msg == 'Success')
        {
          $location.path("/clientes/detallar/" + data.client_id);
        }
      });
    }



  }]);
