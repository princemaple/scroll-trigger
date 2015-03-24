angular.module('scroll-trigger')
.factory('thresholdFn', function($window) {
  return function(elem) {
    elem = elem || $window;
    if (elem == $window) {
      return elem.pageYOffset + elem.innerHeight;
    } else {
      return elem.scrollTop + elem.clientHeight;
    }
  };
});
