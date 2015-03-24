angular.module('scroll-trigger', [])
.constant('scrollTriggerDefaultOptions', {
  offset: 0,
  interval: 120,
  explicitScroll: false
})
.provider('ScrollTrigger', ["scrollTriggerDefaultOptions", function(scrollTriggerDefaultOptions) {
  var options = angular.copy(scrollTriggerDefaultOptions);

  this.offset = function(customValue) {
    if (angular.isUndefined(customValue)) {
      return options.offset;
    } else if (angular.isNumber(customValue)) {
      options.offset = customValue;
    }
  };

  this.interval = function(customValue) {
    if (angular.isUndefined(customValue)) {
      return options.interval;
    } else if (angular.isNumber(customValue) && customValue > 0) {
      options.interval = customValue;
    }
  };

  this.explicitScroll = function(customValue) {
    if (angular.isUndefined(customValue)) {
      return options.explicitScroll;
    }
    options.explicitScroll = !!customValue;
  };

  this.$get = ["$window", "offsetFn", "screenEdgeFn", "throttleFn", function($window, offsetFn, screenEdgeFn, throttleFn) {
    var initialScreenEdge = screenEdgeFn(),
        scrollTriggerIdCounter = 0;

    var needAction = function(item, screenEdge, scrollEvent) {
      var top = offsetFn(item.elem).top;

      if (item.end) { top += item.elem.offsetHeight; }

      return top < screenEdge + options.offset;
    };

    var service = {
      buffer: {},

      listen: function(item) {
        if (!item.container) { return; }

        angular.element(item.elem).on('scroll', this.listener);
      },

      update: function(scrollEvent) {
        scrollEvent.stopPropagation();

        var screenEdge = screenEdgeFn() + options.offset;

        angular.forEach(service.buffer, function(item, id, buffer){
          if (needAction(item, screenEdge, scrollEvent)) {
            item.action();

            if (!item.stay) {
              delete buffer[id];
            }
          }
        });
      },

      register: function(item) {
        var id = item.id || ++scrollTriggerIdCounter;

        if (!options.explicitScroll && needAction(item, initialScreenEdge)) {
          if (item.stay) {
            item.action();
          } else {
            return item.action();
          }
        }

        this.buffer[id] = item;
        this.listen(item);
      }
    };

    service.listener = throttleFn(service.update, options.interval);

    angular.element($window).on('scroll', service.listener);

    return service;
  }];
}])
.directive('scrollTrigger', ["$parse", "ScrollTrigger", function($parse, ScrollTrigger) {
  return {
    priority: 1,
    restrict: 'A',
    scope: false,
    link: function(scope, elem, attrs) {
      ScrollTrigger.register({
        id: attrs.scrollTriggerId,
        elem: elem[0],
        end: 'scrollToEnd' in attrs,
        stay: 'scrollPersist' in attrs,
        container: 'scrollContainer' in attrs,
        action: function() {
          return $parse(attrs.scrollTrigger)(scope);
        }
      });
    }
  };
}]);

angular.module('scroll-trigger')
.factory('offsetFn', ["$window", function($window) {
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
}]);

angular.module('scroll-trigger')
.factory('screenEdgeFn', ["$window", function($window) {
  return function() {
    return $window.pageYOffset + $window.innerHeight;
  };
}]);

angular.module('scroll-trigger')
.factory('throttleFn', ["$timeout", function($timeout) {
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
}]);
