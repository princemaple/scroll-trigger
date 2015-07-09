# scroll-trigger
### ~~Work in progress~~
### Not really WIP anymore but haven't got time to write the docs
### Read the tests as `How to use` :)

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

### Demo
Here is a plunker [demo][3]. Scroll down slowly to see the images being loaded as you scroll to them.

### Usage

`How to use` can be found in [tests][4]

**The tests are both `tests` and `examples`**

#### Examples/Tests
- [test_img_src_ondemand](https://github.com/princemaple/scroll-trigger/blob/master/test/test_img_src_ondemand.html)
shows how to reproduce the functionality of `img-src-ondemand` module
- [test_infinite_scroll](https://github.com/princemaple/scroll-trigger/blob/master/test/test_infinite_scroll.html)
shows how to implement infinite scroll with this module
- [test_scroll_to_animate](https://github.com/princemaple/scroll-trigger/blob/master/test/test_scroll_to_animate.html)
shows how to implement common animation trigger on scrolling to
- [test_scroll_to_end](https://github.com/princemaple/scroll-trigger/blob/master/test/test_scroll_to_end.html)
shows how to trigger the action at the end instead of at the beginning
- [test_scroll_container](https://github.com/princemaple/scroll-trigger/blob/master/test/test_scroll_container.html)
shows how to achieve the same effect with a container instead of `window`
- [test_lazy_img_in_container](https://github.com/princemaple/scroll-trigger/blob/master/test/test_lazy_img_in_container.html) shows how to lazy load images in a container that is not `window`
- [test_interval](https://github.com/princemaple/scroll-trigger/blob/master/test/test_interval.html) shows how to check and trigger action more / less often
- [test_offset](https://github.com/princemaple/scroll-trigger/blob/master/test/test_offset.html) shows how to trigger action in advance / with delay in terms of screen position
- [test_trigger_run](https://github.com/princemaple/scroll-trigger/blob/master/test/test_trigger_run.html) shows how to run the action once on load regardless of the screen position
- [test_trigger_active](https://github.com/princemaple/scroll-trigger/blob/master/test/test_trigger_active.html) shows how to conditionally trigger action
- [test_scope](https://github.com/princemaple/scroll-trigger/blob/master/test/test_scope.html) shows scrollTrigger can access the scope on the element, and is able to call functions / retreive data from the scope
- [test_multiple](https://github.com/princemaple/scroll-trigger/blob/master/test/test_multiple.html)
- [test_scroll](https://github.com/princemaple/scroll-trigger/blob/master/test/test_scroll.html)

[1]: https://github.com/princemaple/img-src-ondemand
[2]: https://github.com/sroze/ngInfiniteScroll
[3]: http://plnkr.co/edit/1gIyjkJbZEnvOZdD7Teu?p=preview
[4]: https://github.com/princemaple/scroll-trigger/tree/master/test

Some real usage instructions will be added later
