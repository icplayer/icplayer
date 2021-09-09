TestCase("Events test", {
    setUp: function() {
        this.presenter = Addoncrossword_create();
        this.presenter.addonID = 'crossword1';
        this.presenter.isGradualShowAnswersActive = false;

        sinon.stub(this.presenter, 'sendAllOKEvent');
        sinon.stub(this.presenter, 'isAllOK');

        this.spies = {
            showAnswers: sinon.spy(this.presenter, 'showAnswers'),
            hideAnswers: sinon.spy(this.presenter, 'hideAnswers'),
            gradualShowAnswers: sinon.spy(this.presenter, 'gradualShowAnswers')
        }
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

    'test showAnswers event calls the right method': function () {
        var eventName = "ShowAnswers";
        var eventData = {};
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.showAnswers.called);
    },

    'test hideAnswers event calls the right method': function () {
        var eventName = "HideAnswers";
        var eventData = {};
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.hideAnswers.called);
    },

    'test GSA event calls the right method and changes isGradualShowAnswersActive to true': function () {
        var eventName = "GradualShowAnswers";
        var eventData = {
            moduleID: 'crossword1'
        };
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.gradualShowAnswers.called);
        assertTrue(this.presenter.isGradualShowAnswersActive);
    },

    'test GHA event calls the right method and changes isGradualShowAnswersActive to false': function () {
        this.presenter.isGradualShowAnswersActive = true;
        var eventName = "GradualHideAnswers";
        var eventData = {};
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.hideAnswers.called);
        assertFalse(this.presenter.isGradualShowAnswersActive);
    }
});
