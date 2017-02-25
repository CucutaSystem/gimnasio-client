'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.factory('Discounts',function($resource,CONFIG){

  //console.log($location.absUrl());


  return $resource(CONFIG.URLRESOURCE+"/descuentos/:id",
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
