TestCase("[Commons - WaitingDecorator] isAvailableCallback tests", {
    setUp: function () {
        this.waitingDecorator = new window.WaitingDecorator();
        this.thisValue = sinon.stub();
        this.functionToCall = sinon.mock();

        this.waitingDecorator.setIsAvailableCheckFunction(this.thisValue, this.functionToCall);
    },

    'test added isAvailableCallback should be set in configuration' : function () {
        assertEquals(this.thisValue, this.waitingDecorator.checkFunction.self);
        assertEquals(this.functionToCall, this.waitingDecorator.checkFunction.functionToCall);
    },

    'test added isAvailableCallback function should be called with provided scope and should return false': function () {
        this.functionToCall.returns(false);

        var returnValue = this.waitingDecorator.callIsAvailableCheckFunction();
        assertTrue(this.functionToCall.calledOnce);
        assertTrue(this.functionToCall.calledOn(this.thisValue));
        assertEquals(false, returnValue);

    },

    'test added isAvailableCallback function should be called with provided scope and should return true': function () {
        this.functionToCall.returns(true);

        var returnValue = this.waitingDecorator.callIsAvailableCheckFunction();
        assertTrue(this.functionToCall.calledOnce);
        assertTrue(this.functionToCall.calledOn(this.thisValue));
        assertEquals(true, returnValue);

    }

});