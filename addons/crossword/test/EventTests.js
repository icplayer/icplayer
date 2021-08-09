TestCase("Events test", {
    setUp: function() {
        this.presenter = Addoncrossword_create();
        this.presenter.addonID = 'crossword1';
        sinon.stub(this.presenter, 'sendAllOKEvent');
        sinon.stub(this.presenter, 'isAllOK');
        this.stubs = {
            gradualShowAnswers: sinon.stub()
        };
        this.presenter.gradualShowAnswers = this.stubs.gradualShowAnswers;
    },

    tearDown: function() {
        this.presenter.sendAllOKEvent.restore();
        this.presenter.isAllOK.restore();
    },

    'test AllOK event should be sent': function () {
        this.presenter.isAllOK.returns(true);
        this.presenter.cellBlurEventHandler();

        assertTrue(this.presenter.sendAllOKEvent.called);
    },

    'test AllOK event should not be sent': function () {
        this.presenter.isAllOK.returns(false);
        this.presenter.cellBlurEventHandler();

        assertFalse(this.presenter.sendAllOKEvent.called);
    },

    'test GSA event calls the right method': function () {
        var eventName = "GradualShowAnswers";
        var eventData = {
            moduleID: 'crossword1'
        };
        this.presenter.onEventReceived(eventName, eventData);

        assertEquals(1, this.stubs.gradualShowAnswers.callCount);
    }
});
