TestCase("[Text Identification] Event sending", {
    setUp : function() {
        this.presenter = Addontext_identification_create();
        this.presenter.configuration = {
            addonID: 'TextIdent1',
            isSelected: true,
            shouldBeSelected: true

        };

        this.stubs = {
            showAnswers: sinon.stub()
        };
        this.presenter.showAnswers = this.stubs.showAnswers;

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

    'test GSA event calls showAnswers method' : function() {
        var eventName = "GradualShowAnswers";
        var eventData = {
            moduleID: 'TextIdent1'
        };
        this.presenter.onEventReceived(eventName, eventData);

        assertEquals(1, this.stubs.showAnswers.callCount);
    }
});