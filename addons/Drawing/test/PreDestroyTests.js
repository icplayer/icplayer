TestCase("[Drawing] PreDestroy", {
    setUp: function() {
        this.presenter = AddonDrawing_create();

        this.presenter.configuration = {
            addonID: "Drawing1",
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

    'test given modified state when preDestroy executed then do not send any event' : function() {
        this.presenter.isModified = true;
        this.presenter.shouldUpdateState = true;

        this.presenter.preDestroy();

        assertFalse(this.stubs.sendEvent.called);
    },

    'test given not modified state when preDestroyed executed then send `empty` pre destroyed event' : function() {
        this.presenter.isModified = false;
        this.presenter.shouldUpdateState = false;

        this.presenter.preDestroy();

        assertTrue(this.stubs.sendEvent.calledWith("PreDestroyed", {
            "source": "Drawing1",
            "item": '',
            "value": "empty",
        }));
    }
});
