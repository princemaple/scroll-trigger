angular.module('scroll-trigger', [])
.constant('scrollTriggerDefaultOptions', {
  offset: 0,
  interval: 120,
  explicitScroll: false
})
.provider('ScrollTrigger', function(scrollTriggerDefaultOptions) {
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

  this.$get = function($window, offsetFn, screenEdgeFn, throttleFn) {
    var initialScreenEdge = screenEdgeFn(),
        scrollTriggerIdCounter = 0;

    var needAction = function(item, screenEdge) {
      var top = offsetFn(item.elem).top;

      if (item.end) { top += item.elem.offsetHeight; }

      return top < screenEdge + options.offset;
    };

    var service = {
      buffer: {},
      listening: false,

      listen: function() {
        if (this.listening) { return; }

        angular.element($window).on('scroll', this.listener);
        this.listening = true;
      },

      update: function() {
        var screenEdge = screenEdgeFn() + options.offset;

        angular.forEach(service.buffer, function(item, id, buffer){
          if (needAction(item, screenEdge)) {
            item.action();

            if (!item.stay) {
              delete buffer[id];
            }
          }
        });

        if (!Object.keys(service.buffer).length) {
          angular.element($window).off('scroll');
          service.listening = false;
        }
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
        this.listen();
      }
    };

    service.listener = throttleFn(service.update, options.interval);

    return service;
  };
})
.directive('scrollTrigger', function($parse, ScrollTrigger) {
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
        action: function() {
          return $parse(attrs.scrollTrigger)(scope);
        }
      });
    }
  };
});
