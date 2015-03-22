angular.module('scroll-trigger')
.factory('screenEdgeFn', function($window) {
  return function() {
    return $window.pageYOffset + $window.innerHeight;
  };
});
