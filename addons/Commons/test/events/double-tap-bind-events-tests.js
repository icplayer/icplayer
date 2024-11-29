TestCase("[Events Utils - Double Tap] onDoubleTap", {
    'setUp': function () {
        /*:DOC view = <div></div>*/

        this.$view = $(this.view);

        this.stubs = {
            $on: sinon.stub(this.$view, 'on'),
            userAgent: sinon.stub(window.EventsUtils.DoubleTap._internals, 'getUserAgent')
        };

        this.stubs.userAgent.returns("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36"); //Chrome 48
        this.setPointerEventSupport(false);
    },

    tearDown: function () {
        this.$view.on.restore();
        window.EventsUtils.DoubleTap._internals.getUserAgent.restore();
        this.setPointerEventSupport(true);
    },

    setPointerEventSupport: function (hasSupport) {
        window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
    },

    'test should bind startEvent with doubleTapHandler callback': function () {
        var callbacksCount = window.EventsUtils.DoubleTap._internals.callbacks.length,
            callback = function () {},
            targetCallbacks;

        window.EventsUtils.DoubleTap.on(this.$view, callback);

        targetCallbacks = window.EventsUtils.DoubleTap._internals.getTargetCallbacks(this.view);

        assertTrue(this.stubs.$on.calledOnce);
        assertTrue(this.stubs.$on.calledWith('mousedown', window.EventsUtils.DoubleTap._internals.doubleTapHandler));
        assertEquals(callbacksCount + 1, window.EventsUtils.DoubleTap._internals.callbacks.length);
        assertEquals(1, targetCallbacks.length);
        assertEquals(callback, targetCallbacks[0]);
    }
});

TestCase("[Events Utils - Double Tap] offDoubleTap", {
    'setUp': function () {
        /*:DOC view = <div></div>*/

        this.$view = $(this.view);

        this.stubs = {
            $on: sinon.stub(this.$view, 'on'),
            $off: sinon.stub(this.$view, 'off'),
            userAgent: sinon.stub(window.EventsUtils.DoubleTap._internals, 'getUserAgent')
        };

        this.stubs.userAgent.returns("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36"); //Chrome 48
        this.setPointerEventSupport(false);
    },

    tearDown: function () {
        this.$view.on.restore();
        this.$view.off.restore();
        window.EventsUtils.DoubleTap._internals.getUserAgent.restore();
        this.setPointerEventSupport(true);
    },

    setPointerEventSupport: function (hasSupport) {
        window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
    },

    'test should bind and unbind startEvent with doubleTapHandler callback': function () {
        var callbacksCount = window.EventsUtils.DoubleTap._internals.callbacks.length,
            callback = function () {},
            targetCallbacks;

        window.EventsUtils.DoubleTap.on(this.$view, callback);
        window.EventsUtils.DoubleTap.off(this.$view);

        targetCallbacks = window.EventsUtils.DoubleTap._internals.getTargetCallbacks(this.view);

        assertTrue(this.stubs.$off.calledOnce);
        assertTrue(this.stubs.$off.calledWith('mousedown', window.EventsUtils.DoubleTap._internals.doubleTapHandler));
        assertEquals(callbacksCount, window.EventsUtils.DoubleTap._internals.callbacks.length);
        assertEquals(0, targetCallbacks.length);
    }
});