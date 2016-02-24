angular.module('scroll-trigger', [])
.constant('scrollTriggerDefaultOptions', {
  offset: 0,
  interval: 120
})
.factory('ScrollContainer', ["$window", function($window) {
  return {
    globalContainer: $window
  };
}])
.directive('scrollContainer', ["ScrollContainer", "ScrollTrigger", function(ScrollContainer, ScrollTrigger) {
  return {
    scope: false,
    link: function(scope, elem, attrs) {
      if (attrs.scrollContainer == 'global') {
        angular.element(ScrollContainer.globalContainer).off('scroll');
        ScrollContainer.globalContainer = elem[0];
        elem.on('scroll', ScrollTrigger.listener);
      }
    }
  };
}])
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

  this.$get = ["$window", "ScrollContainer", "offsetFn", "thresholdFn", "throttleFn", function($window, ScrollContainer, offsetFn, thresholdFn, throttleFn) {
    var service = {
      buffer: {},
      scrollTriggerIdCounter: 0,

      listen: function(item) {
        if (!item.isContainer) { return; }
        angular.element(item.elem).on('scroll', this.listener);
      },

      needAction: function(item, threshold) {
        var top, elem = item.elem;

        if (item.isContainer && item.toEnd) {
          return threshold + options.offset >= elem.scrollHeight;
        } else {
          top = offsetFn(item.elem).top;
          if (item.toEnd) { top += elem.offsetHeight; }
          return top <= threshold + options.offset;
        }
      },

      update: function(scrollEvent) {
        if (scrollEvent) { scrollEvent.stopPropagation(); }

        var threshold = thresholdFn(scrollEvent.currentTarget);

        angular.forEach(service.buffer, function(item, id, buffer) {
          if (item.busy()) { return; }

          if (service.needAction(item, threshold, scrollEvent)) {
            item.action();

            if (!item.persist) {
              delete buffer[id];
            }
          }
        });
      },

      register: function(item) {
        var id = item.id || ++service.scrollTriggerIdCounter,
            threshold = thresholdFn(),
            offset = offsetFn(item.elem).top;

        if (!item.busy() &&
            (item.run ||
             !item.isContainer &&
             (item.end && offset + elem.offsetHeight < threshold ||
              !item.end && offset < threshold))) {
          item.action();

          if (!item.run || !item.persist) { return; }
        }

        this.buffer[id] = item;
        this.listen(item);
      }
    };

    service.listener = throttleFn(service.update, options.interval);

    angular.element(ScrollContainer.globalContainer).on('scroll', service.listener);

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
        toEnd: 'triggerAtEnd' in attrs,
        persist: 'triggerPersist' in attrs,
        isContainer: 'scrollContainer' in attrs,
        run: 'triggerRun' in attrs,
        action: function() {
          return $parse(attrs.scrollTrigger)(
            scope,
            { $params: { $elem: elem, $attrs: attrs } }
          );
        },
        busy: attrs.triggerActive ?
          function() { return !$parse(attrs.triggerActive)(scope); } :
          function() { return false; }
      });
    }
  };
}]);

angular.module('scroll-trigger')
.factory('offsetFn', ["$window", function($window) {
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
}]);

angular.module('scroll-trigger')
.factory('thresholdFn', ["$window", function($window) {
  return function(elem) {
    elem = elem || $window;
    if (elem == $window) {
      return elem.pageYOffset + elem.innerHeight;
    } else {
      return elem.scrollTop + elem.clientHeight;
    }
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
