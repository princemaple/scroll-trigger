angular.module('scroll-trigger')
.factory('offsetFn', function($window) {
  return function(elem) {
    var top = 0, left = 0;
    do {
      top += elem.offsetTop  || 0;
      left += elem.offsetLeft || 0;
      elem = elem.offsetParent;
    } while(elem);

    return {
      top: top,
      left: left
    };
  };
});
