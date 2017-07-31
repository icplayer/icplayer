TestCase("[Commons - WaitingDecorator] isAvailableCallback tests", {
    setUp: function () {
        this.functionToCall = sinon.mock();
        this.waitingDecorator = window.DecoratorUtils.DeferredSyncQueue(this.functionToCall);
    },

    'test added isAvailableCallback should be set in configuration' : function () {
        assertEquals(this.thisValue, this.waitingDecorator.checkFunction.self);
        assertEquals(this.functionToCall, this.waitingDecorator.checkFunction.functionToCall);
    },

    'test added isAvailableCallback function should return false': function () {
        this.functionToCall.returns(false);

        var returnValue = this.waitingDecorator.callIsAvailableCheckFunction();
        assertTrue(this.functionToCall.calledOnce);
        assertEquals(false, returnValue);

    },

    'test added isAvailableCallback function should return true': function () {
        this.functionToCall.returns(true);

        var returnValue = this.waitingDecorator.callIsAvailableCheckFunction();
        assertTrue(this.functionToCall.calledOnce);
        assertEquals(true, returnValue);

    }

});