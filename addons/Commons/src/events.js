(function (window) {
    var DoubleTap = function () {};
    DoubleTap._internals = {};

    DoubleTap._internals.clicks = [];
    DoubleTap._internals.callbacks = [];

    DoubleTap._internals.getUserAgent = function doubleTap_getUserAgent () {
        return navigator.userAgent;
    };

    DoubleTap._internals.getCurrentTime = function doubleTap_getCurrentTime () {
        return (new Date()).getTime();
    };

    DoubleTap._internals.getTargetCallbacks = function doubleTap_getTargetCallbacks (target) {
        var callbacks = DoubleTap._internals.callbacks;

        return callbacks.filter(function (c) {
            return c.target == target;
        }).map(function (c) {
                return c.callback;
            });
    };

    DoubleTap._internals.removeTargetCallbacks = function doubleTap_removeTargetCallbacks (target) {
        DoubleTap._internals.callbacks =
            DoubleTap._internals.callbacks.filter(function (c) {
                return c.target != target;
            });
    };

    DoubleTap._internals.addCallback = function doubleTap_addCallback (target, callback) {
        DoubleTap._internals.callbacks.push({
            'target': target,
            'callback': callback
        });
    };

    DoubleTap._internals.getLastTargetClick = function doubleTap_getLastTargetClick (target) {
        var clicks = DoubleTap._internals.clicks;
        for (var i = clicks.length - 1; i >= 0; i -= 1) {
            if (clicks[i].target == target) {
                return clicks[i];
            }
        }
        return null;
    };

    DoubleTap._internals.removeTargetClicks = function doubleTap_removeTargetClicks (target) {
        DoubleTap._internals.clicks = DoubleTap._internals.clicks.filter(function (click) {
            return click.target != target;
        });
    };

    DoubleTap._internals.addClick = function doubleTap_addClick (target, time) {
        DoubleTap._internals.removeTargetClicks(target);
        DoubleTap._internals.clicks.push({
            'target': target,
            'time': time
        });
    };

    DoubleTap._internals.doubleTapHandler = function doubleTap_doubleTapHandler (event) {
        var target = this,
            now = DoubleTap._internals.getCurrentTime(),
            lastClick = DoubleTap._internals.getLastTargetClick(event.target);

        if (lastClick !== null && lastClick.time + 300 >= now) { //double tap
            DoubleTap._internals.removeTargetClicks(event.target);

            DoubleTap._internals.getTargetCallbacks(target).forEach(function (callback) {
                callback.call(target, event);
            });
        } else { //tap
            DoubleTap._internals.addClick(event.target, now);
        }
    };

    DoubleTap._internals.getStartEvent = function doubleTap_getStartEvent (userAgent) {
        var ua = userAgent || DoubleTap._internals.getUserAgent(),
            isChrome = /chrome/i.exec(ua),
            isAndroid = /android/i.exec(ua),
            hasTouch = 'ontouchstart' in window && !(isChrome && !isAndroid);

        return hasTouch ? 'touchstart' : 'mousedown';
    };

    DoubleTap.on = function doubleTap_on ($element, callback) {
        var target = $element[0],
            startEvent = DoubleTap._internals.getStartEvent();

        DoubleTap._internals.addCallback(target, callback);

        $element.on(startEvent, DoubleTap._internals.doubleTapHandler);
    };

    DoubleTap.off = function doubleTap_off ($element) {
        var target = $element[0],
            startEvent = DoubleTap._internals.getStartEvent();

        $element.off(startEvent, DoubleTap._internals.doubleTapHandler);

        DoubleTap._internals.removeTargetCallbacks(target);
        DoubleTap._internals.removeTargetClicks(target);
    };

    window.EventsUtils = {};
    window.EventsUtils.DoubleTap = DoubleTap;
})(window);