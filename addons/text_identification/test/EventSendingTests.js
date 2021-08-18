TestCase("[Text Identification] Event sending", {
    setUp : function() {
        this.presenter = Addontext_identification_create();
        this.presenter.configuration = {
            addonID: 'TextIdent1',
            isSelected: true,
            shouldBeSelected: true
        };
        this.presenter.isGradualShowAnswersActive = false;

        this.stubs = {
            findStub: sinon.stub(),
            removeClassStub: sinon.stub(),
            addClassStub: sinon.stub()
        };

        this.stubs.findStub.returns({
            removeClass: this.stubs.removeClassStub
        });

        this.stubs.removeClassStub.returns({
            addClass: this.stubs.addClassStub
        });

        this.presenter.$view = {
            find: this.stubs.findStub
        };

        this.spies = {
            showAnswers: sinon.spy(this.presenter, 'showAnswers'),
            hideAnswers: sinon.spy(this.presenter, 'hideAnswers'),
        };

        var eventBus = this.eventBus = {
            sendEvent: function () {}
        };

        this.presenter.playerController = {
            getEventBus: function () {
                return eventBus
            }
        };

        sinon.stub(this.eventBus, 'sendEvent');
    },

    tearDown: function () {
        this.eventBus.sendEvent.restore();
    },

    'test successful event sending' : function() {
        this.presenter.triggerSelectionChangeEvent();

        assertTrue(this.eventBus.sendEvent.called);
    },

    'test Player Controller is not defined' : function() {
        this.presenter.playerController = null;

        this.presenter.triggerSelectionChangeEvent();

        assertFalse(this.eventBus.sendEvent.called);
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
            moduleID: 'TextIdent1'
        };
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.showAnswers.called);
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
