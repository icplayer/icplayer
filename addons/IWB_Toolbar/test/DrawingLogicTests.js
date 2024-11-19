TestCase("[IWB Toolbar] DrawingLogic method tests", {
    setUp: function () {
        this.presenter = AddonIWB_Toolbar_create();

        this.stubs = {
            canvasAddEventListenerStub: sinon.stub(),
            markerCanvasAddEventListenerStub: sinon.stub(),
            isEventSupportedStub: sinon.stub()
        };

        this.presenter.$canvas = $(document.createElement("div"));
        this.presenter.$markerCanvas = $(document.createElement("div"));
        this.presenter.markerTmpCanvas = document.createElement("div");

        this.presenter.$canvas[0].addEventListener = this.stubs.canvasAddEventListenerStub;
        this.presenter.$markerCanvas[0].addEventListener = this.stubs.markerCanvasAddEventListenerStub;
        MobileUtils.isEventSupported = this.stubs.isEventSupportedStub;
    },

    tearDown: function () {
        this.setPointerEventSupport(true);
    },

    setPointerEventSupport: function (hasSupport) {
        window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
    },

    validateAttachedListeners: function (expectedListeners) {
        for (let i = 0, call; i < 3; i++) {
            call = this.stubs.canvasAddEventListenerStub.getCall(i);
            assertEquals(`${expectedListeners[i].eventName} on canvas test`, call.args[0], expectedListeners[i].eventName);
            assertEquals(`${expectedListeners[i].method} on canvas test`, call.args[1], expectedListeners[i].method);
        }

        for (let i = 0, call; i < 3; i++) {
            call = this.stubs.markerCanvasAddEventListenerStub.getCall(i);
            assertEquals(`${expectedListeners[i].eventName} on markerCanvas test`, call.args[0], expectedListeners[i].eventName);
            assertEquals(`${expectedListeners[i].method} on markerCanvas test`, call.args[1], expectedListeners[i].method);
        }
    },

    'test given pointer and touch supported window when drawingLogic is called then attach pointer listeners to both canvases': function () {
        this.setPointerEventSupport(true);
        this.stubs.isEventSupportedStub.returns(true);

        this.presenter.drawingLogic();

        const expectedListeners = [
            {eventName: "pointerdown", method: this.presenter.penPointerDownHandler},
            {eventName: "pointermove", method: this.presenter.penPointerMoveHandler},
            {eventName: "pointerup", method: this.presenter.penPointerUpHandler},
        ];
        this.validateAttachedListeners(expectedListeners);
    },

    'test given touch supported window when drawingLogic is called then attach touch listeners to both canvases': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(true);

        this.presenter.drawingLogic();

        const expectedListeners = [
            {eventName: "touchstart", method: this.presenter.penPointerDownHandler},
            {eventName: "touchmove", method: this.presenter.penPointerMoveHandler},
            {eventName: "touchend", method: this.presenter.penPointerUpHandler},
        ];
        this.validateAttachedListeners(expectedListeners);
    },

    'test given mouse supported window when drawingLogic is called then attach mouse listeners to both canvases': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(false);

        this.presenter.drawingLogic();

        const expectedListeners = [
            {eventName: "mousedown", method: this.presenter.penPointerDownHandler},
            {eventName: "mousemove", method: this.presenter.penPointerMoveHandler},
            {eventName: "mouseup", method: this.presenter.penPointerUpHandler},
        ];
        this.validateAttachedListeners(expectedListeners);
    }
});
