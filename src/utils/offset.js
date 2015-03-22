angular.module('scroll-trigger')
.factory('offsetFn', function($window) {
  return function(rawElem) {
    var top = 0, left = 0;
    do {
      top += rawElem.offsetTop  || 0;
      left += rawElem.offsetLeft || 0;
      rawElem = rawElem.offsetParent;
    } while(rawElem);

    return {
      top: top,
      left: left
    };
  };
});
