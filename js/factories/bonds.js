'use strict';

var appGimnasio = angular.module("gimnasio");



appGimnasio.factory('Bonds',function($resource,CONFIG){


  return $resource(CONFIG.URLRESOURCE+"/bonos/:id",
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
