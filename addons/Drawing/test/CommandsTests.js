TestCase("[Drawing] Reset command", {
    setUp: function() {
        this.presenter = AddonDrawing_create();

        this.presenter.configuration = {
            addonID: "Drawing1",
            context: {
                clearRect: function() { }
            },
            canvas: [
                {
                    width: 100,
                    height: 200
                }
            ]
        };

        this.presenter.model = {
            Color: "Pink",
            Thickness: 41
        };

        this.stubs = {
            clearRect: sinon.stub(this.presenter.configuration.context, 'clearRect'),
            setThickness: sinon.stub(this.presenter, 'setThickness'),
            setColor: sinon.stub(this.presenter, 'setColor'),
            setVisibility: sinon.stub(this.presenter, 'setVisibility'),
            addEventListener: sinon.stub(),
            sendEvent: sinon.stub(),
        };

        this.presenter.eventBus = {
            addEventListener: this.stubs.addEventListener,
            sendEvent: this.stubs.sendEvent
        };
        this.presenter.setEventBus(this.presenter.eventBus);
    },

    'test reset with default visibility as hidden' : function() {
        this.presenter.configuration.isVisible = true;
        this.presenter.configuration.isVisibleByDefault = false;

        this.presenter.reset();

        var clearRectCallArgs = this.stubs.clearRect.getCall(0).args;
        assertEquals(0, clearRectCallArgs[0]);
        assertEquals(0, clearRectCallArgs[1]);
        assertEquals(100, clearRectCallArgs[2]);
        assertEquals(200, clearRectCallArgs[3]);

        assertTrue(this.stubs.setColor.calledWith("Pink"));
        assertTrue(this.stubs.setThickness.calledWith(41));

        assertTrue(this.stubs.setVisibility.calledWith(false));
    },

    'test reset with default visibility as visible' : function() {
        this.presenter.configuration.isVisible = false;
        this.presenter.configuration.isVisibleByDefault = true;

        this.presenter.reset();

        var clearRectCallArgs = this.stubs.clearRect.getCall(0).args;
        assertEquals(0, clearRectCallArgs[0]);
        assertEquals(0, clearRectCallArgs[1]);
        assertEquals(100, clearRectCallArgs[2]);
        assertEquals(200, clearRectCallArgs[3]);

        assertTrue(this.stubs.setColor.calledWith("Pink"));
        assertTrue(this.stubs.setThickness.calledWith(41));

        assertTrue(this.stubs.setVisibility.calledWith(true));
    },

    'test given modified state when reset executed then change state to not modified' : function() {
        this.presenter.isModified = true;
        this.presenter.shouldUpdateState = true;

        this.presenter.reset();

        assertFalse(this.presenter.isModified);
        assertFalse(this.presenter.shouldUpdateState);
    },

    'test given modified state when reset executed then send `empty` value changed event' : function() {
        this.presenter.isModified = true;
        this.presenter.shouldUpdateState = true;

        this.presenter.reset();

        assertTrue(this.stubs.sendEvent.calledWith("ValueChanged", {
            "source": "Drawing1",
            "item": '',
            "value": "empty",
            "score": ''
        }));
    },

    'test given not modified state when reset executed then send `empty` value changed event' : function() {
        this.presenter.isModified = false;
        this.presenter.shouldUpdateState = false;

        this.presenter.reset();

        assertTrue(this.stubs.sendEvent.calledWith("ValueChanged", {
            "source": "Drawing1",
            "item": '',
            "value": "empty",
            "score": ''
        }));
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
    },
});