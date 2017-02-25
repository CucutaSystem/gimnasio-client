'use strict';

var appGimnasio = angular.module("gimnasio");



appGimnasio.factory('Clinicals',function($resource,CONFIG){


  return $resource(CONFIG.URLRESOURCE+"/clinicals/:id",
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