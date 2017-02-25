'use strict';

var appGimnasio = angular.module("gimnasio");

appGimnasio.factory('Identifications',function($resource,CONFIG){

  //console.log($location.absUrl());


  return $resource(CONFIG.URLRESOURCE+"/identificaciones/:id",
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
