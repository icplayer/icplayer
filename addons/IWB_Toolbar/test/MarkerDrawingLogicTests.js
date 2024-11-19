TestCase("[IWB Toolbar] MarkerDrawingLogic method tests", {
    setUp: function () {
        this.presenter = AddonIWB_Toolbar_create();

        this.stubs = {
            markerTmpCanvasAddEventListenerStub: sinon.stub(),
            isEventSupportedStub: sinon.stub()
        };

        this.presenter.markerTmpCanvas = document.createElement("div");

        this.presenter.markerTmpCanvas.addEventListener = this.stubs.markerTmpCanvasAddEventListenerStub;
        MobileUtils.isEventSupported = this.stubs.isEventSupportedStub;
    },

    tearDown: function () {
        this.setPointerEventSupport(true);
    },

    setPointerEventSupport: function (hasSupport) {
        window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
    },

    validateAttachedListeners: function (expectedListeners) {
        for (let i = 0, call; i < expectedListeners.length; i++) {
            call = this.stubs.markerTmpCanvasAddEventListenerStub.getCall(i);
            assertEquals(`${expectedListeners[i].eventName} on temp marker canvas test`, call.args[0], expectedListeners[i].eventName);
            assertEquals(`${expectedListeners[i].method} on temp marker canvas test`, call.args[1], expectedListeners[i].method);
        }
    },

    'test given pointer and touch supported window when markerDrawingLogic is called then attach pointer listeners to temp marker canvas': function () {
        this.setPointerEventSupport(true);
        this.stubs.isEventSupportedStub.returns(true);

        this.presenter.markerDrawingLogic();

        const expectedListeners = [
            {eventName: "pointerdown", method: this.presenter.markerPointerDownHandler},
            {eventName: "pointermove", method: this.presenter.markerPointerMoveHandler},
            {eventName: "pointerup", method: this.presenter.markerPointerUpHandler},
            {eventName: "pointerleave", method: this.presenter.markerPointerUpHandler},
        ];
        this.validateAttachedListeners(expectedListeners);
    },

    'test given mouse supported window when drawingLogic is called then attach mouse listeners to temp marker canvas': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(false);

        this.presenter.markerDrawingLogic();

        const expectedListeners = [
            {eventName: "mousedown", method: this.presenter.markerPointerDownHandler},
            {eventName: "mousemove", method: this.presenter.markerPointerMoveHandler},
            {eventName: "mouseup", method: this.presenter.markerPointerUpHandler},
            {eventName: "mouseleave", method: this.presenter.markerPointerUpHandler},
        ];
        this.validateAttachedListeners(expectedListeners);
    },

    'test given touch supported window when drawingLogic is called then attach touch listeners to temp marker canvas': function () {
        this.setPointerEventSupport(false);
        this.stubs.isEventSupportedStub.returns(true);

        this.presenter.markerDrawingLogic();

        const expectedListeners = [
            {eventName: "touchstart", method: this.presenter.onTouchStartCallback},
            {eventName: "touchend", method: this.presenter.onTouchEndEventCallback},
        ];
        this.validateAttachedListeners(expectedListeners);
    }
});
