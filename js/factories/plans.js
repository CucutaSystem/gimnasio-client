'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.factory('Plans',function($resource,CONFIG){



  return $resource(CONFIG.URLRESOURCE+"/planes/:id",
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
