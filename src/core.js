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
          var top = offsetFn(item.elem).top;
          if (item.options.end) { top += item.elem.offsetHeight; }

          if (top <= screenEdge) {
            item.action();
            delete buffer[id];
          }
        });

        if (!Object.keys(service.buffer).length) {
          angular.element($window).off('scroll');
          service.listening = false;
        }
      },

      register: function(elem, action, regOptions) {
        elem = elem[0];

        var top = offsetFn(elem).top,
            id = regOptions.id || ++scrollTriggerIdCounter;

        if (regOptions.end) { top += elem.offsetHeight; }

        if (!options.explicitScroll &&
            (top <= initialScreenEdge + options.offset)) {
          return action();
        }

        this.buffer[id] = {
          elem: elem,
          action: action,
          options: regOptions
        };
        this.listen();
      }
    };

    service.listener = throttleFn(service.update, options.interval);

    return service;
  };
})
.directive('scrollTrigger', function($parse, ScrollTrigger) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, elem, attrs) {
      ScrollTrigger.register(
        elem,
        function() { return $parse(attrs.scrollTrigger)(scope); },
        {
          id: attrs.scrollTriggerId,
          end: 'scrollToEnd' in attrs
        }
      );
    }
  };
});
