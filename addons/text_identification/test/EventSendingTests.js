TestCase("[Text Identification] Event sending", {
    setUp : function() {
        this.presenter = Addontext_identification_create();
        this.presenter.configuration = {
            addonID: 'TextIdent1',
            isSelected: true,
            shouldBeSelected: true
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
    }
});