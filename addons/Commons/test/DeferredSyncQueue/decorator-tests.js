TestCase("[Commons - WaitingDecorator] Decorators tests when predicate returns True", {
    setUp: function () {
        this.isAvailableStub = sinon.stub();
        this.deferredDecorator = window.DecoratorUtils.DeferredSyncQueue(this.isAvailableStub);
        this.callback = sinon.spy();
    },

    'test decorated function should be called instantly': function () {
        this.isAvailableStub.returns(true);

        var callback = sinon.spy();
        var decoratedStub1 = this.deferredDecorator.decorate(callback);
        decoratedStub1('some', 'args', 23);

        assertEquals(1, callback.callCount);
        assertTrue(callback.calledWith('some', 'args', 23));
    }
});

TestCase("[Commons - WaitingDecorator] Decorators tests when predicate returns False", {
    setUp: function () {
        this.isAvailableStub = sinon.stub();
        this.deferredDecorator = window.DecoratorUtils.DeferredSyncQueue(this.isAvailableStub);
        this.callback = sinon.spy();
        this.isAvailableStub.returns(false);

        this.decoratedStub1 = this.deferredDecorator.decorate(this.callback);
        this.decoratedStub1('some', 'args', 23);
    },

    'test decorated function should be pushed to queue': function () {
        assertEquals(0, this.callback.callCount);
        assertEquals(1, this.deferredDecorator.queue.length);

    },
    'test decorated function should be called with provided args after calling resolve': function () {
        this.deferredDecorator.resolve();

        assertEquals(1, this.callback.callCount);
        assertTrue(this.callback.calledWith('some', 'args', 23));

        assertTrue(this.isAvailableStub.calledOnce);

    }
});

TestCase("[Commons - WaitingDecorator] Decorators tests when is passing own predicate function", {
    setUp: function () {
        this.isAvailableStub = sinon.stub();
        this.deferredDecorator = window.DecoratorUtils.DeferredSyncQueue(this.isAvailableStub);
        this.callback = sinon.spy();
    },

    'test decorated function should call own isAvailable instead of default isAvailableFunction' : function () {
        var ownIsAvailableFunction = sinon.mock();
        ownIsAvailableFunction.returns(true);

        var decoratedCallback = this.deferredDecorator.decorate(this.callback, ownIsAvailableFunction);

        decoratedCallback();

        assertTrue(ownIsAvailableFunction.calledOnce);
        assertTrue(this.callback.calledOnce);
    },

    'test decorated function should push to queue if own isAvailableFunction returns false': function () {
        var ownIsAvailableFunction = sinon.mock();
        ownIsAvailableFunction.returns(false);

        var decoratedCallback = this.deferredDecorator.decorate(this.callback, ownIsAvailableFunction);

        decoratedCallback();

        assertTrue(this.deferredDecorator.queue.length === 1);
        assertTrue(ownIsAvailableFunction.calledOnce);
        assertFalse(this.callback.calledOnce);
    }

});