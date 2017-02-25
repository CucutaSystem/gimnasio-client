'use strict';

var appGimnasio = angular.module("gimnasio");

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
appGimnasio.filter('startFrom', function() {
    return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    }
});
