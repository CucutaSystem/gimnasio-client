'use strict';

var appGimnasio = angular.module("gimnasio");



appGimnasio.factory('Clients',function($resource,CONFIG){

  //console.log($location.absUrl());


  return $resource(CONFIG.URLRESOURCE+"/clientes/:id",
    {
      id:"@_id"
    },
    {
      update:
      {
        method:"PUT",
        params: {id: "@id"}
      }
    }
    );

});
