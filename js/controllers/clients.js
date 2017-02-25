'use strict';

var appGimnasio = angular.module("gimnasio");



appGimnasio.controller('ClientListCtrl', ['$scope', '$rootScope','FingerprintF', '$http', 'ServicePathDomain', 'Clients', '$route', '$routeParams', 'CONFIG', function ($scope, $rootScope,FingerprintF, $http, ServicePathDomain, Clients, $route, $routeParams, CONFIG) {

  $rootScope.user.name = localStorage.user_name;
  FingerprintF.calcelStatusAccess();
  $rootScope.user.dataurl = localStorage.user_dataurl;

  $rootScope.loginStatus = false;
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
    $scope.arrstates = [];
    $scope.currentAgeFilter = 0;
    $scope.currentGenderFilter = 0;


    // URL services Export options
    $scope.all_to_xls = ServicePathDomain.domain() + CONFIG.URLHTTP + "/todos_clientes_a_xls";
    $scope.all_to_pdf = ServicePathDomain.domain() + CONFIG.URLHTTP + "/todos_clientes_a_pdf";
    $scope.all_to_xls_1 = ServicePathDomain.domain() + CONFIG.URLHTTP + "/todos_clientes_a_xls/1";
    $scope.all_to_pdf_1 = ServicePathDomain.domain() + CONFIG.URLHTTP + "/todos_clientes_a_pdf/1";
    $scope.all_to_xls_2 = ServicePathDomain.domain() + CONFIG.URLHTTP + "/todos_clientes_a_xls/2";
    $scope.all_to_pdf_2 = ServicePathDomain.domain() + CONFIG.URLHTTP + "/todos_clientes_a_pdf/2";
    $scope.all_to_xls_3 = ServicePathDomain.domain() + CONFIG.URLHTTP + "/todos_clientes_a_xls/3";
    $scope.all_to_pdf_3 = ServicePathDomain.domain() + CONFIG.URLHTTP + "/todos_clientes_a_pdf/3";



    var filterStatus = $routeParams.idstatus | "";



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

        Clients.get(function (data)
        {
          $scope.msg_btn_deletes = 'Mostrar Eliminados';
          deletes = false;

          $scope.data = data.clients;
        });

      } else {

        $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes_con_eliminados")
        .success(function (response) {
          $scope.msg_btn_deletes = 'Ocultar Eliminados';
          deletes = true;

          $scope.data = response.clients;

        });

      }

    }


    function getDataWithStatus() {
      $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes_con_status/" + filterStatus)
      .success(function (response) {
        $scope.msg_btn_deletes = 'Mostrar Eliminados';
        deletes = false;
        $scope.data = response.clients;

      });
    }



    if (filterStatus != "") {
      getDataWithStatus();
    } else {
      $scope.getData();
    }



    $scope.filterForAge = function () {

      deletes = true;

      if ($scope.currentAgeFilter == "0") {

        $scope.getData();

      } else {
        $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes_con_edad/" + $scope.currentAgeFilter)
        .success(function (response) {
          $scope.msg_btn_deletes = 'Mostrar Eliminados';
          deletes = false;
          $scope.data = response.clients;
        });
      }

    }


    $scope.filterForGender = function () {

      deletes = true;

      if ($scope.currentGenderFilter == "0") {

        $scope.getData();

      } else {
        $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes_con_genero/" + $scope.currentGenderFilter)
        .success(function (response) {
          $scope.msg_btn_deletes = 'Mostrar Eliminados';
          deletes = false;
          $scope.data = response.clients;
        });
      }

    }


    $scope.remove = function (id)
    {
      Clients.delete({id: id}).$promise.then(function (data) {
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
        $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes_con_filtro/" + $scope.filtertext
      } else {
        $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes_con_filtro";
      }

      $http.get($urlfilter)
      .success(function (response) {

        $scope.data = response.clients;
      });

    }

    $scope.staterow = function (consecutive, idclient) {

      $scope.arrstates[consecutive] = 0;

      $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/status/" + idclient)
      .success(function (response) {
        $scope.arrstates[consecutive] = response.status;
      });
    }


  }]);



appGimnasio.controller('ClientShowCtrl', ['$scope', '$rootScope','FingerprintF', '$http', 'ServicePathDomain', '$routeParams', 'Clients', 'Identifications', 'Plans', 'CONFIG', function ($scope, $rootScope,FingerprintF, $http, ServicePathDomain, $routeParams, Clients, Identifications, Plans, CONFIG) {
  $rootScope.loginStatus = false;

  $rootScope.user.name = localStorage.user_name;
  FingerprintF.calcelStatusAccess();
  $rootScope.user.dataurl = localStorage.user_dataurl;

  $scope.settings = {
    pageTitle: "Detalle Cliente",
    action: "Show",
    dateFormat: 'yyyy/MM/dd',
    success: false,
    processing: false
  };

  $scope.status = {
    arrmsg: ['Cliente Vigente', 'Cliente Por Vencer', 'Cliente Vencido', 'Sin Primer Pago'],
    msg: "",
    css: ""
  };

  $scope.days = 0;

  $scope.age = 0;

  var id = $routeParams.id;


  Identifications.get(function (data)
  {
    $scope.identifications = data.identifications;
  });


  Plans.get(function (data)
  {
    $scope.plans = data.plans;
  });


  Clients.get({id: id}, function (data)
  {
    data.client.identification_number = parseInt(data.client.identification_number);
    data.client.fixed_telephone = parseInt(data.client.fixed_telephone);
    data.client.cell_phone = parseInt(data.client.cell_phone);

    $scope.client = data.client;

  });


  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/days/" + id)
  .success(function (response) {
    $scope.days = response.days;
  });


  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/status/" + id)
  .success(function (response) {
    $scope.status.css = "status-" + response.status + "-client";
    $scope.status.msg = $scope.status.arrmsg[response.status - 1];

    if (response.status == 3) {
      $scope.days = 0;
    }

  });


  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/age/" + id)
  .success(function (response) {
    $scope.age = response.age;
  });


  $scope.isEdit = function () {
    return false;
  }

  $scope.isShow = function () {
    return true;
  }



}]);


appGimnasio.controller('ClientCreateCtrl', ['$scope', '$rootScope','FingerprintF', '$timeout', '$location', '$http', 'Clients', 'Identifications', 'Plans', 'ServicePathDomain', 'CONFIG', '$interval', function ($scope, $rootScope,FingerprintF, $timeout, $location, $http, Clients, Identifications, Plans, ServicePathDomain, CONFIG, $interval) {
  $rootScope.loginStatus = false;

  $rootScope.user.name = localStorage.user_name;
  FingerprintF.calcelStatusAccess();
  $rootScope.user.dataurl = localStorage.user_dataurl;

  $scope.settings = {
    pageTitle: "Nuevo Cliente",
    action: "New",
    success: false,
    processing: false,
    dateFormat: 'yyyy/MM/dd',
    openedDateBirthday: false
  };

  $scope.validateTheForm = true;
  $scope.msg_age = "";
  $scope.age = "";
  $scope.existsIdentificationsNumber = 0;
  $scope.existsEmailText = 0;
  $scope.formatNumberIdentification = 0;

  $scope.resStatusFingerToSave = 0;


  $scope.client = {
    name: "",
    last_name: "",
    identifications_id: "",
    identification_number: "",
    date_birth: "",
    fixed_telephone: "",
    cell_phone: "",
    residence_address: "",
    email: "",
    risk_factors: "",
    plans_id: "",
    profession: "",
    place_works_studied: "",
    observations: "",
    gender: "F",
    marital_status: "S",
    name_guardian: "",
    relationship: "",
    phone_guardian: "",
    ensurance_entity: "",
    gs: "",
    idpc: $rootScope.idpc

  };



  Identifications.get(function (data)
  {
    $scope.identifications = data.identifications;
  });


  Plans.get(function (data)
  {
    $scope.plans = data.plans;
  });



  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  $scope.changeAge = function () {

    $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/ageWithDate/" + $scope.client.date_birth)
    .success(function (response) {
      $scope.msg_age = response.age + " años";
      $scope.age = response.age;
    });

  }


  $scope.existsIdentifications = function () {


    if ($.trim($scope.client.identification_number) != '' && !Number.isInteger($scope.client.identification_number))
    {

      $scope.existsIdentificationsNumber = 0;
      $scope.formatNumberIdentification = 1;

    } else {

      $scope.formatNumberIdentification = 0;
      $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/existsIdentifications/" + $scope.client.identifications_id + "/" + $scope.client.identification_number)
      .success(function (response) {
        $scope.existsIdentificationsNumber = response.exists;
      });

    }

  }

  $scope.existsEmail = function () {

    $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/existsEmail/" + $scope.client.email)
    .success(function (response) {
      $scope.existsEmailText = response.exists;
    });

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

        if (!Number.isInteger($scope.age)) {
          $scope.settings.processing = false;
          $scope.settings.success = "Verifique la fecha de nacimiento";
        } else if ($scope.existsIdentificationsNumber == 1) {
          $scope.settings.processing = false;
          $scope.settings.success = "Los datos de identificación ya existen";
        } else if ($scope.existsEmailText == 1) {
          $scope.settings.processing = false;
          $scope.settings.success = "El correo electrónico ya existe";
        }
        else {

          $scope.settings.processing = true;
          Clients.save($scope.client).$promise
          .then(function (data)
          {
            if (data.msg)
            {
              angular.copy({}, $scope.client);
              $location.path("/clientes/detallar/" + data.client_id);
                        // $scope.settings.success = "Cliente guardado correctamente";
                      }
                      $scope.settings.processing = false;

                    }).catch(function (data)
                    {
                      $scope.settings.processing = false;
                      $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Si el error persiste comuniquese con el administrador";
                    });
                  }


                } else {
                  $scope.settings.processing = false;
                }
              }, 1000);

  }

  $scope.openDateBirthday = function (event) {
  event.preventDefault();
  event.stopPropagation();

  $scope.settings.openedDateBirthday = true;

  };





// FINGER PRINT

$scope.initFingerPrintToSave = function () {
  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/initFingerPrintToSave/" + $rootScope.idpc)
  .success(function (response) {
  });
}

$scope.initFingerPrintToSave();

$scope.statusFingerToSave = function () {
  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/statusFingerToSave/" + $rootScope.idpc)
  .success(function (response) {
    $scope.resStatusFingerToSave = response.currentfingertosave;
  });
}

if ($rootScope.listenBio != "") {
  $interval.cancel($rootScope.listenBio);
}

    /*$rootScope.listenBio = $interval(function () {

     $scope.statusFingerToSave();

   }, 2000);*/

// END FINGER PRINT




$scope.isEdit = function () {
  return false;
}

$scope.isShow = function () {
  return false;
}


}]);



appGimnasio.controller('ClientEditCtrl', ['$scope', '$rootScope','FingerprintF', '$timeout', '$location', '$http', 'Clients', 'Identifications', 'Plans', 'ServicePathDomain', 'CONFIG', '$routeParams', '$interval', function ($scope, $rootScope,FingerprintF, $timeout, $location, $http, Clients, Identifications, Plans, ServicePathDomain, CONFIG, $routeParams, $interval) {

  $rootScope.loginStatus = false;

  $rootScope.user.name = localStorage.user_name;
  FingerprintF.calcelStatusAccess();
  $rootScope.user.dataurl = localStorage.user_dataurl;

  $scope.settings = {
    pageTitle: "Editar Cliente",
    action: "Edit",
    success: false,
    processing: false,
    dateFormat: 'yyyy/MM/dd',
    openedDateBirthday: false
  };

  var id = $routeParams.id;

  $scope.validateTheForm = true;
  $scope.msg_age = "";
  $scope.age = "";
  $scope.existsIdentificationsNumber = 0;
  $scope.existsEmailText = 0;
  $scope.formatNumberIdentification = 0;

  $scope.resStatusFingerToSave = 0;

  $scope.client = {
    name: "",
    last_name: "",
    identifications_id: "",
    identification_number: "",
    date_birth: "",
    fixed_telephone: "",
    cell_phone: "",
    residence_address: "",
    email: "",
    risk_factors: "",
    plans_id: "",
    profession: "",
    place_works_studied: "",
    observations: "",
    gender: "F",
    marital_status: "S",
    name_guardian: "",
    relationship: "",
    phone_guardian: "",
    ensurance_entity: "",
    gs: "",
    idpc: $rootScope.idpc

  };


  Identifications.get(function (data)
  {
    $scope.identifications = data.identifications;
  });


  Plans.get(function (data)
  {
    $scope.plans = data.plans;
  });


  Clients.get({id: id}, function (data)
  {

    $scope.client.name = data.client.name;
    $scope.client.last_name = data.client.last_name;
    $scope.client.identifications_id = data.client.identifications_id;
    $scope.client.identification_number = parseInt(data.client.identification_number);
    $scope.client.date_birth = data.client.date_birth;
    $scope.client.fixed_telephone = parseInt(data.client.fixed_telephone);
    $scope.client.cell_phone = parseInt(data.client.cell_phone);
    $scope.client.residence_address = data.client.residence_address;
    $scope.client.email = data.client.email;
    $scope.client.risk_factors = data.client.risk_factors;
    $scope.client.plans_id = data.client.plans_id;
    $scope.client.profession = data.client.profession;
    $scope.client.place_works_studied = data.client.place_works_studied;
    $scope.client.observations = data.client.observations;
    $scope.client.gender = data.client.gender;
    $scope.client.name_guardian = data.client.name_guardian;
    $scope.client.relationship = data.client.relationship;
    $scope.client.phone_guardian = data.client.phone_guardian;
    $scope.client.marital_status = data.client.marital_status;
    $scope.client.ensurance_entity = data.client.ensurance_entity;
    $scope.client.gs = data.client.gs;

    $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/ageWithDate/" + $scope.client.date_birth)
    .success(function (response) {
      $scope.msg_age = response.age + " años";
      $scope.age = response.age;
    });

  });


$http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/days/" + id)
.success(function (response) {
  $scope.days = response.days;
});



function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

$scope.changeAge = function () {

  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/ageWithDate/" + $scope.client.date_birth)
  .success(function (response) {
    $scope.msg_age = response.age + " años";
    $scope.age = response.age;
  });

}


$scope.existsIdentifications = function () {




}

$scope.existsEmail = function () {



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


      if (!Number.isInteger($scope.age)) {
        $scope.settings.processing = false;
        $scope.settings.success = "Verifique la fecha de nacimiento";
      } else if ($scope.existsIdentificationsNumber == 1) {
        $scope.settings.processing = false;
        $scope.settings.success = "Los datos de identificación ya existen";
      } else if ($scope.existsEmailText == 1) {
        $scope.settings.processing = false;
        $scope.settings.success = "El correo electrónico ya existe";
      }
      else {

        $scope.settings.processing = true;
        Clients.update({id: id}, $scope.client).$promise
        .then(function (data)
        {
          if (data.msg)
          {
            $scope.settings.success = "Cliente Editado correctamente";
            $location.path("/clientes/detallar/" + data.client_id);
          }
          $scope.settings.processing = false;

        }).catch(function (data)
        {
          $scope.settings.processing = false;
          $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Es probable que el correo o la identificación indicada ya exista en otro cliente. Si el error persiste comuniquese con el administrador";
        });
      }


    } else {
      $scope.settings.processing = false;
    }
  }, 500);

}

$scope.openDateBirthday = function (event) {
  event.preventDefault();
  event.stopPropagation();
  $scope.settings.openedDateBirthday = true;
};


// FINGER PRINT

$scope.initFingerPrintToSave = function () {
  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/initFingerPrintToSave/" + $rootScope.idpc)
  .success(function (response) {
  });
}

$scope.initFingerPrintToSave();

$scope.statusFingerToSave = function () {
  $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/statusFingerToSave/" + $rootScope.idpc)
  .success(function (response) {
    $scope.resStatusFingerToSave = response.currentfingertosave;
  });
}


if ($rootScope.listenBio != "") {
  $interval.cancel($rootScope.listenBio);
}

    /*$rootScope.listenBio = $interval(function () {

    $scope.statusFingerToSave();

  }, 2000);*/

// END FINGER PRINT


$scope.isEdit = function () {
  return true;
}
$scope.isShow = function () {
  return false;
}


}]);
