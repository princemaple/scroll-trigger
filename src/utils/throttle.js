angular.module('scroll-trigger')
.factory('throttleFn', function($timeout) {
  return function(fn, delay) {
    var job, last = 0;

    return function() {
      var args = arguments,
          self = this,
          time = +(new Date()),
          func = function() {
            last = time;
            fn.apply(self, args);
          };

      $timeout.cancel(job);

      if (time >= last + delay) {
        func();
      } else {
        job = $timeout(func, delay, false);
      }
    };
  };
});
