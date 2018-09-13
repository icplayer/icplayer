TestCase("Events emulation", {
    setUp: function () {
        this.presenter = AddonVisual_Feedback_Creator_create();

        sinon.stub(this.presenter, 'onEventReceived');
    },

    tearDown: function () {
        this.presenter.onEventReceived.restore();
    },

    'test Reset event': function () {
        this.presenter.reset();

        assertTrue(this.presenter.onEventReceived.calledWith('Reset', {}));
    },

    'test Check event': function () {
        this.presenter.setShowErrorsMode();

        assertTrue(this.presenter.onEventReceived.calledWith('Check', {}));
    },

    'test Uncheck event': function () {
        this.presenter.setWorkMode();

        assertTrue(this.presenter.onEventReceived.calledWith('Uncheck', {}));
    }
});