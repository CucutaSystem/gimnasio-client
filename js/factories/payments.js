'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.factory('Payments',function($resource,CONFIG){

  //console.log($location.absUrl());


  return $resource(CONFIG.URLRESOURCE+"/facturas/:id",
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
