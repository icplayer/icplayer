TestCase("[Events Utils - Double Tap] getUserAgent test", {
    'setUp': function () {},

    tearDown: function () {},

    'test should return nonempty string': function () {
        var userAgent = window.EventsUtils.DoubleTap._internals.getUserAgent();

        assertNotNull(userAgent);
        assertNotEquals('', userAgent);
        assertTrue(userAgent.length > 0);
    }
});

TestCase("[Events Utils - Double Tap] getCurrentTime test", {
    'setUp': function () {},

    tearDown: function () {},

    'test should return notnegative integer': function () {
        var currentTime = window.EventsUtils.DoubleTap._internals.getCurrentTime();

        assertNotNull(currentTime);
        assertFalse(isNaN(currentTime));
        assertTrue(currentTime > 0);
    }
});

TestCase("[Events Utils - Double Tap] getStartEvent desktop tests", {
    'setUp': function () {
        this.stubs = {
            getUserAgent: sinon.stub(window.EventsUtils.DoubleTap._internals, 'getUserAgent')
        }
    },

    tearDown: function () {
        window.EventsUtils.DoubleTap._internals.getUserAgent.restore();
    },

    'test should return mosuedown event for desktop browser - Chrome': function () {
        this.stubs.getUserAgent.returns("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36"); // Chrome 48

        var startEvent = window.EventsUtils.DoubleTap._internals.getStartEvent();

        assertTrue(this.stubs.getUserAgent.calledOnce);
        assertEquals('mousedown', startEvent);
    },

    'test should return mosuedown event for desktop browser - Firefox': function () {
        this.stubs.getUserAgent.returns("Mozilla/5.0 (Windows NT 6.3; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0"); // Firefox 48

        var startEvent = window.EventsUtils.DoubleTap._internals.getStartEvent();

        assertTrue(this.stubs.getUserAgent.calledOnce);
        assertEquals('mousedown', startEvent);
    },

    'test should return mosuedown event for desktop browser - IE': function () {
        this.stubs.getUserAgent.returns("Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; rv:11.0) like Gecko"); // IE 11

        var startEvent = window.EventsUtils.DoubleTap._internals.getStartEvent();

        assertTrue(this.stubs.getUserAgent.calledOnce);
        assertEquals('mousedown', startEvent);
    },

    'test should return mosuedown event for desktop browser - Safari': function () {
        this.stubs.getUserAgent.returns("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A"); // Safari 7.0.3

        var startEvent = window.EventsUtils.DoubleTap._internals.getStartEvent();

        assertTrue(this.stubs.getUserAgent.calledOnce);
        assertEquals('mousedown', startEvent);
    }
});

TestCase("[Events Utils - Double Tap] getStartEvent mobile tests", {
    'setUp': function () {
        this.stubs = {
            getUserAgent: sinon.stub(window.EventsUtils.DoubleTap._internals, 'getUserAgent')
        };

        this.hasOnTouchStart = 'ontouchstart' in window;

        if (!this.hasOnTouchStart) {
            window.ontouchstart = function () {};
        }
    },

    tearDown: function () {
        window.EventsUtils.DoubleTap._internals.getUserAgent.restore();

        if (!this.hasOnTouchStart) {
            delete window.ontouchstart;
        }
    },

    'test should return touchstart event for mobile browser - Chrome on Android': function () {
        var startEvent;

        this.stubs.getUserAgent.returns("Mozilla/5.0 (Linux; Android 5.0; LG-D855 Build/LRX21R.A1445306351) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.95 Mobile Safari/537.36"); // Chrome on Android 5.0

        startEvent = window.EventsUtils.DoubleTap._internals.getStartEvent();

        assertTrue(this.stubs.getUserAgent.calledOnce);
        assertEquals('touchstart', startEvent);
    },

    'test should return touchstart event for mobile browser - Native Browser on Android': function () {
        this.stubs.getUserAgent.returns("Mozilla/5.0 (Linux; U; Android 5.0; pl-pl; LG-D855 Build/LRX21R.A1445306351) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/34.0.1847.118 Mobile Safari/537.36"); // Chrome on Android 5.0

        var startEvent = window.EventsUtils.DoubleTap._internals.getStartEvent();

        assertTrue(this.stubs.getUserAgent.calledOnce);
        assertEquals('touchstart', startEvent);
    },

    'test should return touchstart event for mobile browser - Safari on iOS': function () {
        this.stubs.getUserAgent.returns("Mozilla/5.0 (iPad; CPU OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13D15 Safari/601.1"); // Safari on iPad with iOS 9.2.1

        var startEvent = window.EventsUtils.DoubleTap._internals.getStartEvent();

        assertTrue(this.stubs.getUserAgent.calledOnce);
        assertEquals('touchstart', startEvent);
    }
});

TestCase("[Events Utils - Double Tap] addClick test", {
    'setUp': function () {
        /*:DOC view = <div></div>*/

        this.spys = {
            removeTargetClicks: sinon.spy(window.EventsUtils.DoubleTap._internals, 'removeTargetClicks')
        };
    },

    tearDown: function () {
        window.EventsUtils.DoubleTap._internals.removeTargetClicks.restore();
    },

    'test should add new entry into clicks array': function () {
        var target = this.view,
            clicksCount = window.EventsUtils.DoubleTap._internals.clicks.length,
            click;

        window.EventsUtils.DoubleTap._internals.addClick(target, 0);

        click = window.EventsUtils.DoubleTap._internals.clicks.
            filter(function (c) {
                return c.target == target;
            });

        assertTrue(this.spys.removeTargetClicks.calledOnce);
        assertEquals(clicksCount + 1, window.EventsUtils.DoubleTap._internals.clicks.length);
        assertEquals(1, click.length);
        assertEquals(target, click[0].target);
        assertEquals(0, click[0].time);
    }
});

TestCase("[Events Utils - Double Tap] removeTargetClicks test", {
    'setUp': function () {
        /*:DOC view = <div></div>*/
    },

    tearDown: function () {},

    'test should remove all target clicks entries from clicks array': function () {
        var target = this.view,
            clicksCount = window.EventsUtils.DoubleTap._internals.clicks.length,
            click;

        window.EventsUtils.DoubleTap._internals.addClick(target, 0);
        window.EventsUtils.DoubleTap._internals.removeTargetClicks(target);

        click = window.EventsUtils.DoubleTap._internals.clicks.
            filter(function (c) {
                return c.target == target;
            });

        assertEquals(clicksCount, window.EventsUtils.DoubleTap._internals.clicks.length);
        assertEquals(0, click.length);
    }
});


TestCase("[Events Utils - Double Tap] getLastTargetClick tests", {
    'setUp': function () {
        /*:DOC view = <div></div>*/
        /*:DOC anotherView = <div></div>*/

        this.spys = {
            removeTargetClicks: sinon.spy(window.EventsUtils.DoubleTap._internals, 'removeTargetClicks')
        };
    },

    tearDown: function () {
        window.EventsUtils.DoubleTap._internals.removeTargetClicks.restore();
    },

    'test should return latest target click entry from clicks array': function () {
        var target = this.view,
            clicksCount = window.EventsUtils.DoubleTap._internals.clicks.length,
            click;

        window.EventsUtils.DoubleTap._internals.addClick(target, 0);
        window.EventsUtils.DoubleTap._internals.addClick(target, 1);

        click = window.EventsUtils.DoubleTap._internals.getLastTargetClick(target);

        assertTrue(this.spys.removeTargetClicks.calledTwice);
        assertEquals(clicksCount + 1, window.EventsUtils.DoubleTap._internals.clicks.length);
        assertNotNull(click);
        assertEquals(target, click.target);
        assertEquals(1, click.time);
    },

    'test should return null': function () {
        var target = this.anotherView,
            click;

        click = window.EventsUtils.DoubleTap._internals.getLastTargetClick(target);

        assertFalse(this.spys.removeTargetClicks.called);
        assertNull(click);
    }
});

TestCase("[Events Utils - Double Tap] addCallback test", {
    'setUp': function () {
        /*:DOC view = <div></div>*/
    },

    tearDown: function () {},

    'test should add target callback into callbacks array': function () {
        var target = this.view,
            callbacksCount = window.EventsUtils.DoubleTap._internals.callbacks.length,
            callback = function () {},
            filteredCallback;

        window.EventsUtils.DoubleTap._internals.addCallback(target, callback);

        filteredCallback = window.EventsUtils.DoubleTap._internals.callbacks.
            filter(function (c) {
                return c.target == target;
            });

        assertEquals(callbacksCount + 1, window.EventsUtils.DoubleTap._internals.callbacks.length);
        assertEquals(1, filteredCallback.length);
        assertEquals(target, filteredCallback[0].target);
        assertEquals(callback, filteredCallback[0].callback);
    }
});

TestCase("[Events Utils - Double Tap] removeTargetCallbacks test", {
    'setUp': function () {
        /*:DOC view = <div></div>*/
    },

    tearDown: function () {},

    'test should remove all target callbacks from callbacks array': function () {
        var target = this.view,
            callbacksCount = window.EventsUtils.DoubleTap._internals.callbacks.length,
            callback = function () {},
            filteredCallback;

        window.EventsUtils.DoubleTap._internals.addCallback(target, callback);
        window.EventsUtils.DoubleTap._internals.removeTargetCallbacks(target);

        filteredCallback = window.EventsUtils.DoubleTap._internals.callbacks.
            filter(function (c) {
                return c.target == target;
            });

        assertEquals(callbacksCount, window.EventsUtils.DoubleTap._internals.callbacks.length);
        assertEquals(0, filteredCallback.length);
    }
});

TestCase("[Events Utils - Double Tap] getTargetCallbacks tests", {
    'setUp': function () {
        /*:DOC view = <div></div>*/
        /*:DOC anotherView = <div></div>*/
    },

    tearDown: function () {},

    'test should return all target callbacks from callbacks array': function () {
        var target = this.view,
            callbacksCount = window.EventsUtils.DoubleTap._internals.callbacks.length,
            callback1 = function () {},
            callback2 = function () {},
            filteredCallbacks;

        window.EventsUtils.DoubleTap._internals.addCallback(target, callback1);
        window.EventsUtils.DoubleTap._internals.addCallback(target, callback2);

        filteredCallbacks = window.EventsUtils.DoubleTap._internals.getTargetCallbacks(target);

        assertEquals(callbacksCount + 2, window.EventsUtils.DoubleTap._internals.callbacks.length);
        assertEquals(2, filteredCallbacks.length);
        assertEquals(callback1, filteredCallbacks[0]);
        assertEquals(callback2, filteredCallbacks[1]);
    },

    'test should return empty array': function () {
        var target = this.anotherView,
            filteredCallbacks;

        filteredCallbacks = window.EventsUtils.DoubleTap._internals.getTargetCallbacks(target);

        assertEquals(0, filteredCallbacks.length);
    }
});
