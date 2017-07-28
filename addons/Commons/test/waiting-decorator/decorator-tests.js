TestCase("[Commons - WaitingDecorator] Decorators tests", {
    setUp: function () {
        this.waitingDecorator = new window.WaitingDecorator();
        this.isAvailableStub = sinon.stub();
        this.selfIsAvailable = sinon.spy();
        this.waitingDecorator.setIsAvailableCheckFunction(this.selfIsAvailable, this.isAvailableStub);

    },

    'test decorated function should be pushed to queue if isAvailable returns false and called after callQueue with provided args': function () {
        this.isAvailableStub.returns(false);

        var callback = sinon.spy();
        var decoratedStub1 = this.waitingDecorator.decorate(callback);
        decoratedStub1('some', 'args', 23);

        assertEquals(0, callback.callCount);

        this.waitingDecorator.callQueue();

        assertEquals(1, callback.callCount);
        assertTrue(callback.calledWith('some', 'args', 23));

        assertTrue(this.isAvailableStub.calledOnce);

    },
    'test decorated function should be called instantly after call if isAvailable returns true': function () {
        this.isAvailableStub.returns(true);

        var callback = sinon.spy();
        var decoratedStub1 = this.waitingDecorator.decorate(callback);
        decoratedStub1('some', 'args', 23);

        assertEquals(1, callback.callCount);
        assertTrue(callback.calledWith('some', 'args', 23));
    }

});