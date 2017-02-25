'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.config(['$routeProvider',function ($routeProvider)
{

  $routeProvider.when('/',{
  templateUrl: '../admin/empty.html',
  controller: 'EmptyCtrl'
  })
  .when('/inicio',{
    templateUrl: '../admin/content_start.html',
    controller: 'StartCtrl'
  })
  .when('/clientes',{
  templateUrl: '../admin/clients/list.html',
  controller: 'ClientListCtrl'
  })
  .when('/clientes/detallar/:id',{
    templateUrl: '../admin/clients/show.html',
    controller: 'ClientShowCtrl'
  })
  .when('/clientes/crear',{
    templateUrl: '../admin/clients/create.html',
    controller: 'ClientCreateCtrl'
  })
  .when('/clientes/editar/:id',{
    templateUrl: '../admin/clients/edit.html',
    controller: 'ClientEditCtrl'
  })
  .when('/clientes/status/:idstatus',{
    templateUrl: '../admin/clients/list.html',
    controller: 'ClientListCtrl'
  })
  .when('/historias',{
  templateUrl: '../admin/clinicalhistories/list.html',
  controller: 'ClinicalListCtrl'
  })
  .when('/historias/detallar/:id',{
    templateUrl: '../admin/clinicalhistories/show.html',
    controller: 'ClinicalShowCtrl'
  })
  .when('/historias/editar/:id',{
    templateUrl: '../admin/clinicalhistories/edit.html',
    controller: 'ClinicalEditCtrl'
  })
  .when('/historias/crear/:idcliente',{
    templateUrl: '../admin/clinicalhistories/create.html',
    controller: 'ClinicalCreateCtrl'
  })



  .when('/planes',{
  templateUrl: '../admin/plans/list.html',
  controller: 'PlanListCtrl'
  })
  .when('/planes/detallar/:id',{
    templateUrl: '../admin/plans/show.html',
    controller: 'PlanShowCtrl'
  })
  .when('/planes/editar/:id',{
    templateUrl: '../admin/plans/edit.html',
    controller: 'PlanEditCtrl'
  })
  .when('/planes/crear',{
    templateUrl: '../admin/plans/create.html',
    controller: 'PlanCreateCtrl'
  })



  .when('/bonos',{
  templateUrl: '../admin/bonds/list.html',
  controller: 'BondListCtrl'
  })
  .when('/bonos/detallar/:id',{
    templateUrl: '../admin/bonds/show.html',
    controller: 'BondShowCtrl'
  })
  .when('/bonos/editar/:id',{
    templateUrl: '../admin/bonds/edit.html',
    controller: 'BondEditCtrl'
  })
  .when('/bonos/crear',{
    templateUrl: '../admin/bonds/create.html',
    controller: 'BondCreateCtrl'
  })



  .when('/descuentos',{
  templateUrl: '../admin/discounts/list.html',
  controller: 'DiscountListCtrl'
  })
  .when('/descuentos/detallar/:id',{
    templateUrl: '../admin/discounts/show.html',
    controller: 'DiscountShowCtrl'
  })
  .when('/descuentos/editar/:id',{
    templateUrl: '../admin/discounts/edit.html',
    controller: 'DiscountEditCtrl'
  })
  .when('/descuentos/crear',{
    templateUrl: '../admin/discounts/create.html',
    controller: 'DiscountCreateCtrl'
  })



  .when('/correos',{
  templateUrl: '../admin/emails/list.html',
  controller: 'EmailListCtrl'
  })
  .when('/correos/detallar/:id',{
    templateUrl: '../admin/emails/show.html',
    controller: 'EmailShowCtrl'
  })
  .when('/correos/crear',{
    templateUrl: '../admin/emails/create.html',
    controller: 'EmailCreateCtrl'
  })


  .when('/pagos/crear/:id',{
    templateUrl: '../admin/payments/create.html',
    controller: 'PaymentCreateCtrl'
  })
  .when('/pagos',{
    templateUrl: '../admin/payments/list.html',
    controller: 'PaymentListCtrl'
  })
  .when('/pagos/factura/:id',{
    templateUrl: '../admin/invoice/show.html',
    controller: 'InvoiceShowCtrl'
  })


  .when('/accesos',{
    templateUrl: '../admin/access/form.html',
    controller: 'AccessVerifyCtrl'
  })

  .when('/404',{
    templateUrl: '../admin/404.html'
  })
  .otherwise({redirectTo: '/404'});


}]);
