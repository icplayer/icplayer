TestCase("[Commons - WaitingDecorator] Decorators tests", {
    setUp: function () {
        this.isAvailableStub = sinon.stub();
        this.deferredDecorator = window.DecoratorUtils.DeferredSyncQueue(this.isAvailableStub);
    },

    'test decorated function should be pushed to queue if isAvailable returns false and should be called after callQueue with provided args': function () {
        this.isAvailableStub.returns(false);

        var callback = sinon.spy();
        var decoratedStub1 = this.deferredDecorator.decorate(callback);
        decoratedStub1('some', 'args', 23);

        assertEquals(0, callback.callCount);

        this.deferredDecorator.resolve();

        assertEquals(1, callback.callCount);
        assertTrue(callback.calledWith('some', 'args', 23));

        assertTrue(this.isAvailableStub.calledOnce);

    },
    'test decorated function should be called instantly after call if isAvailable returns true': function () {
        this.isAvailableStub.returns(true);

        var callback = sinon.spy();
        var decoratedStub1 = this.deferredDecorator.decorate(callback);
        decoratedStub1('some', 'args', 23);

        assertEquals(1, callback.callCount);
        assertTrue(callback.calledWith('some', 'args', 23));
    },
    'test decorated function with own provided isAvailableFunction should call own isAvailable instead of default isAvailableFunction' : function () {
        var ownIsAvailableFunction = sinon.mock();
        ownIsAvailableFunction.returns(true);

        var callback = sinon.spy();
        var decoratedCallback = this.deferredDecorator.decorate(callback, ownIsAvailableFunction);

        decoratedCallback();

        assertTrue(ownIsAvailableFunction.calledOnce);
        assertTrue(callback.calledOnce);
    },

    'test decorated function with own provided isAvailableFunction should push to queue if own isAvailableFunction returns false': function () {
        var ownIsAvailableFunction = sinon.mock();
        ownIsAvailableFunction.returns(false);

        var callback = sinon.spy();
        var decoratedCallback = this.deferredDecorator.decorate(callback, ownIsAvailableFunction);

        decoratedCallback();

        assertTrue(this.deferredDecorator.queue.length === 1);
        assertTrue(ownIsAvailableFunction.calledOnce);
        assertFalse(callback.calledOnce);
    }

});