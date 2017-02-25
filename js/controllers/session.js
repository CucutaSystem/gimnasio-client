'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.controller("LoginCtrl", function($scope,ServicePathDomain,Bonds,$http,CONFIG){

  $scope.validateTheForm = true;

  $scope.settings = {
    success: false,
    processing: false
  };


  $scope.login = {

    email: "cucutasystem@gmail.com",
    password: "123456"

  };


$scope.submit = function(form){

  $scope.settings.processing = true;
  $scope.settings.success = false;
  $scope.validateTheForm = true;
  $timeout(function(){$scope.validateTheForm = form.$valid}, 1000);

  $timeout(function(){
    if(form.$valid) {
        Emails.save($scope.email).$promise
        .then(function(data)
        {
          if(data.msg == 'Success')
          {
            $location.path("/correos");
          }else{
            $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Si el error persiste comuniquese con el administrador";
          }

          $scope.settings.processing = false;

        }).catch(function(data)
        {
          $scope.processing = false;
          $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Si el error persiste comuniquese con el administrador";
        });

    }else{
      $scope.settings.processing = false;
    }
  }, 1000);

}
    $scope.login.email = "cucutasystem@gmail.com";
    $scope.login.password =  "123456";

});

// $templateCache
