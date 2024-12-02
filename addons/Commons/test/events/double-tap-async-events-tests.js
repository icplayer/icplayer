var AsyncEventsDesktopTests = AsyncTestCase('[Events Utils - Double Tap] Async Events Tests');

AsyncEventsDesktopTests.prototype.setPointerEventSupport = function (hasSupport) {
    window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
};

AsyncEventsDesktopTests.prototype.setUp = function() {
    /*:DOC view = <div></div>*/

    this.$view = $(this.view);

    this.doubleTapCallback = function () {};

    this.stubs = {
        userAgent: sinon.stub(window.EventsUtils.DoubleTap._internals, 'getUserAgent'),
        getCurrentTime: sinon.stub(window.EventsUtils.DoubleTap._internals, 'getCurrentTime')
    };

    this.spys = {
        doubleTapHandler: sinon.spy(window.EventsUtils.DoubleTap._internals, 'doubleTapHandler'),
        doubleTapCallback: sinon.spy(this, 'doubleTapCallback')
    };
    this.setPointerEventSupport(false);

    this.stubs.userAgent.returns("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36"); //Chrome 48

    this.stubs.getCurrentTime.returns(0);

    window.EventsUtils.DoubleTap.on(this.$view, this.doubleTapCallback);
};

AsyncEventsDesktopTests.prototype.tearDown = function() {
    window.EventsUtils.DoubleTap._internals.getUserAgent.restore();
    window.EventsUtils.DoubleTap._internals.getCurrentTime.restore();
    window.EventsUtils.DoubleTap._internals.doubleTapHandler.restore();
    this.doubleTapCallback.restore();
    this.setPointerEventSupport(true);
};

AsyncEventsDesktopTests.prototype.testDoubleTapWithTimeDifferenceLowerThan300ms = function(queue) {
    queue.call('Trigger 2 mousedown events', function(callbacks) {
        var count = 0, callback;

        callback = callbacks.add(function () {
            count += 1;

            if (count === 2) {
                this.stubs.getCurrentTime.returns(299);
            }

            this.$view.trigger('mousedown');
        }, 2); // expect callback to be called no less than 2 times

        callback();
        callback();
    });

    queue.call('Should call doubleTapCallback', function() {
        assertTrue(this.spys.doubleTapHandler.called);
        assertEquals(2, this.spys.doubleTapHandler.callCount);
        assertTrue(this.spys.doubleTapCallback.called);
        assertEquals(1, this.spys.doubleTapCallback.callCount);
    });
};

AsyncEventsDesktopTests.prototype.testDoubleTapWithTimeDifferenceEqualTo300ms = function(queue) {
    queue.call('Trigger 2 mousedown events', function(callbacks) {
        var count = 0, callback;

        callback = callbacks.add(function () {
            count += 1;

            if (count === 2) {
                this.stubs.getCurrentTime.returns(300);
            }

            this.$view.trigger('mousedown');
        }, 2); // expect callback to be called no less than 2 times

        callback();
        callback();
    });

    queue.call('Should call doubleTapCallback', function() {
        assertTrue(this.spys.doubleTapHandler.called);
        assertEquals(2, this.spys.doubleTapHandler.callCount);
        assertTrue(this.spys.doubleTapCallback.called);
        assertEquals(1, this.spys.doubleTapCallback.callCount);
    });
};

AsyncEventsDesktopTests.prototype.testDoubleTapWithTimeDifferenceGraterThan300ms = function(queue) {
    queue.call('Trigger 2 mousedown events', function(callbacks) {
        var count = 0, callback;

        callback = callbacks.add(function () {
            count += 1;

            if (count === 2) {
                this.stubs.getCurrentTime.returns(301);
            }

            this.$view.trigger('mousedown');
        }, 2); // expect callback to be called no less than 2 times

        callback();
        callback();
    });

    queue.call('Should not call doubleTapCallback', function() {
        assertTrue(this.spys.doubleTapHandler.called);
        assertEquals(2, this.spys.doubleTapHandler.callCount);
        assertFalse(this.spys.doubleTapCallback.called);
        assertEquals(0, this.spys.doubleTapCallback.callCount);
    });
};
