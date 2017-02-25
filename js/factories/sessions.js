'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.factory('Sessions',function($resource,CONFIG){


  return $resource(CONFIG.URLRESOURCE+"/session/:id",
    {
      id:"@_id"
    },
    {
      update:
      {
        method:"PUT",
        params: {id: "@id"}
      }
    });
});
