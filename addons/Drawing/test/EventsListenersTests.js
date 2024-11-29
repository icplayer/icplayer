TestCase("[Drawing] Method to attach event listeners tests", {
    setUp: function () {
        this.presenter = AddonDrawing_create();

        this.stubs = {
            isEventSupportedStub: sinon.stub(),
            connectPointerEventsStub: sinon.stub(),
            connectTouchEventsStub: sinon.stub(),
            documentAddEventListenerStub: sinon.stub(),
            tmpCanvasAddEventListenerStub: sinon.stub(),
        };

        this.presenter.configuration = {
            tmp_canvas: {
                addEventListener: this.stubs.tmpCanvasAddEventListenerStub
            }
        };

        this.presenter._connectPointerEvents = this.stubs.connectPointerEventsStub;
        this.presenter._connectTouchEvents = this.stubs.connectTouchEventsStub;
        document.addEventListener = this.stubs.documentAddEventListenerStub;
        MobileUtils.isEventSupported = this.stubs.isEventSupportedStub;
        this.stubs.isEventSupportedStub.returns(false);
    },

    tearDown: function () {
        this.setPointerEventSupport(true);
    },

    setPointerEventSupport: function (hasSupport) {
        window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
    },

    'test given pointer and touch supported window when attaching events listeners then execute method to attach pointer events listeners': function () {
        this.setPointerEventSupport(true);
        this.stubs.isEventSupportedStub.returns(true);

        this.presenter._turnOnEventListeners();

        assertTrue(this.presenter._connectPointerEvents.called);
        assertFalse(this.presenter._connectTouchEvents.called);
    },

    'test given touch supported window when attaching events listeners then execute method to attach touch events listeners': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(true);

        this.presenter._turnOnEventListeners();

        assertFalse(this.presenter._connectPointerEvents.called);
        assertTrue(this.presenter._connectTouchEvents.called);
    },

    'test given only mouse supported window when attaching events listeners then execute method to attach pointer events listeners': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(false);

        this.presenter._turnOnEventListeners();

        assertTrue(this.presenter._connectPointerEvents.called);
        assertFalse(this.presenter._connectTouchEvents.called);
    },

    'test given only pointer supported window when attaching events listeners then execute method to attach pointer events listeners': function () {
        this.setPointerEventSupport(true);
        this.stubs.isEventSupportedStub.returns(false);

        this.presenter._turnOnEventListeners();

        assertTrue(this.presenter._connectPointerEvents.called);
        assertFalse(this.presenter._connectTouchEvents.called);
    }
});

TestCase("[Drawing] Attaching pointer, mouse and touch event listeners tests", {
    setUp: function () {
        this.presenter = AddonDrawing_create();

        this.stubs = {
            isEventSupportedStub: sinon.stub(),
            tmpCanvasAddEventListenerStub: sinon.stub(),
        };

        this.presenter.configuration = {
            tmp_canvas: {
                addEventListener: this.stubs.tmpCanvasAddEventListenerStub
            }
        };

        MobileUtils.isEventSupported = this.stubs.isEventSupportedStub;
        this.stubs.isEventSupportedStub.returns(false);
    },

    tearDown: function () {
        this.setPointerEventSupport(true);
    },

    setPointerEventSupport: function (hasSupport) {
        window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
    },

    validateAttachedListeners: function (stub, eventTypePrefix) {
        for (let i = 0, call; i < stub.callCount; i++) {
            call = stub.getCall(i);
            assertTrue(`Expected that ${call.args[0]} event starts with ${eventTypePrefix}`, call.args[0].startsWith(eventTypePrefix));
        }
    },

    'test given window with pointer event support when creating pointer events listeners then create pointer events listeners': function () {
        this.setPointerEventSupport(true);

        this.presenter._connectPointerEvents(this.presenter.configuration.tmp_canvas, null, null);

        this.validateAttachedListeners(this.presenter.configuration.tmp_canvas.addEventListener, "pointer");
    },

    'test given window without pointer event support when creating pointer events listeners then create mouse events listeners': function () {
        this.setPointerEventSupport(false);

        this.presenter._connectPointerEvents(this.presenter.configuration.tmp_canvas, null, null);

        this.validateAttachedListeners(this.presenter.configuration.tmp_canvas.addEventListener, "mouse");
    },

    'test given window with pointer event support when creating touch events listeners then create touch events listeners': function () {
        this.setPointerEventSupport(true);

        this.presenter._connectTouchEvents(this.presenter.configuration.tmp_canvas, null, null);

        this.validateAttachedListeners(this.presenter.configuration.tmp_canvas.addEventListener, "touch");
    },

    'test given window with touch event support when creating touch events listeners then create touch events listeners': function () {
        this.setPointerEventSupport(false);

        this.presenter._connectTouchEvents(this.presenter.configuration.tmp_canvas, null, null);

        this.validateAttachedListeners(this.presenter.configuration.tmp_canvas.addEventListener, "touch");
    }
});
