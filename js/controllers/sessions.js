'use strict';

var appGimnasio = angular.module("gimnasio");


appGimnasio.controller("LoginCtrl", function($scope,$route,$rootScope,$templateCache,$location,$timeout,ServicePathDomain,Sessions,$http,CONFIG){

  $scope.settings = {
    success: false,
    processing: false,
    validateTheForm: true
  };


  $scope.login = {

    email: "cucutasystem@gmail.com",
    password: "123456"

  };


$scope.submit = function(form){

  $scope.settings.processing = true;
  $scope.settings.success = false;
  $scope.settings.validateTheForm = true;
  $timeout(function(){$scope.settings.validateTheForm = form.$valid}, 1000);

  $timeout(function(){
    if(form.$valid) {
      Sessions.save($scope.login).$promise
        .then(function(data)
        {

          if(data.msg == 'Success')
          {
            // console.log(jwtHelper.decodeToken(data.token));

            localStorage.setItem("jwt",data.token.token);
            $rootScope.token = data.token;
            localStorage.setItem("user_name",data.user.name);
            $rootScope.user.name = data.user.name;
            localStorage.setItem("user_dataurl","data:image/"+data.user.mime+";base64,"+data.user.image);
            $rootScope.user.dataurl = "data:image/"+data.user.mime+";base64,"+data.user.image;
            localStorage.setItem("jwt",data.token.token);

            $rootScope.loginStatus = false;
            $location.path("/inicio");
          }

          $scope.settings.processing = false;

        }).catch(function(data)
        {

          $scope.settings.processing = false;

          switch (data.status) {
            case 500:
              $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Si el error persiste comuniquese con el administrador";
              break;
            case 401:
              $scope.settings.success = "La combinación de email y contraseña indicada no existe.";
              break;

          }

        });

    }else{
      $scope.settings.processing = false;
    }
  }, 1000);

}



$scope.remove = function(id)
{
  Sessions.delete().$promise.then(function(data){
    if(data.msg == 'Success')
    {
      $rootScope.loginStatus = true;
      localStorage.removeItem("jwt");
      $templateCache.removeAll();
      $location.path("/");
    }
  });
}



    $scope.login.email = "cucutasystem@gmail.com";
    $scope.login.password =  "123456";

  

});
