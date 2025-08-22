TestCase('[Audio] PreDestroy', {
    setUp : function() {
        this.presenter = AddonAudio_create();

        this.presenter.configuration = {
            addonID: "Audio1",
        };

        this.stubs = {
            addEventListener: sinon.stub(),
            sendEvent: sinon.stub(),
        };
        this.presenter.eventBus = {
            addEventListener: this.stubs.addEventListener,
            sendEvent: this.stubs.sendEvent
        };
        this.presenter.setEventBus(this.presenter.eventBus);
    },

    'test given not played state when preDestroyed executed then send not-started event' : function() {
        this.presenter._setPlayed(false);

        this.presenter.preDestroy();

        assertTrue(this.stubs.sendEvent.calledWith("PreDestroyed", {
            "source": "Audio1",
            "item": '',
            "value": "not-started",
        }));
    },

    'test given played state when reset executed then do not send any event' : function() {
        this.presenter._setPlayed(true);

        this.presenter.preDestroy();

        assertFalse(this.stubs.sendEvent.called);
    }
});
