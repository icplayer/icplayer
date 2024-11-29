TestCase("[Shape_Tracing] Events listeners tests", {
    setUp: function () {
        this.presenter = AddonShape_Tracing_create();

        this.stubs = {
            isEventSupportedStub: sinon.stub(),
            connectPointerEventsStub: sinon.stub(),
            connectTouchEventsStub: sinon.stub(),
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

    setUpToExecuteRun: function () {
        this.presenter._connectPointerEvents = this.stubs.connectPointerEventsStub;
        this.presenter._connectTouchEvents = this.stubs.connectTouchEventsStub;

        this.stubs.validateModelStub = sinon.stub();
        this.presenter.validateModel = this.stubs.validateModelStub;
        this.stubs.validateModelStub.returns({
            isVisible: true,
            isValid: true,
            points: []
        });

        this.stubs.setVisibilityStub = sinon.stub();
        this.presenter.setVisibility = this.stubs.setVisibilityStub;

        this.stubs.initializeCanvasStub = sinon.stub();
        this.presenter.initializeCanvas = this.stubs.initializeCanvasStub;

        this.stubs.getEventBusStub = sinon.stub();
		this.stubs.getEventBusStub.returns({
            addEventListener: function () {}
        });
        this.presenter.setPlayerController({
            getEventBus: this.stubs.getEventBusStub
        });

        const view = document.createElement("div");
        const drawingMainElement = document.createElement("div");
        drawingMainElement.classList.add("drawing-main");
        drawingMainElement.getContext = sinon.stub();
        drawingMainElement.getContext.returns(null);
        view.append(drawingMainElement);

        const drawingElement = document.createElement("div");
        drawingElement.classList.add("drawing");
        drawingElement.getContext = sinon.stub();
        drawingElement.getContext.returns(null);
        view.append(drawingElement);

        this.presenter.view = view;
    },

    validateAttachedListeners: function (stub, eventTypePrefix) {
        for (let i = 0, call; i < stub.callCount; i++) {
            call = stub.getCall(i);
            assertTrue(`Expected that ${call.args[0]} event starts with ${eventTypePrefix}`, call.args[0].startsWith(eventTypePrefix));
        }
    },

    'test given pointer and touch supported window when attaching events listeners then execute method to attach pointer events listeners': function () {
        this.setPointerEventSupport(true);
        this.stubs.isEventSupportedStub.returns(true);
        this.setUpToExecuteRun();

        this.presenter.run(this.view, {});

        assertTrue(this.presenter._connectPointerEvents.called);
        assertFalse(this.presenter._connectTouchEvents.called);
    },

    'test given touch supported window when attaching events listeners then execute method to attach touch events listeners': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(true);
        this.setUpToExecuteRun();

        this.presenter.run(this.view, {});

        assertFalse(this.presenter._connectPointerEvents.called);
        assertTrue(this.presenter._connectTouchEvents.called);
    },

    'test given only mouse supported window when attaching events listeners then execute method to attach pointer events listeners': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(false);
        this.setUpToExecuteRun();

        this.presenter.run(this.view, {});

        assertTrue(this.presenter._connectPointerEvents.called);
        assertFalse(this.presenter._connectTouchEvents.called);
    },

    'test given only pointer supported window when attaching events listeners then execute method to attach pointer events listeners': function () {
        this.setPointerEventSupport(true);
        this.stubs.isEventSupportedStub.returns(false);
        this.setUpToExecuteRun();

        this.presenter.run(this.view, {});

        assertTrue(this.presenter._connectPointerEvents.called);
        assertFalse(this.presenter._connectTouchEvents.called);
    },

    'test given window with pointer event support when creating pointer events listeners then create pointer events listeners': function () {
        this.setPointerEventSupport(true);
        const $canvas = {
            on: sinon.stub()
        };

        this.presenter._connectPointerEvents($canvas);

        this.validateAttachedListeners($canvas.on, "pointer");
    },

    'test given window without pointer event support when creating pointer events listeners then create mouse events listeners': function () {
        this.setPointerEventSupport(false);
        const $canvas = {
            on: sinon.stub()
        };

        this.presenter._connectPointerEvents($canvas);

        this.validateAttachedListeners($canvas.on, "mouse");
    },

    'test given window with pointer event support when creating touch events listeners then create touch events listeners': function () {
        this.setPointerEventSupport(true);
        const $canvas = {
            on: sinon.stub()
        };

        this.presenter._connectTouchEvents($canvas);

        this.validateAttachedListeners($canvas.on, "touch");
    },

    'test given window with touch event support when creating touch events listeners then create touch events listeners': function () {
        this.setPointerEventSupport(false);
        const $canvas = {
            on: sinon.stub()
        };

        this.presenter._connectTouchEvents($canvas);

        this.validateAttachedListeners($canvas.on, "touch");
    }
});
