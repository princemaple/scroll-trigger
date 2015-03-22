# scroll-trigger
Trigger actions on scroll to a point

This module is based on [img-src-ondemand](/princemaple/img-src-ondemand), the
other module that I wrote some time ago to delay image loading to only when they
appear on screen. Recently, I wanted to write a new infinite scroll library to
replace the use of [ngInfiniteScroll](/sroze/ngInfiniteScroll) which I don't
like so much. Reason being it requires you to pass a selector or a selector
function as setup so the service can find the infinite scroll container. This
doesn't work well if the container is somewhere in a route view. The container
should be able to reach the service, so that doesn't matter where it's put, it
can work. After some thought, I realized that the logic it requires here is
already written in my previous library. Now, I extracted the logic and
generalized it, so it can be used in a much wider range.
