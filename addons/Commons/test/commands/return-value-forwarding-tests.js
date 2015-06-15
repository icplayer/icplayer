TestCase("[Commons - Commands] Commands return value forwarding", {
    setUp: function() {
        this.commands = {
            'getSomeValue': function() {},
            'getAnotherValue': function() {}
        };

        sinon.stub(this.commands, 'getAnotherValue');
        sinon.stub(this.commands, 'getSomeValue');
        this.commands.getSomeValue.returns(5);

        this.thisObject = {
            callMe: function() {}
        };
    },

    tearDown: function() {
        this.commands.getAnotherValue.restore();
        this.commands.getSomeValue.restore();
    },

    'test existing command return value': function() {
        var returnValue = Commands.dispatch(this.commands, 'getsomevalue', [], this.thisObject);

        assertTrue(this.commands.getSomeValue.calledOnce);
        assertEquals(5, returnValue);
        assertFalse(this.commands.getAnotherValue.called);
    }
});