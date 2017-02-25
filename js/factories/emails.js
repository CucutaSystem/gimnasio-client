'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.factory('Emails',function($resource,CONFIG){



  return $resource(CONFIG.URLRESOURCE+"/correos/:id",
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
