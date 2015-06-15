TestCase("[Commons - Commands] Commands dispatching", {
    setUp: function() {
        this.commands = {
            'nextFrame': function(params) {
                this.callMe(params);
            },
            'previousFrame': function() {},
            'show': function() {},
            'hide': function() {},
            'undefinedCommand': undefined
        };

        sinon.stub(this.commands, 'nextFrame');
        sinon.stub(this.commands, 'previousFrame');
        sinon.stub(this.commands, 'show');
        sinon.stub(this.commands, 'hide');

        this.thisObject = {
            callMe: function() {}
        };

        this.thisObjectSpy = sinon.stub(this.thisObject, 'callMe');
    },

    tearDown: function() {
        this.commands.nextFrame.restore();
        this.commands.previousFrame.restore();
        this.commands.show.restore();
        this.commands.hide.restore();

        this.thisObject.callMe.restore();
    },

    'test existing command': function() {
        Commands.dispatch(this.commands, 'nextframe', [], this.thisObject);

        assertTrue(this.commands.nextFrame.calledOnce);

        assertFalse(this.commands.previousFrame.calledOnce);
        assertFalse(this.commands.show.calledOnce);
        assertFalse(this.commands.hide.calledOnce);
    },

    'test not existing command': function() {
        Commands.dispatch(this.commands, 'nextimage', [], this.thisObject);

        assertFalse(this.commands.nextFrame.calledOnce);
        assertFalse(this.commands.previousFrame.calledOnce);
        assertFalse(this.commands.show.calledOnce);
        assertFalse(this.commands.hide.calledOnce);
    },

    'test existing command this and params objects passing': function() {
        this.commands.nextFrame.restore();
        var params = ['param1', 'param2'];

        Commands.dispatch(this.commands, 'nextframe', params, this.thisObject);

        sinon.stub(this.commands, 'nextFrame');
        assertTrue(this.thisObjectSpy.calledWith(params));
        assertFalse(this.commands.previousFrame.calledOnce);
        assertFalse(this.commands.show.calledOnce);
        assertFalse(this.commands.hide.calledOnce);
    },

    'test existing command but undefined reference': function() {
        Commands.dispatch(this.commands, 'undefinedcommand', [], this.thisObject);

        assertFalse(this.commands.nextFrame.calledOnce);
        assertFalse(this.commands.previousFrame.calledOnce);
        assertFalse(this.commands.show.calledOnce);
        assertFalse(this.commands.hide.calledOnce);
    }
});