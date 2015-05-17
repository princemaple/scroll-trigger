# scroll-trigger
### ~~Work in progress~~
### not really WIP anymore but haven't got time to write the docs

> Trigger actions on scroll to a point

This module is based on [img-src-ondemand][1], the other module that I wrote
some time ago to delay image loading to only when they appear on screen.
Recently, I wanted to write a new infinite scroll library to replace the use of
[ngInfiniteScroll][2] which I don't like so much. Reason being it requires you
to pass a selector or a selector function as setup so the service can find the
infinite scroll container. This doesn't work well if the container is somewhere
in a route view. The container should be able to reach the service, so that
doesn't matter where it's put, it can work. After some thought, I realized that
the logic it requires here is already written in my previous library. Now, I
extracted the logic and generalized it, so it can be used in a much wider range.

[1]: https://github.com/princemaple/img-src-ondemand
[2]: https://github.com/sroze/ngInfiniteScroll

### Usage

`How to use` can be found in [tests][3]

**The tests are both `tests` and `examples`**

#### Featured examples
- `test_img_src_ondemand.html` shows how to reproduce the functionality
of `img-src-ondemand` module
- `test_infinite_scroll` shows how to implement infinite scroll with this module

[3]: https://github.com/princemaple/scroll-trigger/tree/master/test

Some real usage instructions will be added later
