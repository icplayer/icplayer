function AddonIWB_Toolbar_create() {

    /*
     * KNOWN ISSUES:
     *       Drawing with zoom:
     *          Because zoom option (provided with zoom.js library) is based on CSS properties 'zoom' and
     *          '-moz-transform' drawing in such mode is not possible. IWB Toolbar panel is hidden when user activates
     *          zoom option and it's displayed again after zooming out.
     *
     *       Preventing modules and addons click handlers execution in zoom mode:
     *          Each module and addon can register unlimited number of click handlers to its internal elements. When
     *          zoom mode is activated, IWB Toolbar needs to prevent execution of those handlers. For instance,
     *          TextAudio binds a handler to span elements. Those handlers needs to be removed for as long as zoom
      *         mode is active and reinstated when zoom mode is deactivated.
      *
      *      Incomplete erasing on Android:
      *      Issue occurs sometimes without known reason. The helpful solution was workaround redrawing canvas.
     */

    var presenter = function() {};

    presenter.noteObjects = [];

    presenter._kinetic = {};
    presenter._kinetic.images = [];
    presenter._kinetic.rotateObj = [];
    presenter._kinetic.moveObj = [];
    presenter._kinetic.rotateIcon = [];
    presenter._kinetic.moveIcon = [];
    presenter._kinetic.imageObj = [];
    presenter._hoveredButtons = [];
    presenter._iwb_buttons = [];
    presenter._setState = {};
    presenter._setState.images = [];

    presenter.stateStack = null;

    presenter._stopwatchTimer = null;
    presenter._stopwatch = null;

    presenter._clockwatch = null;
    presenter._clockwatchTimer = null;

    presenter.buttonClicked = false;
    presenter.isZoomActive = false;
    presenter.areZoomEventHandlersAttached = false;

    var DEFAULT_COLOR = '#0fa9f0';
    var GAP_VALUE = 10;
    var STOPWATCH_OFFSET = 60;
    var CLOCK_OFFSET = 60;
    var NOTE_OFFSET = 120;
    presenter.activeButton = '';
    presenter.activeFunction;
    presenter.isRecklicked = false;
    const CUSTOM_BUTTON_NAME = 'custom-script';
    presenter.customButtonActive = false;
    presenter.isCommandSourceToDeselectCustomButton = false;

    presenter.points = [];
    presenter.mouse = {x: 0, y: 0};

    presenter.trueClosedPanelSize = {};

    presenter.data = {
        defaultPenWidth: 1,
        penColor: DEFAULT_COLOR,
        markerColor: '#ffff99',
        markerThickness: 10,
        eraserThickness: 20
    };

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.areas = [];
    presenter.clocks = [];
    presenter.stopwatches = [];
    presenter.currentLineColor = DEFAULT_COLOR;
    presenter.currentLineWidth = presenter.data.defaultPenWidth;
    presenter.isPointerDown = false;
    presenter.lastMousePosition = {};
    presenter.floatingImageGroups = {};
    presenter.currentFloatingImageIndex = 0;
    presenter.textAudioEvents = [];

    presenter.penUsed = false;
    presenter.markerUsed = false;
    presenter.isPointerEventSupported = !!window.PointerEvent;

    presenter.notesCounter = 0;
    presenter.POPUP_TYPE = {
        STOPWATCH: 'stopwatch',
        CLOCK: 'clock',
        NOTE: 'note'
    };

    presenter.zoomConfiguration = {
        initialWindowHeight: 0,
        initialNotScaledOffset: 0,
        playerInitialLeftOffset: 0,
        viewLeftOffset: 0
    };

    function getCorrectObject(val) {
        return {
            isValid: true,
            value: val
        };
    }

    function getErrorObject(ec) {
        return {
            isValid: false,
            errorCode: ec
        };
    }

    function addZero(val) {
        return (val > 9 ? '' : '0') + val;
    }

    function getPoint(x, y) {
        return {
            x: x,
            y: y
        };
    }

    presenter.DEFAULT_FLOATING_IMAGE = {
        0: 'it_ruler.png',
        1: 'it_setsquare.png',
        2: 'it_protractor.png'
    };

    presenter.FLOATING_IMAGE_MODE = {
        ROTATE: 1,
        MOVE: 2
    };

    presenter.DRAW_MODE = {
        MARKER: 1,
        PEN: 2,
        ERASER: 3,
        STAND_AREA: 4,
        HIDE_AREA: 5,
        NONE : 6
    };

    presenter.drawMode = presenter.DRAW_MODE.NONE;
    presenter.floatingImageMode = presenter.FLOATING_IMAGE_MODE.MOVE;

    presenter.DRAWING_DATA = {
        'color' : {
            'black': '#000',
            'white': '#fff',
            'yellow':'#FFFF66',
            'red': '#cf304b',
            'orange': '#FF9900',
            'blue': '#0fa9f0',
            'violet': '#990099',
            'green': '#05fa98'
        },
        'thickness' : {
            'pen' : {
                '1': 1,
                '2': 3,
                '3': 5,
                '4': 7
            },
            'marker' : {
                '1': 10,
                '2': 15,
                '3': 20,
                '4': 25
            }
        }
    };

    function getCurrentGroup() {
        return presenter.floatingImageGroups[presenter.currentFloatingImageIndex];
    }

    function getCurrentImage() {
        return presenter.floatingImageGroups[presenter.currentFloatingImageIndex].children[0];
    }

    function getCurrentMoveIcon() {
        return presenter.floatingImageGroups[presenter.currentFloatingImageIndex].children[1];
    }

    function getCurrentRotateIcon() {
        return presenter.floatingImageGroups[presenter.currentFloatingImageIndex].children[2];
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this);
        presenter.eventBus.addEventListener('ResizeWindow', this);
    };

    presenter.onEventReceived = function(eventName, eventData) {
        if (eventName == 'PageLoaded' && eventData.source == 'header') {
            presenter.headerLoadedDeferred.resolve();
        }

        if (eventName == 'PageLoaded') {
            presenter.loadWindowSize();
        }

        if (eventName == "ResizeWindow") {
            var newPlayerLeftOffset = $("#_icplayer").offset().left;
            var viewLeftOffset = presenter.zoomConfiguration.viewLeftOffset;
            var playerInitialLeftOffset = presenter.zoomConfiguration.playerInitialLeftOffset;
            var newViewLeftOffset = newPlayerLeftOffset - playerInitialLeftOffset + viewLeftOffset;
            presenter.$panel.offset({left: newViewLeftOffset});
        }
    };

    presenter.loadWindowSize = function(){
        presenter.zoomConfiguration.initialWindowHeight = window.iframeSize.windowInnerHeight;
        presenter.zoomConfiguration.initialNotScaledOffset = window.iframeSize.notScaledOffset;

        // you must repeat the data reading when they are not loaded correctly
        if (presenter.zoomConfiguration.initialWindowHeight === 0 || isNaN(presenter.zoomConfiguration.initialNotScaledOffset))
            setTimeout(function (e) {
                presenter.loadWindowSize();
            }, 200);
    };

    presenter.ERROR_CODES = {
        'E01': 'Width can NOT be negative.',
        'E02': 'Height can NOT be negative.',
    };

    presenter.closePanel = function IWB_Toolbar_closePanel(doAnimation) {
        if (!presenter.$panel.hasClass('animationInProgress')) {
            window.savedPanel.isOpen = false;

            presenter.$bottomPanels.addClass('closed-hide');
            presenter.$buttonsExceptOpen.addClass('hidden');
            presenter.$panel.children('.button-separator').hide();

            var config = {};
            var openedPanelPosition = {
                left: presenter.$panel.position().left,
                top: presenter.$panel.position().top
            };
            let positionToSave = {};
            $.extend(true, positionToSave, openedPanelPosition);

            var newLeft = openedPanelPosition.left + presenter.config.widthWhenOpened - presenter.trueClosedPanelSize.width;
            var newTop = openedPanelPosition.top + presenter.config.widthWhenOpened - presenter.trueClosedPanelSize.height;
            if (presenter.config.expansionDirection == "right" || presenter.config.expansionDirection == "left") {
                config.width = presenter.trueClosedPanelSize.width + 'px';
                if (presenter.config.expansionDirection == "left") {
                    config.left = newLeft + 'px';
                    positionToSave.left = newLeft;
                }
            } else {
                config.height = presenter.trueClosedPanelSize.height + 'px';
                if (presenter.config.expansionDirection == "up") {
                    config.top = newTop + 'px';
                    positionToSave.top = newTop;
                }
            }

            if (presenter.config.panelPosition === 'fixed') {
                positionToSave.top -= presenter.$pagePanel.offset().top;
                positionToSave.left -= presenter.$pagePanel.offset().left;
            }

            window.savedPanel.position = {
                top: positionToSave.top,
                left: positionToSave.left
            };

            if (doAnimation) {
                presenter.$panel.addClass('animationInProgress');
                presenter.$panel.animate(config, 1000, presenter._closePanelShow);
            } else {
                presenter._closePanelShow();
                config.hasOwnProperty("width") && presenter.$panel.css("width", config.width);
                config.hasOwnProperty("height") && presenter.$panel.css("height", config.height);
                config.hasOwnProperty("left") && presenter.$panel.css("left", config.left);
                config.hasOwnProperty("top") && presenter.$panel.css("top", config.top);
            }
        }
    };

    presenter._openPanelShow = function IWB_Toolbar_openPanelShow() {
        presenter.$buttonsExceptOpen.removeClass('hidden');
        presenter.$panel.children('.button.open').hide();
        presenter.$panel.children('.button-separator').show();
        presenter.$panel.removeClass('animationInProgress');
        presenter.$panel.addClass('opened');
        presenter.$bottomPanels.removeClass('closed-hide');
        presenter.toogleMasks();
    };

    presenter._closePanelShow = function IWB_Toolbar_closePanelShow() {
        presenter.$panel.children('.button.open').show();
        presenter.$panel.removeClass('animationInProgress');
        presenter.$panel.removeClass('opened');
    };

    presenter.openPanel = function IWB_Toolbar_openPanel(doAnimation) {
        window.savedPanel.isOpen = true;

        var config = {};
        var closedPanelPosition = {
            left: presenter.$panel.position().left,
            top: presenter.$panel.position().top
        };

        var newLeft = closedPanelPosition.left + presenter.trueClosedPanelSize.width - presenter.config.widthWhenOpened;
        var newTop = closedPanelPosition.top + presenter.trueClosedPanelSize.height - presenter.config.widthWhenOpened;
        if (presenter.config.expansionDirection == "right" || presenter.config.expansionDirection == "left") {
            config.width = presenter.config.widthWhenOpened + "px";
            if (presenter.config.expansionDirection == "left") {
                config.left = newLeft + "px";
            }
        } else {
            config.height = presenter.config.widthWhenOpened + "px";
            if (presenter.config.expansionDirection == "up") {
                config.top = newTop + "px";
            }
        }

        if (doAnimation) {
            presenter.$panel.addClass('animationInProgress');
            presenter.$panel.animate(config, 1000, presenter._openPanelShow);
        } else {
            presenter._openPanelShow();
            config.hasOwnProperty("width") && presenter.$panel.css("width", config.width);
            config.hasOwnProperty("height") && presenter.$panel.css("height", config.height);
            config.hasOwnProperty("left") && presenter.$panel.css("left", config.left);
            config.hasOwnProperty("top") && presenter.$panel.css("top", config.top);
        }
    };

    function setOverflowWorkAround(turnOn) {
        if (!MobileUtils.isAndroidWebBrowser(window.navigator.userAgent)) { return false; }

        var android_ver = MobileUtils.getAndroidVersion(window.navigator.userAgent);
        if (["4.1.1", "4.1.2", "4.2.2", "4.3", "4.4.2"].indexOf(android_ver) !== -1) {

            presenter.$pagePanel.find('.iwb-toolbar-mask').parents("*").each(function() {
                var overflow = null;
                if (turnOn) {
                    $(this).attr("data-overflow", $(this).css("overflow"));
                    $(this).css("overflow", "visible");
                } else {
                    overflow = $(this).attr("data-overflow");
                    if (overflow !== "") {
                        $(this).css("overflow", overflow);
                    }
                    $(this).removeAttr("data-overflow");
                }
            });

        }

        return true;
    }

    presenter.IWBDraw = function(canvas, ctx, mousePosition) {
        const grad = ctx.createLinearGradient(0, 0, canvas[0].width, 0);
        grad.addColorStop(0, presenter.currentLineColor);
        grad.addColorStop(1, presenter.currentLineColor);

        ctx.lineWidth = presenter.drawMode === presenter.DRAW_MODE.ERASER ? presenter.currentEraserThickness : presenter.currentLineWidth;
        ctx.strokeStyle = grad;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(presenter.lastMousePosition.x, presenter.lastMousePosition.y);
        ctx.lineTo(mousePosition.x, mousePosition.y);
        ctx.stroke();
    };

    function getCursorPosition(e) {
        var canvas;

        if(e.target.id == "iwb_tmp_canvas") {
            canvas = presenter.$view.parent().find('.selecting').find('#iwb_tmp_canvas')[0];
        } else {
            canvas = presenter.$canvas[0];
        }

        var rect = canvas.getBoundingClientRect();
        var canvasOffsetLeft = $(canvas).offset().left;

        if(presenter.standHideAreaClicked){
            canvasOffsetLeft = 0;
        }

        const clientX = e.originalEvent ? e.originalEvent.clientX : e.clientX;
        const clientY = e.originalEvent ? e.originalEvent.clientY : e.clientY;
        if (clientX) {
            return getPoint(
                parseInt(clientX - rect.left, 10),
                parseInt(clientY - rect.top, 10)
            );
        }

        var t = event.targetTouches[0] || event.touches[0] || event.changedTouches[0];
        return getPoint(
            parseInt(t.pageX - canvasOffsetLeft, 10),
            parseInt(t.pageY - $(canvas).offset().top, 10)
        );
    }

    function changeDrawingType(button) {
        var activeButton = presenter.$pagePanel.find('.clicked');

        if ($(button).parent().parent().hasClass('bottom-panel-thickness')) { // is changing thickness
            var thickness = $(button).attr('thickness'),
                drawingType = activeButton.hasClass('pen') ? 'pen' : 'marker';
            presenter.data.defaultPenWidth = 1;
            presenter.changeThickness(presenter.DRAWING_DATA['thickness'][drawingType][thickness], button);
            presenter.buttonThickness = button;
        } else {
            var color = $(button).attr('color');
            presenter.changeColor(presenter.DRAWING_DATA['color'][color], button);
            presenter.buttonColor = button;
        }
    }

    function openBottomPanel(button) {
        presenter.$pagePanel.find('.bottom-panel').hide();

        var panel;
        if ($(button).hasClass('color')) {
            panel = presenter.$pagePanel.find('.bottom-panel-color');
        } else if ($(button).hasClass('thickness')) {
            panel = presenter.$pagePanel.find('.bottom-panel-thickness');
        } else {
            panel = presenter.$pagePanel.find('.bottom-panel-floating-image');
        }

        if(panel.hasClass('bottom-panel-floating-image')){
            if(panel.attr('isHidden') == '0'){
                panel.hide();
                panel.attr('isHidden', '1');
                return;
            }
            if (panel.is(':visible')) {
                panel.hide();
                panel.attr('isHidden', '1');
            } else {
                panel.show();
                panel.attr('isHidden', '0');
            }
        }else{
            if (panel.is(':visible')) {
                panel.hide();
            } else {
                panel.show();
            }
        }
    }

    function applyDoubleTapHandler($element, callback) {
        var lastEvent = null,
            tapsCounter = 0;

        $element.on('touchstart', function(e) {
            lastEvent = e.evt || e;
        });

        $element.on('touchend', function(e) {
            if (lastEvent.type == 'touchstart') {
                tapsCounter++;

                if (tapsCounter == 2) {
                    callback();
                    tapsCounter = 0;
                }
            }
            lastEvent = e.evt || e;
        });

        $element.on('touchmove', function(e) {
            lastEvent = e.evt || e;
        });
    }
    
    function getTouchStartOrMouseDownEventName() {
        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            return 'touchstart';
        }
        return EventsUtils.PointingEvents.TYPES.DOWN;
    }

    presenter.onMobilePaint = function(e) {
        var iwb_tmp_canvas;
        iwb_tmp_canvas = presenter.markerTmpCanvas;

        e.preventDefault();
        e.stopPropagation();

        var x = e.targetTouches[0].pageX - $(iwb_tmp_canvas).offset().left;
        var y = e.targetTouches[0].pageY - $(iwb_tmp_canvas).offset().top;

        presenter.mouse.x = x;
        presenter.mouse.y = y;
        presenter.onPaint(e);
    };

    presenter.onPaint = function(e) {
        var iwb_tmp_canvas, tmp_ctx;
        iwb_tmp_canvas = presenter.markerTmpCanvas;
        tmp_ctx = presenter.markerTmpCtx;
        tmp_ctx.globalAlpha = 0.4;

        tmp_ctx.lineWidth = presenter.currentMarkerThickness;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = presenter.currentLineColor;
        tmp_ctx.fillStyle = presenter.currentLineColor;

        presenter.points.push({x: presenter.mouse.x, y: presenter.mouse.y});

        if (presenter.points.length < 3) {
            var b = presenter.points[0];
            tmp_ctx.beginPath();
            tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
            tmp_ctx.fill();
            tmp_ctx.closePath();
        } else {
            tmp_ctx.clearRect(0, 0, iwb_tmp_canvas.width, iwb_tmp_canvas.height);

            tmp_ctx.beginPath();
            tmp_ctx.moveTo(presenter.points[0].x, presenter.points[0].y);

            for (var i = 1; i < presenter.points.length - 2; i++) {
                var c = (presenter.points[i].x + presenter.points[i + 1].x) / 2;
                var d = (presenter.points[i].y + presenter.points[i + 1].y) / 2;

                tmp_ctx.quadraticCurveTo(presenter.points[i].x, presenter.points[i].y, c, d);
            }

            tmp_ctx.quadraticCurveTo(
                presenter.points[i].x,
                presenter.points[i].y,
                presenter.points[i + 1].x,
                presenter.points[i + 1].y
            );
            tmp_ctx.stroke();
        }
    };

    presenter.onTouchStartCallback = function (event) {
        event.preventDefault();
        event.stopPropagation();

        setOverflowWorkAround(true);

        presenter.onMobilePaint(event);
        presenter.markerTmpCanvas.addEventListener('touchmove', presenter.onMobilePaint);
    };

    function saveMarkerDataUrl() {
        presenter.markerDataUrl = presenter.$markerCanvas[0].toDataURL('image/png');
    }

    presenter.onTouchEndEventCallback = function (event) {
        event.stopPropagation();

        setOverflowWorkAround(false);

        presenter.markerUsed = true;

        presenter.markerTmpCanvas.removeEventListener('touchmove', presenter.onMobilePaint, false);
        presenter.markerCtx.drawImage(presenter.markerTmpCanvas, 0, 0);
        presenter.markerTmpCtx.clearRect(0, 0, presenter.markerTmpCanvas.width, presenter.markerTmpCanvas.height);

        presenter.points = [];
        saveMarkerDataUrl();
    };

    presenter.markerPointerDownHandler = function IWB_Toolbar_markerPointerDownHandler(event) {
        event.stopPropagation();
        event.preventDefault();
        if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
            return;
        }
        presenter.isPointerDown = true;
        setOverflowWorkAround(true);

        presenter.markerTmpCanvas.addEventListener(EventsUtils.PointingEvents.TYPES.MOVE, presenter.onPaint, false);

        presenter.points.push({
            x: typeof event.offsetX !== 'undefined' ? event.offsetX : event.layerX,
            y: typeof event.offsetY !== 'undefined' ? event.offsetY : event.layerY
        });
    };

    presenter.markerPointerMoveHandler = function IWB_Toolbar_markerPointerMoveHandler(event) {
        if (!presenter.isPointerDown) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        if (!EventsUtils.PointingEvents.isPrimaryEvent(event) || presenter.drawMode !== presenter.DRAW_MODE.MARKER) {
            return;
        }

        presenter.mouse.x = typeof event.offsetX !== 'undefined' ? event.offsetX : event.layerX;
        presenter.mouse.y = typeof event.offsetY !== 'undefined' ? event.offsetY : event.layerY;
    };

    presenter.markerPointerUpHandler = function IWB_Toolbar_markerPointerUpHandler(event) {
        event.stopPropagation();
        event.preventDefault();
        if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
            return;
        }

        if (presenter.isPointerDown) {
            presenter.markerUsed = true;
        }
        presenter.isPointerDown = false;
        setOverflowWorkAround(false);

        presenter.markerTmpCanvas.removeEventListener(EventsUtils.PointingEvents.TYPES.MOVE, presenter.onPaint, false);
        presenter.markerCtx.drawImage(presenter.markerTmpCanvas, 0, 0);
        presenter.markerTmpCtx.clearRect(0, 0, presenter.markerTmpCanvas.width, presenter.markerTmpCanvas.height);

        presenter.points = [];
        saveMarkerDataUrl();

        presenter.pushStateToStack();
    };

    presenter.markerDrawingLogic = function IWB_Toolbar_markerDrawingLogic() {
        $(presenter.markerTmpCanvas).off();

        if (EventsUtils.PointingEvents.hasPointerEventSupport() || !MobileUtils.isEventSupported('touchstart')) {
            presenter.markerTmpCanvas.addEventListener(EventsUtils.PointingEvents.TYPES.DOWN, presenter.markerPointerDownHandler, false);
            presenter.markerTmpCanvas.addEventListener(EventsUtils.PointingEvents.TYPES.MOVE, presenter.markerPointerMoveHandler, false);
            presenter.markerTmpCanvas.addEventListener(EventsUtils.PointingEvents.TYPES.UP, presenter.markerPointerUpHandler, false);
            presenter.markerTmpCanvas.addEventListener(EventsUtils.PointingEvents.TYPES.LEAVE, presenter.markerPointerUpHandler, false);
        } else {
            presenter.markerTmpCanvas.addEventListener('touchstart', presenter.onTouchStartCallback, false);
            presenter.markerTmpCanvas.addEventListener('touchend', presenter.onTouchEndEventCallback, false);
        }
    };

    presenter.penPointerDownHandler = function IWB_Toolbar_penPointerDownHandler(event) {
        event.stopPropagation();
        event.preventDefault();
        if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
            return;
        }
        presenter.lastMousePosition = getCursorPosition(event);
        presenter.isPointerDown = true;
        setOverflowWorkAround(true);
    };

    presenter.penPointerMoveHandler = function IWB_Toolbar_penPointerMoveHandler(event) {
        if (!presenter.isPointerDown) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
            return;
        }

        if (presenter.drawMode === presenter.DRAW_MODE.PEN) {
            presenter.IWBDraw(presenter.$canvas, presenter.ctx, getCursorPosition(event));
        } else if (presenter.drawMode === presenter.DRAW_MODE.ERASER) {
            presenter.IWBDraw(presenter.$markerCanvas, presenter.markerCtx, getCursorPosition(event));
            presenter.IWBDraw(presenter.$canvas, presenter.ctx, getCursorPosition(event));

            var android_ver = MobileUtils.getAndroidVersion(window.navigator.userAgent);
            if (["4.1.1", "4.1.2", "4.2.2", "4.3", "4.4.2"].indexOf(android_ver) !== -1) {
                $('canvas').css('opacity', '0.99');

                setTimeout(function() {
                    $('canvas').css('opacity', '1');
                }, 5);
            }
        }
        presenter.lastMousePosition = getCursorPosition(event);
    };

    presenter.penPointerUpHandler = function IWB_Toolbar_penPointerUpHandler(event) {
        event.stopPropagation();
        event.preventDefault();
        if (!EventsUtils.PointingEvents.isPrimaryEvent(event)) {
            return;
        }
        if (presenter.isPointerDown) {
            presenter.penUsed = true;
        }
        presenter.isPointerDown = false;
        setOverflowWorkAround(false);
        presenter.penDataURL = presenter.$canvas[0].toDataURL('image/png');
        if (presenter.drawMode === presenter.DRAW_MODE.ERASER && presenter.markerUsed) {
            saveMarkerDataUrl();
        }

        presenter.pushStateToStack();
    };

    presenter.drawingLogic = function IWB_Toolbar_drawingLogic() {
        $(presenter.markerTmpCanvas).off();

        let downEventName, moveEventName, upEventName;
        if (EventsUtils.PointingEvents.hasPointerEventSupport() || !MobileUtils.isEventSupported('touchstart')) {
            downEventName = EventsUtils.PointingEvents.TYPES.DOWN;
            moveEventName = EventsUtils.PointingEvents.TYPES.MOVE;
            upEventName = EventsUtils.PointingEvents.TYPES.UP;
        } else {
            downEventName = "touchstart";
            moveEventName = "touchmove";
            upEventName = "touchend";
        }

        const canvases = [presenter.$canvas[0], presenter.$markerCanvas[0]];
        for (let i = 0; i < canvases.length; i++) {
            canvases[i].addEventListener(downEventName, presenter.penPointerDownHandler, false);
            canvases[i].addEventListener(moveEventName, presenter.penPointerMoveHandler, false);
            canvases[i].addEventListener(upEventName, presenter.penPointerUpHandler, false);
        }
    };

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradeEnableUndoRedo(model);
        upgradedModel = presenter.upgradeDefaultZoom(upgradedModel);
        upgradedModel = presenter.upgradeExpansionDirection(upgradedModel);
        upgradedModel = presenter.upgradePopupsDirection(upgradedModel);
        return upgradedModel;
    };

    presenter.upgradeEnableUndoRedo = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel['enableUndoRedo']) {
            upgradedModel['enableUndoRedo'] = 'false';
        }
        return upgradedModel;
    };

    presenter.upgradeExpansionDirection = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["expansionDirection"]) {
            upgradedModel["expansionDirection"] = "right";
        }
        return upgradedModel;
    };

    presenter.upgradePopupsDirection = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["verticalPopupDirection"]) {
            upgradedModel["verticalPopupDirection"] = "right";
        }

        if (!upgradedModel["horizontalPopupDirection"]) {
            upgradedModel["horizontalPopupDirection"] = "down";
        }

        return upgradedModel;
    };

    presenter.upgradeDefaultZoom = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel['disableModuleZoom']) {
            upgradedModel['disableModuleZoom'] = 'false';
        }

        if (!upgradedModel['defaultZoom']) {
            upgradedModel['defaultZoom'] = '';
        }

        return upgradedModel;
    };

    presenter.setBasicConfiguration = function (view, model) {
        presenter.$view = $(view);
        presenter.$panel = $(view).find('.iwb-toolbar-panel');
        presenter.$panel.attr('id', model['ID'] + '-panel');
        presenter.$defaultThicknessButton = presenter.$panel.find('.thickness-1');
        presenter.$defaultColorButton = presenter.$panel.find('.color-blue');
        presenter.isInFrame = window.parent.location != window.location;
        presenter.$buttonsExceptOpen = presenter.$panel.children('.button:not(.open)');
        presenter.buttonWidth = presenter.$buttonsExceptOpen.width();

        var display = $(view).css('display');
        if (display && display.length > 0 && display != "block") {
            presenter.$panel.css('display', display);
        }

        presenter.$view.parent().append(presenter.$panel);

        presenter.$view.disableSelection();
        presenter.$removeConfirmationBox = presenter.$view.find('.confirmation-remove-note');
        presenter.$removeConfirmationBox.attr('id', 'confirmationBox-' + model['ID']);

        presenter.$pagePanel = presenter.$view.parent().parent('.ic_page_panel');
        presenter.$pagePanel.find('.ic_page').append(presenter.$removeConfirmationBox);
        presenter.$pagePanel.find('.ic_page').append(presenter.$removeConfirmationBoxClock);
        presenter.$pagePanel.find('.ic_page').append(presenter.$removeConfirmationBoxStopwatch);
        presenter.changeCursor('default');


        presenter.$removeConfirmationBoxClock = presenter.$view.find('.confirmation-remove-clock');
        presenter.$removeConfirmationBoxStopwatch = presenter.$view.find('.confirmation-remove-stopwatch');
        presenter.$removeConfirmationBoxClock.attr('id', 'confirmationBox-' + model['ID']);
        presenter.$removeConfirmationBoxStopwatch.attr('id', 'confirmationBox-' + model['ID']);

        presenter.$bottomPanels = $('.bottom-panel-color, .bottom-panel-thickness, .bottom-panel-floating-image');

        presenter.config = validateModel(model);

        presenter.$panel.addClass(presenter.model['expansionDirection']);
        presenter.stateStack = new StateStack(presenter);
    };

    presenter.SHOW_PANEL = {
        '---': 'NONE',
        'Color panel': 'COLOR',
        'Thickness panel': 'THICKNESS',
        DEFAULT: '---'
    };

    function validateModel(model) {
        var validated,
            widthWhenOpened,
            widthWhenClosed;
        var hasCustomButton = model["hasCustomButton"] == 'True';
        var enableUndoRedo = ModelValidationUtils.validateBoolean(model["enableUndoRedo"]);
        var disableModuleZoom = ModelValidationUtils.validateBoolean(model["disableModuleZoom"]);

        if (!hasCustomButton) {
            presenter.$panel.children('.button.custom-script').hide();
        }

        if (model['widthWhenOpened']) {
            validated = ModelValidationUtils.validatePositiveInteger(model['widthWhenOpened']);
        } else {
            var baseWidth = 538;
            if (enableUndoRedo) baseWidth = 610;
            var width = baseWidth + hasCustomButton * 36;
            validated = getCorrectObject(width);
        }

        if (!validated.isValid) {
            return getErrorObject('E01');
        }

        widthWhenOpened = validated.value;

        if (model['Width']) {
            validated = ModelValidationUtils.validatePositiveInteger(model['Width']);
        } else {
            validated = getCorrectObject(30);
        }

        if (!validated.isValid) {
            return getErrorObject('E01');
        }

        widthWhenClosed = validated.value;

        var defaultZoom = 2;
        if (model['defaultZoom']) {
            var validated = ModelValidationUtils.validatePositiveInteger(model['defaultZoom']);
            if (validated.isValid) defaultZoom = validated.value;
        }

        return {
            'addonID': model.ID,
            'isValid': true,

            'widthWhenClosed': widthWhenClosed,
            'widthWhenOpened': widthWhenOpened,
            'panelPosition': model['Fixed Position'] == 'True' ? 'absolute' : 'fixed',

            'showForPen': ModelValidationUtils.validateOption(presenter.SHOW_PANEL, model.forPen),
            'showForMarker': ModelValidationUtils.validateOption(presenter.SHOW_PANEL, model.forMarker),
            'closedPanelDrawing': ModelValidationUtils.validateBoolean(model["Closed panel drawing"]),

            'hasCustomButton': hasCustomButton,
            'onCustomButtonSelected': model['hasCustomButton'] ? model['onCustomButtonSelected'] : null,
            'onCustomButtonDeselected': model['hasCustomButton'] ? model['onCustomButtonDeselected'] : null,
            'enableUndoRedo': enableUndoRedo,
            'disableModuleZoom': disableModuleZoom,
            'defaultZoom': defaultZoom,
            'expansionDirection': model['expansionDirection'],
            'popupsDirection': presenter.isVerticalExpansion(model['expansionDirection']) ? model['verticalPopupDirection'] : model['horizontalPopupDirection']
        };
    }

    presenter.isVerticalExpansion = function (expansionDirection) {
        return expansionDirection === 'up' || expansionDirection === 'down';
    }

    presenter.setImagePosition = function IWB_Toolbar_setImagePosition() {
        var topPosition = parseInt(/*$(window).scrollTop() + */(getCurrentImage().height() / 2)+ presenter.$panel.offset().top, 10);
        var leftPosition = parseInt((getCurrentImage().width() / 2) + presenter.$panel.position().left, 10);

        presenter.floatingImageLayer.draw();
        getCurrentImage().setAbsolutePosition(getPoint(leftPosition, topPosition));
        getCurrentMoveIcon().setAbsolutePosition(getPoint(leftPosition - 10, topPosition - 20));
        getCurrentRotateIcon().setAbsolutePosition(getPoint(leftPosition - 10, topPosition - 20));
        presenter.floatingImageLayer.draw();
    };

    presenter.preventClickActionTextAudio = function IWB_Toolbar_preventClickActionTextAudio(event) {
        if (!presenter.isZoomActive) return;

        event.stopPropagation();
        event.preventDefault();
    };

    presenter.disableTextAudioEventHandlers = function () {
        presenter.textAudioEvents = [];

        // Removes (temporally) event handlers from both words and custom controls.
        presenter.modules.find('.wrapper-addon-textaudio .textaudio-text span, .wrapper-addon-textaudio .textaudio-player div').each(function (_, element) {
            // This jQuery API is no longer available in version 1.8+ versions!
            var events = jQuery(element).data('events'),
                handlers = [];

            if (!events || !events['click']) {
                return true; // jQuery.each() continue statement
            }

            $.each(events['click'], function (_, event) {
                handlers.push(event.handler);
            });

            presenter.textAudioEvents.push({
                element: element,
                handlers: handlers
            });

            $(element).unbind('click');
            $(element).on('click', preventClickActionTextAudio);
        });
    };

    presenter.restoreTextAudioEventHandlers = function () {
        $.each(presenter.textAudioEvents, function (_, textAudioEvent) {
            var $element = $(textAudioEvent.element);

            $element.unbind('click');

            $.each(textAudioEvent.handlers, function (_, handler) {
                $element.on('click', handler);
            });
        });

        presenter.textAudioEvents = [];
    };

    presenter.penLineColor = presenter.data.penColor;
    presenter.penLineWidth = 1;

    presenter.markerLineColor = presenter.data.markerColor;
    presenter.markerLineWidth = presenter.data.markerThickness;

    presenter.penClickHandler = function IWB_Toolbar_penClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.$pagePanel.find('.iwb_tmp_canvas').hide();
        presenter.$defaultColorButton = presenter.$panel.find('.color-blue');

        presenter.changeColor(presenter.penLineColor);
        presenter.changeThickness(presenter.penLineWidth);
        if(presenter.penColorBackground){
            presenter.$panel.find('.button.color').css('background-image', presenter.penColorBackground);
        }
        if(presenter.penThicknessBackground){
            presenter.$panel.find('.button.thickness').css('background-image', presenter.penThicknessBackground);
        }

        presenter.toogleMasks();

        presenter.ctx.globalCompositeOperation = 'source-over';
        presenter.drawMode = presenter.DRAW_MODE.PEN;

        presenter.drawingLogic();

        presenter.toggleBottomPanels();
    };

    presenter.markerClickHandler = function IWB_Toolbar_markerClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.$pagePanel.find('.iwb_tmp_canvas').show();
        presenter.$defaultColorButton = presenter.$panel.find('.color-yellow');
        presenter.changeColor(presenter.markerLineColor);
        presenter.changeThickness(presenter.markerLineWidth);
        if(presenter.markerColorBackground){
            presenter.$panel.find('.button.color').css('background-image', presenter.markerColorBackground);
        }
        if(presenter.markerThicknessBackground){
            presenter.$panel.find('.button.thickness').css('background-image', presenter.markerThicknessBackground);
        }
        presenter.toogleMasks();

        presenter.markerCtx.globalCompositeOperation = 'source-over';
        presenter.drawMode = presenter.DRAW_MODE.MARKER;

        presenter.markerDrawingLogic();

        presenter.toggleBottomPanels();
        presenter.markerClicked = true;
    };

    presenter.markerCloseHandler = function IWB_Toolbar_markerCloseHandler() {
        presenter.markerLineColor = presenter.currentLineColor;
        presenter.markerLineWidth = presenter.currentLineWidth;
        presenter.markerColorBackground = presenter.$panel.find('.button.color').css('background-image');
        presenter.markerThicknessBackground = presenter.$panel.find('.button.thickness').css('background-image');
    };

    presenter.getTheWidestAndHighest = function IWB_Toolbar_getTheWidestAndHighest(elem) {
        var width = $(elem).outerWidth(),
            height = $(elem).outerHeight();

        elem.find("*").each(function () {
            if($(this).outerWidth() > width){
                width = $(this).outerWidth();
            }

            if($(this).outerHeight() > height){
                height = $(this).outerHeight();
            }
        });

        return {
            height: height,
            width: width
        };
    };

    presenter.preventClickAction_zoomClickHandler = function IWB_Toolbar_preventClickAction_zoomClickHandler(event) {
        event.stopPropagation();
        event.preventDefault();
    };

    presenter.zoomClickHandler = function IWB_Toolbar_zoomClickHandler(button){
        var $page = presenter.$pagePanel.find('.ic_page');
        if ($page.hasClass("zoom-cursor-zoom-in") || $page.hasClass("zoom-zoomed-in")) {
            return;
        }

        var lastEvent = null;

        presenter.panelView(button);
        presenter.$pagePanel.find('.iwb_tmp_canvas').hide();

        presenter.isZoomActive = !presenter.isZoomActive;
        presenter.$bottomPanels.hide();

        if (!presenter.isZoomActive) {
            presenter.changeCursor('default');
        } else {
            presenter.changeCursor('zoom-in');
        }
        presenter.modules = presenter.$pagePanel.find('.ic_page > *:not(.iwb-toolbar-panel,.iwb-toolbar-note,.iwb-toolbar-clock,.iwb-toolbar-stopwatch,.confirmation-remove-note,.iwb-toolbar-mask)');

        if(presenter.isZoomActive){
            var pageElement = $('.ic_page');
            var defaultCoverElement = $('<div class="iwb-zoom-cover iwb-default-zoom-cover"></div>'),
               defMaxDimensions = presenter.getTheWidestAndHighest(pageElement);
               defaultCoverElement.css({
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: defMaxDimensions.width,
                  height: defMaxDimensions.height,
                  display: pageElement.css('display'),
                  visibility: pageElement.css('visibility')
               });
           $('.ic_page').append(defaultCoverElement);

            if (!presenter.config.disableModuleZoom) {
                presenter.modules.each(function () {
                   var coverElement = $('<div class="iwb-zoom-cover"></div>'),
                       maxDimensions = presenter.getTheWidestAndHighest($(this));
                   coverElement.css({
                      position: "absolute",
                      left: $(this).position().left,
                      top: $(this).position().top,
                      width: maxDimensions.width,
                      height: maxDimensions.height,
                      display: $(this).css('display'),
                      visibility: $(this).css('visibility')
                   });

                   $('.ic_page').append(coverElement);
                });
            }

            var iwbCoverElements = $(".iwb-zoom-cover");

            iwbCoverElements.on(`click ${EventsUtils.PointingEvents.TYPES.DOWN} ${EventsUtils.PointingEvents.TYPES.UP}`, function(e) {
                e.stopPropagation();
                e.preventDefault();
            });

            presenter.modules.find('a').on('click', presenter.preventClickAction_zoomClickHandler);

            iwbCoverElements.on(EventsUtils.PointingEvents.TYPES.DOWN, function(e) {
                e.stopPropagation();
                e.preventDefault();
                lastEvent = e;
                presenter.isPointerDown = true;
                presenter.mouse.x = e.clientX;
                presenter.mouse.y = e.clientY;
            });

            iwbCoverElements.on(EventsUtils.PointingEvents.TYPES.UP, function(e) {
                e.stopPropagation();
                e.preventDefault();
                presenter.isPointerDown = false;

                if ((lastEvent.type == EventsUtils.PointingEvents.TYPES.DOWN|| lastEvent.type == EventsUtils.PointingEvents.TYPES.MOVE) &&
                    !$(e.currentTarget).hasClass('iwb-toolbar-panel') &&
                    !$(e.currentTarget).hasClass('addon_IWB_Toolbar') &&
                    !$(e.currentTarget).hasClass('iwb-toolbar-note') &&
                    !$(e.currentTarget).hasClass('iwb-toolbar-clock') &&
                    !$(e.currentTarget).hasClass('iwb-toolbar-stopwatch') &&
                    (!$(e.currentTarget).hasClass('iwb-default-zoom-cover') ||
                    (Math.abs(presenter.mouse.x - e.clientX) < 20 &&
                    Math.abs(presenter.mouse.y - e.clientY) < 20))) { // click
                        presenter.zoomSelectedModule(e);
                }
                lastEvent = e;
            });

            iwbCoverElements.on(EventsUtils.PointingEvents.TYPES.MOVE, function(e) {
                if (presenter.isPointerDown) {
                    e.stopPropagation();
                    e.preventDefault();
                    var currentScrollX = $(window).scrollLeft(),
                        currentScrollY = $(window).scrollTop(),
                        differenceX = lastEvent.clientX - e.clientX,
                        differenceY = lastEvent.clientY - e.clientY;

                    $(window).scrollLeft(currentScrollX + differenceX);
                    $(window).scrollTop(currentScrollY + differenceY);
                }

                lastEvent = e;
            });
        }else{
            $(".iwb-zoom-cover").remove();
        }

        presenter.$pagePanel.disableSelection();

        if (presenter.isZoomActive) {
            presenter.disableTextAudioEventHandlers();
        } else {
            presenter.restoreTextAudioEventHandlers();
        }

        if (presenter.areZoomEventHandlersAttached) {
            // We cannot attach multiple times the same event handlers
            return;
        }

        presenter.areZoomEventHandlersAttached = true;
    };

    presenter.zoomCloseHandler = function IWB_Toolbar_zoomCloseHandler() {
        $(".iwb-zoom-cover").remove();
    };

    presenter.eraserClickHandler = function IWB_Toolbar_eraserClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();
        presenter.panelView(button);
        presenter.$pagePanel.find('.iwb_tmp_canvas').hide();

        if (presenter.ctx) {
            presenter.ctx.globalCompositeOperation = 'destination-out';
        }
        if (presenter.markerCtx) {
            presenter.markerCtx.globalCompositeOperation = 'destination-out';
        }

        presenter.$penMask.css('pointer-events', 'auto');
        presenter.$penMask.css('touch-action', 'none');
        presenter.$markerMask.css('pointer-events', 'auto');
        presenter.$markerMask.css('touch-action', 'none');

        presenter.changeColor('rgba(0, 0, 0, 1)');
        presenter.changeThickness(presenter.data.eraserThickness);
        presenter.drawMode = presenter.DRAW_MODE.ERASER;
        presenter.drawingLogic();
        presenter.toogleMasks();
    };

    presenter.eraserUnClickHandler = function IWB_Toolbar_eraserUnClickHandler(button) {
        presenter.panelView(button);

        presenter.$penMask.css('pointer-events', 'none');
        presenter.$penMask.css('touch-action', 'auto');
        presenter.$markerMask.css('pointer-events', 'none');
        presenter.$markerMask.css('touch-action', 'auto');
    };

    presenter.hideAreaClickHandler = function IWB_Toolbar_hideAreaClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);
        presenter.$pagePanel.find('.iwb_tmp_canvas').hide();
        presenter.toogleMasks();
        presenter.drawAreaLogic(true);

        presenter.drawMode = presenter.DRAW_MODE.HIDE_AREA;
        presenter.$defaultColorButton = presenter.$panel.find('.color-black');
        presenter.changeColor('#000');
    };

    presenter.standAreaClickHandler = function IWB_Toolbar_standAreaClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);
        presenter.$pagePanel.find('.iwb_tmp_canvas').hide();
        presenter.toogleMasks();
        presenter.drawAreaLogic(false);

        presenter.drawMode = presenter.DRAW_MODE.STAND_AREA;
        presenter.$defaultColorButton = presenter.$panel.find('.color-black');
        presenter.changeColor('#000');
    };

    presenter.resetClickHandler = function IWB_Toolbar_resetClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);
        presenter.selectingCtx.clearRect(0, 0, presenter.$selectingMask.width(), presenter.$selectingMask.height());
        presenter.ctx.clearRect(0, 0, presenter.$penMask.width(), presenter.$penMask.height());
        presenter.markerCtx.clearRect(0, 0, presenter.$markerMask.width(), presenter.$markerMask.height());

        presenter.areas = [];
        presenter.drawMode = presenter.DRAW_MODE.NONE;

        $(".iwb-zoom-cover").remove();

        presenter._reset(true, false, false, false, false, false);

        if (presenter.isCustomButtonActive()) {
            var customScriptButton = presenter.$panel.find('.' + CUSTOM_BUTTON_NAME)[0];
            presenter.customScriptClickHandler(customScriptButton);
        }

        presenter.penDataURL = null;
        presenter.markerDataUrl = null;

        presenter.pushStateToStack();
    };

    presenter.resetOneClickHandler = function IWB_Toolbar_resetOneClickHandler(button) {
        presenter.restoreLastState();
    };

    presenter.redoOneClickHandler = function IWB_Toolbar_redoOneClickHandler(button) {
        presenter.redoStateFromArray();
    };

    presenter.noteClickHandler = function IWB_Toolbar_noteClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);

        var note = presenter.createNote();
        presenter.noteObjects.push(note);

        var $noteView = note.getView();
        presenter.$pagePanel.find('.ic_page').append($noteView);

        presenter.$pagePanel.find('.iwb-toolbar-note').click(function(e) {
            e.stopPropagation();
        });
        presenter.$pagePanel.find('.note').on(EventsUtils.PointingEvents.TYPES.DOWN, function() {
            presenter.$pagePanel.find('.note').addClass('clicked');
        });
        presenter.$pagePanel.find('.note').on(EventsUtils.PointingEvents.TYPES.UP, function() {
            presenter.$pagePanel.find('.note').removeClass('clicked');
        });

        presenter.pushStateToStack();
    };

    presenter.customScriptCreateEventData = function() {
        return {
            source : presenter.config.addonID,
            value : presenter.isCustomButtonActive() ? '1' : '0',
        };
    };

    presenter.customScriptSendEventData = function () {
        var eventData = presenter.customScriptCreateEventData();
        if (presenter.playerController !== null) {
            presenter.playerController.getEventBus().sendEvent('ValueChanged', eventData);
        }
    };

    presenter.customScriptClickHandler = function IWB_Toolbar_customScriptClickHandler(button) {
        if (presenter.config.hasCustomButton) {
            presenter.isZoomActive = false;
            presenter.restoreTextAudioEventHandlers();

            presenter.panelView(button);
            if (!presenter.isCommandSourceToDeselectCustomButton) {
                presenter.runCustomScript();
                presenter.customScriptSendEventData();
            }
            presenter.isCommandSourceToDeselectCustomButton = false;
        }
    };

    presenter.floatingImageClickHandler = function IWB_Toolbar_floatingImageClickHandler(button) {
        if (isJQueryObject(button) && !isFloatingImageBtnVisible()) {
            return;
        }

        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);
        $.when.apply($, presenter.allImagesLoadedPromises).then(function() {
            var display = presenter.$pagePanel.find('.floating-image-mask').css('display');
            if (display === 'none') {
                presenter.$floatingImageMask.show();
                presenter.$pagePanel.find('.bottom-panel-floating-image').show();
                presenter.$pagePanel.find('.bottom-panel-floating-image').attr('isHidden', '1');
            } else {
                presenter.$floatingImageMask.hide();
                presenter.$pagePanel.find('.bottom-panel-floating-image').hide();
                presenter.$pagePanel.find('.floating-image').removeClass('clicked');
                presenter.$pagePanel.find('.bottom-panel-floating-image').attr('isHidden', '0');
            }
            presenter.setImagePosition();
        });
    };

    function isJQueryObject(element) {
        return !!element[0];
    }

    function isFloatingImageBtnVisible() {
        return $('.floating-image').css('display') !== 'none';
    }

    presenter.clockClickHandler = function IWB_Toolbar_clockClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);
        presenter.$pagePanel.find('.clock').on(EventsUtils.PointingEvents.TYPES.DOWN, function() {
            presenter.$pagePanel.find('.clock').addClass('clicked');
        });
        presenter.$pagePanel.find('.clock').on(EventsUtils.PointingEvents.TYPES.UP, function() {
            presenter.$pagePanel.find('.clock').removeClass('clicked');
        });
        presenter.createClock();
        presenter.pushStateToStack();
    };

    presenter.stopwatchClickHandler = function IWB_Toolbar_stopwatchClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);
        presenter.$pagePanel.find('.stopwatch').on(EventsUtils.PointingEvents.TYPES.DOWN, function() {
            presenter.$pagePanel.find('.stopwatch').addClass('clicked');
        });
        presenter.$pagePanel.find('.stopwatch').on(EventsUtils.PointingEvents.TYPES.UP, function() {
            presenter.$pagePanel.find('.stopwatch').removeClass('clicked');
        });
        presenter.createStopwatch();
        presenter.pushStateToStack();
    };

    presenter.closeClickHandler = function IWB_Toolbar_closeClickHandler(button) {
        if(presenter.shouldSaveColor == 'pen' || presenter.shouldSaveColor == 'stand-area' || presenter.shouldSaveColor == 'hide-area'){
            presenter.closePenColor = presenter.currentLineColor;
            presenter.closePenThickness = presenter.currentLineWidth;

            presenter.isCloseColor = true;
        }else if(presenter.shouldSaveColor == 'marker'){
            presenter.closePenColor = presenter.currentLineColor;
            presenter.closePenThickness = presenter.currentMarkerThickness;

            presenter.isCloseColor = true;
        }
        else{
            presenter.isCloseColor = false;
        }
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);
        presenter.$panel.find('.clicked').removeClass('clicked');
        presenter.closePanel(true);
        presenter.isPanelOpened = false;
        if(presenter.activeButton != 'open'){
            presenter.activeFunction = presenter.activeButton;
        }
    };

    presenter.openClickHandler = function IWB_Toolbar_openClickHandler(button){
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);
        if (!presenter.isPanelOpened) {
            presenter.openPanel(true);
        }

        if (presenter.customButtonActive) {
            var button = presenter.$pagePanel.find('.' + CUSTOM_BUTTON_NAME);
            button.addClass('clicked');
        }

        if(presenter.activeFunction){
            if(['clock', 'stopwatch', 'note', 'reset', 'reset-one', 'redo-one'].indexOf(presenter.activeFunction) == -1){
                if(!presenter.recklick){
                    presenter.functionButton = presenter.$pagePanel.find('.'+presenter.activeFunction);
                    presenter.buttonsLogic[presenter.activeFunction].onOpen(presenter.functionButton);
                }
                presenter.isRecklicked = false;
            }
        }

        presenter.isPanelOpened = true;

        if(presenter.isSavedState){
            if(presenter.isCloseColor){
                presenter.changeColor(presenter.closePenColor, presenter.buttonColor);
                presenter.changeThickness(presenter.closePenThickness, presenter.buttonThickness);
            }
            presenter.isSavedState = false;
        }else{
            if(presenter.isCloseColor){
                presenter.changeColor(presenter.closePenColor, presenter.buttonColor);
                presenter.changeThickness(presenter.closePenThickness, presenter.buttonThickness);
            }else{
                presenter.changeColor('#000', presenter.$bottomPanels.find('.color-black'));
                presenter.changeThickness(1, presenter.$bottomPanels.find('.thickness-1'));
            }
        }
    };

    presenter.panelView = function IWB_Toolbar_panelView (button) {
        var shouldClosePanels = shouldClosePanelsOnReset(button);

        presenter._reset(shouldClosePanels, false, shouldHideDrawingMasks(button), shouldHideSelectingMasks(button), shouldHideFloatingImage(button), false);
        if (!$(button).hasClass('open') && !$(button).hasClass('close')) {
            if ($(button).hasClass('clicked')) {
                $(button).removeClass('clicked');
            } else {
                presenter.$panel.find('.clicked').not('.custom-script').removeClass('clicked');
                $(button).addClass('clicked');
            }
        }
        if (presenter.isSupportCSSPointerEvents()) {
            if (!$(button).hasClass('pen') && !$(button).hasClass('marker') && !$(button).hasClass('eraser')){
                if(!presenter.config.closedPanelDrawing) {
                    presenter.$penMask.css('pointer-events', 'none');
                    presenter.$markerMask.css('pointer-events', 'none');
                    presenter.$penMask.css('touch-action', 'auto');
                    presenter.$markerMask.css('touch-action', 'auto');
                }
            } else {
                presenter.$penMask.css('pointer-events', 'auto');
                presenter.$markerMask.css('pointer-events', 'auto');
                presenter.$penMask.css('touch-action', 'none');
                presenter.$markerMask.css('touch-action', 'none');
            }
        }
        changeCurrentFloatingImage(presenter.currentFloatingImageIndex);
    };

    presenter.colorClickHandler = function IWB_Toolbar_colorClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        if (presenter.areDrawingButtonsActive()) {
            presenter.$panel.find('.button.clicked-lighter').removeClass('clicked-lighter');
            $(button).toggleClass('clicked-lighter');
        }
    };

    presenter.thicknessClickHandler = function IWB_Toolbar_thicknessClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        if (presenter.areDrawingButtonsActive()) {
            presenter.$panel.find('.button.clicked-lighter').removeClass('clicked-lighter');
            $(button).toggleClass('clicked-lighter');
        }
    };

    presenter.defaultClickHandler = function IWB_Toolbar_defaultClickHandler(button) {
        presenter.isZoomActive = false;
        presenter.restoreTextAudioEventHandlers();

        presenter.panelView(button);
    };

    presenter.penUnclickHandler = function IWB_Toolbar_penUnclickHandler (button) {
        presenter._reset(true, false, 1, true, true, false);
        if ($(button).hasClass('clicked')) {
            $(button).removeClass('clicked');
        } else {
            presenter.$panel.find('.clicked').removeClass('clicked');
            $(button).addClass('clicked');
        }

        presenter.$penMask.css('pointer-events', 'none');
        presenter.$markerMask.css('pointer-events', 'none');
        presenter.$penMask.css('touch-action', 'auto');
        presenter.$markerMask.css('touch-action', 'auto');

        presenter.penLineColor = presenter.currentLineColor;
        presenter.penLineWidth = presenter.currentLineWidth;
        presenter.colorBackground = presenter.$panel.find('.button.color').css('background-image');
        presenter.penThicknessBackground = presenter.$panel.find('.button.thickness').css('background-image');

        presenter.penClicked = false;
    };

    presenter.markerUnclickHandler = function IWB_Toolbar_markerUnclickHandler(button) {
        presenter._reset(true, false, 1, true, true, false);
        if ($(button).hasClass('clicked')) {
            $(button).removeClass('clicked');
        } else {
            presenter.$panel.find('.clicked').removeClass('clicked');
            $(button).addClass('clicked');
        }

        presenter.$penMask.css('pointer-events', 'none');
        presenter.$markerMask.css('pointer-events', 'none');
        presenter.$penMask.css('touch-action', 'auto');
        presenter.$markerMask.css('touch-action', 'auto');

        presenter.markerLineColor = presenter.currentLineColor;
        presenter.markerLineWidth = presenter.currentLineWidth;
        presenter.markerColorBackground = presenter.$panel.find('.button.color').css('background-image');
        presenter.markerThicknessBackground = presenter.$panel.find('.button.thickness').css('background-image');
        presenter.markerClicked = false;
    };

    presenter.penCloseHandler = function IWB_Toolbar_penCloseHandler() {
        presenter.penLineColor = presenter.currentLineColor;
        presenter.penLineWidth = presenter.currentLineWidth;
        presenter.penColorBackground = presenter.$panel.find('.button.color').css('background-image');
        presenter.penThicknessBackground = presenter.$panel.find('.button.thickness').css('background-image');
    };

    presenter.buttonsLogic = {
        'pen' : {
            'onOpen': presenter.penClickHandler,
            'onClose': presenter.penCloseHandler,
            'onReclicked': presenter.penUnclickHandler
        },
        'marker' : {
            'onOpen': presenter.markerClickHandler,
            'onClose': presenter.markerCloseHandler,
            'onReclicked': presenter.markerUnclickHandler
        },
        'default' : {
            'onOpen': presenter.defaultClickHandler,
            'onReclicked': presenter.defaultClickHandler
        },
        'color' : {
            'onOpen': presenter.colorClickHandler,
            'onReclicked': presenter.colorClickHandler
        },
        'thickness' : {
            'onOpen': presenter.thicknessClickHandler,
            'onReclicked': presenter.thicknessClickHandler
        },
        'zoom' : {
            'onOpen': presenter.zoomClickHandler,
            'onReclicked': presenter.zoomClickHandler,
            'onClose': presenter.zoomCloseHandler
        },
        'eraser' : {
            'onOpen': presenter.eraserClickHandler,
            'onReclicked': presenter.eraserUnClickHandler
        },
        'hide-area' : {
            'onOpen': presenter.hideAreaClickHandler,
            'onReclicked': presenter.hideAreaClickHandler
        },
        'stand-area' : {
            'onOpen': presenter.standAreaClickHandler,
            'onClose': '',
            'onReclicked': presenter.standAreaClickHandler
        },
        'reset' : {
            'onOpen': presenter.resetClickHandler,
            'onReclicked': presenter.resetClickHandler
        },
        'reset-one' : {
            'onOpen': presenter.resetOneClickHandler,
            'onClose': '',
            'onReclicked': presenter.resetOneClickHandler
        },
        'redo-one' : {
            'onOpen': presenter.redoOneClickHandler,
            'onReclicked': presenter.redoOneClickHandler
        },
        'note' : {
            'onOpen': presenter.noteClickHandler,
            'onReclicked': presenter.noteClickHandler
        },
        'custom-script' : {
            'onOpen': presenter.customScriptClickHandler,
            'onReclicked': presenter.customScriptClickHandler
        },
        'floating-image' : {
            'onOpen': presenter.floatingImageClickHandler,
            'onReclicked': presenter.floatingImageClickHandler
        },
        'clock' : {
            'onOpen': presenter.clockClickHandler,
            'onReclicked': presenter.clockClickHandler
        },
        'stopwatch' : {
            'onOpen': presenter.stopwatchClickHandler,
            'onReclicked': presenter.stopwatchClickHandler
        },
        'close' : {
            'onOpen': presenter.closeClickHandler
        },
        'open' : {
            'onOpen': presenter.openClickHandler
        }
    };

    function isReclickable(button) {
        var $button = $(button);
        return !$button.hasClass('open')
        && !$button.hasClass('close')
        && !$button.hasClass('reset')
        && !$button.hasClass('reset-one')
        && !$button.hasClass('redo-one');
    }

    function clickHandlers (button) {
        presenter._iwb_buttons.push($(button));
        var buttonName = $(button).data("name"),
            sameButton = presenter.$pagePanel.find('.clicked').data("name") == $(button).data("name");

        if (buttonName == CUSTOM_BUTTON_NAME) {
            if (!presenter.customButtonActive) {
                presenter.customButtonActive = true;
                presenter.buttonsLogic[$(button).attr("data-name")].onOpen(button);
            } else {
                presenter.customButtonActive = false;
                presenter.buttonsLogic[$(button).attr("data-name")].onReclicked(button);
            }
            return;
        }

        if(presenter.activeButton != '' && presenter.buttonsLogic[presenter.activeButton].onClose){
            presenter.buttonsLogic[presenter.activeButton].onClose(button);
        }

        if(presenter.activeButton == 'open' && presenter.buttonClicked && !presenter.recklick && sameButton){
            presenter.activeButton = buttonName;
        }

        if(buttonName == presenter.activeButton){
            if(!presenter.isRecklicked){
                if(presenter.buttonsLogic[presenter.activeButton].onReclicked){
                    presenter.buttonsLogic[presenter.activeButton].onReclicked(button);
                }
                presenter.isRecklicked = true;
                if(isReclickable(button)) presenter.recklick = true;
            }else{
                presenter.buttonsLogic[$(button).attr("data-name")].onOpen(button);
                presenter.isRecklicked = false;
                if(isReclickable(button)) presenter.recklick = false;
            }
        }else{
            presenter.buttonsLogic[$(button).attr("data-name")].onOpen(button);
            presenter.isRecklicked = false;
            if(isReclickable(button)) presenter.recklick = false;
        }

        if(!$(button).hasClass('color') && !$(button).hasClass('thickness')){
            presenter.activeButton = $(button).attr("data-name");
        }
    }

    presenter.deselectCustomButton = function () {
        if (presenter.config.hasCustomButton && presenter.customButtonActive) {
            if (isPanelOpened()) {
                presenter.isCommandSourceToDeselectCustomButton = true;
                var button = presenter.$pagePanel.find('.button.custom-script.clicked')[0];
                clickHandlers(button);
            } else {
                presenter.customButtonActive = false;
            }
        }
    }

    presenter.addEventHandlers = function IWB_Toolbar_addEventHandlers() {
        presenter.$pagePanel.find('.iwb-toolbar-mask').click(function(e) {
            e.stopPropagation();
        });

        presenter.$pagePanel.find('.iwb-toolbar-note').click(function(e) {
            e.stopPropagation();
        });

        presenter.$panel.click(function(e) {
            e.stopPropagation();
        });

        presenter.$pagePanel.find('.button').on(getTouchStartOrMouseDownEventName(), function(e) {
            if($(this).hasClass('yes-button') || $(this).hasClass('no-button')){
                return;
            }

            e.stopPropagation();
            e.preventDefault();
            if(presenter.isSavedState){
                presenter.buttonClicked = true;
            }
            clickHandlers(this);
            if (isDependingOnDrawing(this) && presenter.areDrawingButtonsActive() || isFloatingImageButton(this)) {
                openBottomPanel(this);
            }
            if ($(this).hasClass('reset') || $(this).hasClass('reset-one') || $(this).hasClass('redo-one')) {
                $(this).removeClass('clicked');
            }

            if(!$(this).hasClass('open') && !$(this).hasClass('note') && !$(this).hasClass('stopwatch') && !$(this).hasClass('clock') && !$(this).hasClass('close')){
                presenter.buttonClicked = true;
            }

            if($(this).hasClass('reset') || $(this).hasClass('reset-one') || $(this).hasClass('redo-one') || $(this).hasClass('default') || $(this).hasClass('note') || $(this).hasClass('stopwatch') || $(this).hasClass('clock')){
                presenter.buttonClicked = false;
            }

            var btnName = $(this).data("name");

            if(btnName != 'open' && btnName != 'close' && btnName != 'color' && btnName != 'thickness'){
                presenter.shouldSaveColor = btnName;
            }
        });

        presenter.$pagePanel.find('.button-drawing-details').on(getTouchStartOrMouseDownEventName(), function(e) {
            e.stopPropagation();
            e.preventDefault();
            changeBottomButtonState(this);

            changeDrawingType(this);
        });

        presenter.$pagePanel.find('.button-floating-image').on(getTouchStartOrMouseDownEventName(), function(e) {
            e.stopPropagation();
            e.preventDefault();
            changeBottomButtonState(this);

            changeCurrentFloatingImage(parseInt($(this).attr('index'), 10));
            presenter.setImagePosition();
        });
    };

    function applyOnDblClickHandler() {
        if (presenter.floatingImageMode == presenter.FLOATING_IMAGE_MODE.MOVE) {
            presenter.floatingImageMode = presenter.FLOATING_IMAGE_MODE.ROTATE;
            getCurrentMoveIcon().visible(false);
            getCurrentRotateIcon().visible(true);
            getCurrentGroup().draggable(false);
            presenter.floatingImageLayer.draw();
        } else {
            presenter.floatingImageMode = presenter.FLOATING_IMAGE_MODE.MOVE;
            getCurrentMoveIcon().visible(true);
            getCurrentRotateIcon().visible(false);
            getCurrentGroup().draggable(true);
            presenter.floatingImageLayer.draw();
        }
    }

    presenter.isLeft = function(center, startPos, currentPos) {
        return ((startPos.x - center.x)*(currentPos.y - center.y) - (startPos.y - center.y)*(currentPos.x - center.x)) >= 0;
    };

    function Vector(imageCenterPosition, mousePosition) {
        this.x = imageCenterPosition.x - mousePosition.x;
        this.y = imageCenterPosition.y - mousePosition.y;
        this.length = Math.sqrt(this.x * this.x + this.y * this.y);
    }

    presenter._calculateVectorsAngle = function (v1, v2) {
        var angleArg = (v1.x * v2.x + v1.y * v2.y) / (v1.length * v2.length);
    
        if (v1.length === 0 || v2.length === 0 || v1.length === v2.length || -1 > angleArg || angleArg >= 1) {
            /*
            Comments to loop conditions:
            - can not be divided by zero  [v1.length === 0 || v2.length === 0]
            - arccos(1) = 0  [v1.length === v2.length]
            - range of value: -1 <= cos(x) < 1  [-1 > angleArg || angleArg >= 1]
            */
            return {isCorrect: false};
        }
        
        return {isCorrect: true, angleValue: Math.acos(angleArg)};
    };

    function changeCurrentFloatingImage(index) {
        $.when.apply($, presenter.allImagesLoadedPromises).then(function() {
            presenter.$panel.find('.button-floating-image-' + (index + 1)).addClass('clicked-lighter');
            getCurrentGroup().visible(false);
            presenter.currentFloatingImageIndex = index;
            getCurrentGroup().visible(true);
            presenter.floatingImageLayer.draw();

            var isPointerDown = false,
                startingVector = null;

            function rotateActionStartHandler() {
                if (presenter.floatingImageMode == presenter.FLOATING_IMAGE_MODE.ROTATE) {
                    isPointerDown = true;
                    var imageCenter = {
                        x: (getCurrentImage().getAbsolutePosition().x),
                        y: (getCurrentImage().getAbsolutePosition().y)
                    };

                    startingVector = new Vector(imageCenter, presenter.floatingImageStage.getPointerPosition());
                }
            }

            presenter.$floatingImageMask.off(`${EventsUtils.PointingEvents.TYPES.DOWN} touchstart ${EventsUtils.PointingEvents.TYPES.UP} touchend touchmove ${EventsUtils.PointingEvents.TYPES.MOVE}`);
            presenter.$floatingImageMask.on(EventsUtils.PointingEvents.TYPES.DOWN, rotateActionStartHandler);
            presenter.$floatingImageMask.on('touchstart', rotateActionStartHandler);

            function rotateActionEndHandler() {
                if (presenter.floatingImageMode == presenter.FLOATING_IMAGE_MODE.ROTATE) {
                    isPointerDown = false;
                }
            }

            presenter.$floatingImageMask.on(EventsUtils.PointingEvents.TYPES.UP, rotateActionEndHandler);
            presenter.$floatingImageMask.on('touchend', rotateActionEndHandler);

            var previousPosition = null;

            function rotateActionMoveHandler() {
                var currentPosition = presenter.floatingImageStage.getPointerPosition();

                if (isPointerDown && presenter.floatingImageMode == presenter.FLOATING_IMAGE_MODE.ROTATE && previousPosition) {
                    var imageCenter = {
                        x: (getCurrentImage().getAbsolutePosition().x),
                        y: (getCurrentImage().getAbsolutePosition().y)
                    };

                    var currentVector = new Vector(imageCenter, presenter.floatingImageStage.getPointerPosition());
                    var angle = presenter._calculateVectorsAngle(startingVector, currentVector);
                    var isLeft = presenter.isLeft(imageCenter, previousPosition, currentPosition);
                    
                    if (angle.isCorrect == false){
                        getCurrentImage();
                        presenter.floatingImageLayer.draw();
                    } else {
                        getCurrentImage().rotate(isLeft ? angle.angleValue : -angle.angleValue);
                        presenter.floatingImageLayer.draw();
                    }
                }

                previousPosition = currentPosition;
            }

            presenter.$floatingImageMask.on(EventsUtils.PointingEvents.TYPES.MOVE, rotateActionMoveHandler);
            presenter.$floatingImageMask.on('touchmove', rotateActionMoveHandler);
        });
    }

    presenter.addFloatingImages = function IWB_Toolbar_addFloatingImages (model) {
        var $mask = $('<div class="iwb-toolbar-mask floating-image-mask"></div>');
        presenter.$pagePanel.find('.ic_page').append($mask);
        $mask.hide();

        var stage = new Kinetic.Stage({
            container: $mask[0],
            visible: true,
            width: $mask.width(),
            height: $mask.height()
        });

        var layer = new Kinetic.Layer();

        presenter.$floatingImageMask = $mask;
        presenter.floatingImageLayer = layer;
        presenter.floatingImageStage = stage;
        presenter.allImagesLoadedPromises = [];

        for (var index = 0; index < 3; index++) {
            presenter.loadDeferredFloatingImage(index, model, layer, stage);
        }
    };

    presenter.loadDeferredFloatingImage = function(index, model, layer, stage) {
        var imageObj = new Image();
        var deferredImage = new $.Deferred();
        presenter._kinetic.imageObj.push(imageObj);
        $(imageObj).load(function() {
            var group = new Kinetic.Group({
                draggable: true,
                visible: index == presenter.currentFloatingImageIndex
            });

            var image = new Kinetic.Image({
                x: imageObj.width / 2,
                y: $(window).scrollTop() + (imageObj.height / 2)+ presenter.$panel.offset().top,
                image: imageObj,
                width: imageObj.width,
                height: imageObj.height,
                offset: { x: imageObj.width / 2, y: imageObj.height / 2 }
            });

            group.on('dblclick', function() {
                applyOnDblClickHandler();
            });

            presenter._kinetic.images.push(image);

            applyDoubleTapHandler(group, applyOnDblClickHandler);

            var imageMoveObj = new Image();
            $(imageMoveObj).load(function() {
                var moveIcon = new Kinetic.Image({
                    x: (imageObj.width / 2) - 16, // -16, czyli połowa szerokości obrazka
                    y: (imageObj.height / 2) - 16 + presenter.$panel.offset().top, // -16, czyli połowa wysokości obrazka
                    image: imageMoveObj,
                    opacity: 0.4
                });

                presenter._kinetic.moveIcon.push(moveIcon);
                var imageRotateObj = new Image();
                $(imageRotateObj).load(function() {
                    var rotateIcon = new Kinetic.Image({
                        x: (imageObj.width / 2) - 16, // -16, czyli połowa szerokości obrazka
                        y: (imageObj.height / 2) - 16 + presenter.$panel.offset().top, // -16, czyli połowa wysokości obrazka
                        image: imageRotateObj,
                        visible: false,
                        opacity: 0.4
                    });

                    group.add(image);
                    group.add(moveIcon);
                    group.add(rotateIcon);
                    layer.add(group);
                    stage.add(layer);
                    presenter.floatingImageGroups[index] = group;
                    presenter._kinetic.rotateIcon.push(rotateIcon);

                    deferredImage.resolve();
                });
                imageRotateObj.src = DOMOperationsUtils.getResourceFullPath(presenter.playerController, 'addons/resources/it_rotate.png');
                presenter._kinetic.rotateObj.push(imageRotateObj);

            });
            imageMoveObj.src = DOMOperationsUtils.getResourceFullPath(presenter.playerController, 'addons/resources/it_move.png');

            presenter._kinetic.moveObj.push(imageMoveObj);
        });


        presenter.allImagesLoadedPromises.push(deferredImage.promise());
        if (model['floatingImages'] && model['floatingImages'][index] && model['floatingImages'][index]['Image'].length > 0) {
            imageObj.src = model['floatingImages'][index]['Image'];
        } else {
            imageObj.src = DOMOperationsUtils.getResourceFullPath(presenter.playerController, 'addons/resources/' + presenter.DEFAULT_FLOATING_IMAGE[index]);
        }
    };

    presenter.getZoomHeightScale = function () {
        var initialSize = presenter.zoomConfiguration.initialWindowHeight - presenter.zoomConfiguration.initialNotScaledOffset;
        var newSize = window.iframeSize.windowInnerHeight - presenter.zoomConfiguration.initialNotScaledOffset;

        var zoomHeightScale = newSize / initialSize;

        zoomHeightScale = zoomHeightScale === 0 || isNaN(zoomHeightScale) || !isFinite(zoomHeightScale) ? 1 : zoomHeightScale;

        return zoomHeightScale
    };

    presenter.isOnScreen = function (element, windowElement) {
        var zoomHeightScale = presenter.getZoomHeightScale();
        var topWindow = $(windowElement.parent.document);
        var coords = {
            top: topWindow.scrollTop(),
            left: topWindow.scrollLeft(),
            right: topWindow.scrollLeft() + topWindow.width(),
            bottom: topWindow.scrollTop() + topWindow.height()
        };

        var bounds = element.offset();
        bounds.right = bounds.left + element.outerWidth();
        bounds.bottom = bounds.top + element.outerHeight();

        bounds.bottom /= zoomHeightScale;

        return !(coords.right < bounds.left || coords.left > bounds.right || coords.bottom < bounds.top || coords.top > bounds.bottom);
    };

    function addScrollHandler() {
        if (!presenter.playerController || presenter.playerController.isPlayerInCrossDomain()) return;
        var $defaultScrollElement = $(window.parent.document);
        var $mCourserScrollElement = $defaultScrollElement.find('#lesson-view > div > div');
        var $mAuthorMobileScrollElement = $(window);
        var $mCourserMobileScrollElement = $("#content-view");
        var scrollElements = [$defaultScrollElement, $mCourserScrollElement, $mAuthorMobileScrollElement, $mCourserMobileScrollElement];
        try {
            for (var i = 0; i < scrollElements.length; i++) {
                scrollElements[i].scroll(IWB_Toolbar_scrollHandler);
            }
        } catch(e) {}
    }

    var difference = 0,
        lastScrollTop = 0,
        panelTop = 0;
    function IWB_Toolbar_scrollHandler() {
        if (presenter.isOnScreen(presenter.$view.parent(), window)) {
            var containerHeight = presenter.$pagePanel.outerHeight(true),
                scrollTop = $(this).scrollTop(),
                baseHeightScale = presenter.playerController.getScaleInformation().scaleY,
                min = presenter.$pagePanel.offset().top / baseHeightScale,
                headerHeight = $('.ic_header').outerHeight(true) - 20,
                max = (containerHeight + headerHeight) / baseHeightScale,
                zoomHeightScale = presenter.getZoomHeightScale();
            difference = scrollTop - lastScrollTop;
            panelTop = parseInt(presenter.$panel.css('top'), 10) + difference * zoomHeightScale / baseHeightScale;
            lastScrollTop = scrollTop;

            if (panelTop && (panelTop) > min && (panelTop) < max) {
                presenter.$panel.css({
                    'top': (panelTop) + 'px'
                });
            } else if (panelTop && (panelTop) >= max) {
                presenter.$panel.css({
                    'top': (containerHeight - presenter.$panel.outerHeight(true) + min) + 'px'
                });
            } else if (panelTop && (panelTop) <= min) {
                presenter.$panel.css({
                    'top': min + 'px'
                });
            }
        }
    }

    function drawSketch() {
        var sketch = presenter.$view.parent().find('.selecting');
        var canvas = sketch.find('canvas');
        canvas.width = sketch.width;
        canvas.height = sketch.height;

        var iwb_tmp_canvas = document.createElement('canvas');
        var tmp_ctx = iwb_tmp_canvas.getContext('2d');
        iwb_tmp_canvas.id = 'iwb_tmp_canvas';
        iwb_tmp_canvas.width = canvas.width();
        iwb_tmp_canvas.height = canvas.height();

        var $tmpCanvas = $('#iwb_tmp_canvas');
        sketch.css("touch-action", "none");

        if ($.contains(document, $tmpCanvas[0])) {
            $tmpCanvas.remove();
        }

        presenter.$view.parent().find('.selecting').append(iwb_tmp_canvas);

        var mouse = getPoint(0, 0);
        var start_mouse = getPoint(0, 0);

        /* Mouse Capturing Work */
        if( /Android|X11|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            iwb_tmp_canvas.addEventListener('touchmove', function(e) {
                e.stopPropagation();
                e.preventDefault();

                mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
                mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
            }, false);

            iwb_tmp_canvas.addEventListener('touchstart', function(e) {
                iwb_tmp_canvas.addEventListener('touchmove', onPaint, false);

                e.stopPropagation();
                e.preventDefault();
                mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
                mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

                start_mouse.x = mouse.x;
                start_mouse.y = mouse.y;

                onPaint();
            }, false);

            iwb_tmp_canvas.addEventListener('touchend', function(e) {
                iwb_tmp_canvas.removeEventListener('touchmove', onPaint, false);
                e.stopPropagation();
                e.preventDefault();
                // Writing down to real canvas now
                // ctx.drawImage(iwb_tmp_canvas, 0, 0);
                // Clearing tmp canvas
                tmp_ctx.clearRect(0, 0, iwb_tmp_canvas.width, iwb_tmp_canvas.height);
            }, false);
        }else{
            iwb_tmp_canvas.addEventListener(EventsUtils.PointingEvents.TYPES.MOVE, function(e) {
                e.stopPropagation();
                e.preventDefault();
                mouse.x = typeof e.offsetX !== 'undefined' ?  e.offsetX : e.layerX;
                mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
            }, false);

            iwb_tmp_canvas.addEventListener(EventsUtils.PointingEvents.TYPES.DOWN, function(e) {
                e.stopPropagation();
                e.preventDefault();
                iwb_tmp_canvas.addEventListener(EventsUtils.PointingEvents.TYPES.MOVE, onPaint, false);

                mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
                mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

                start_mouse.x = mouse.x;
                start_mouse.y = mouse.y;
                onPaint();
            }, false);

            iwb_tmp_canvas.addEventListener(EventsUtils.PointingEvents.TYPES.UP, function(e) {
                e.stopPropagation();
                e.preventDefault();
                iwb_tmp_canvas.removeEventListener(EventsUtils.PointingEvents.TYPES.MOVE, onPaint, false);
                // Writing down to real canvas now
                // ctx.drawImage(iwb_tmp_canvas, 0, 0);
                // Clearing tmp canvas
                tmp_ctx.clearRect(0, 0, iwb_tmp_canvas.width, iwb_tmp_canvas.height);
            }, false);
        }

        /* Drawing on Paint App */
        tmp_ctx.lineWidth = 1;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = 'black';
        tmp_ctx.fillStyle = 'black';

        var onPaint = function() {
            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, iwb_tmp_canvas.width, iwb_tmp_canvas.height);

            var x = Math.min(mouse.x, start_mouse.x);
            var y = Math.min(mouse.y, start_mouse.y);
            var width = Math.abs(mouse.x - start_mouse.x);
            var height = Math.abs(mouse.y - start_mouse.y);
            tmp_ctx.strokeRect(x, y, width, height);
        };
    }

    presenter.drawAreaLogic = function IWB_Toolbar_drawAreaLogic(isHide) {
        drawSketch();

        presenter.drawAreaLogic_touchEndCallback = function (event) {
            var pos = getCursorPosition(event.originalEvent);

            presenter.stopSelection = getPoint(pos.x, pos.y);

            drawArea(isHide);
            presenter.areas.push({
                isHide: isHide,
                width: presenter.startSelection.x - presenter.stopSelection.x,
                height: presenter.startSelection.y - presenter.stopSelection.y,
                x: presenter.stopSelection.x,
                y: presenter.stopSelection.y,
                color: presenter.currentLineColor
            });
            presenter.standHideAreaClicked = false;
        };

        presenter.drawAreaLogic_mouseUpCallback = function (event) {
            event.stopPropagation();
            event.preventDefault();

            var pos = getCursorPosition(event);

            presenter.stopSelection = getPoint(pos.x, pos.y);

            drawArea(isHide);
            presenter.areas.push({
                isHide: isHide,
                width: presenter.startSelection.x - presenter.stopSelection.x,
                height: presenter.startSelection.y - presenter.stopSelection.y,
                x: presenter.stopSelection.x,
                y: presenter.stopSelection.y,
                color: presenter.currentLineColor
            });
            presenter.standHideAreaClicked = false;

            presenter.pushStateToStack();
        };

        const $iwbTmpCanvas = presenter.$view.parent().find('.selecting').find('#iwb_tmp_canvas');
        if ( /Android|X11|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $iwbTmpCanvas.on('touchstart', presenter.drawAreaLogic_touchStartCallback);
            $iwbTmpCanvas.on('touchend', presenter.drawAreaLogic_touchEndCallback);
        } else {
            $iwbTmpCanvas.on(EventsUtils.PointingEvents.TYPES.DOWN, presenter.drawAreaLogic_mouseDownCallback);
            $iwbTmpCanvas.on(EventsUtils.PointingEvents.TYPES.UP, presenter.drawAreaLogic_mouseUpCallback);
        }
    };

    presenter.drawAreaLogic_touchStartCallback = function (event) {
        event.stopPropagation();
        event.preventDefault();
        presenter.standHideAreaClicked = true;
        var pos = getCursorPosition(event.originalEvent);
        presenter.startSelection = getPoint(pos.x, pos.y);
    };

    presenter.drawAreaLogic_mouseDownCallback = function (event) {
        event.stopPropagation();
        event.preventDefault();

        presenter.standHideAreaClicked = true;
        var pos = getCursorPosition(event);
        presenter.startSelection = getPoint(pos.x, pos.y);
    };

    function drawHideArea(context, x, y, width, height, color) {
        context.beginPath();
        context.rect(x, y, width, height);
        context.fillStyle = color;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = color;
        context.stroke();
    }

    function drawStandArea(context, x, y, width, height, color) {
        context.clearRect(0, 0, presenter.$selectingMask.width(), presenter.$selectingMask.height());
        context.fillStyle = color;
        context.fillRect(0, 0, presenter.$selectingMask.width(), presenter.$selectingMask.height());
        context.globalCompositeOperation = 'destination-out';
        context.fillStyle = 'white';
        context.beginPath();
        context.rect(x, y, width, height);
        context.fill();
    }

    function drawArea(isHide) {
        var context = presenter.selectingCtx,
            width = presenter.startSelection.x - presenter.stopSelection.x,
            height = presenter.startSelection.y - presenter.stopSelection.y;

        context.globalCompositeOperation = 'source-over';

        if (isHide) {
            drawHideArea(context, presenter.stopSelection.x, presenter.stopSelection.y, width, height, presenter.currentLineColor);
        } else {
            drawStandArea(context, presenter.stopSelection.x, presenter.stopSelection.y, width, height, presenter.currentLineColor);
        }
    }

    function drawSavedAreas() {
        $.each(presenter.areas, function() {
            presenter.selectingCtx.globalCompositeOperation = 'source-over';
            if (this.isHide) {
                drawHideArea(presenter.selectingCtx, this.x, this.y, this.width, this.height, this.color);
            } else {
                drawStandArea(presenter.selectingCtx, this.x, this.y, this.width, this.height, this.color);
            }
        });
    }

    function closeStopwatch() {
        presenter._stopwatch.stopwatch.remove();
        presenter.$panel.find('.stopwatch.clicked').removeClass('clicked');
        presenter.stopwatchAdded = false;
        clearTimeout(presenter._stopwatchTimer);
        presenter._stopwatchTimer = null;
    }

    presenter.createStopwatch = function IWB_Toolbar_createStopwatch(savedStopwatch, hours, minutes, seconds, stopClicked, startClicked) {
        if(!presenter.stopwatchAdded){
            var stopwatch = $('<div class="iwb-toolbar-stopwatch"></div>'),
                time = $('<h4 class="stopwatch-time"><time>00:00:00</time></h4>'),
                header = $('<div class="stopwatch-header"></div>'),
                buttons = $('<div class="stopwatch-buttons"></div>'),
                startButton = $('<div id="start"></div>'),
                stopButton = $('<div id="stop"></div>'),
                clearButton = $('<div id="clear"></div>'),
                closeButton = $('<div class="stopwatch-close">&times;</div>');

            closeButton.on('click', function(e) {
                e.stopPropagation();
                closeStopwatch();
                presenter.pushStateToStack();
            });

            header.append(time);
            header.append(closeButton);
            buttons.append(startButton);
            buttons.append(stopButton);
            buttons.append(clearButton);
            stopwatch.append(header);
            stopwatch.append(buttons);

            var ic_page_height = presenter.$view.parent().height(),
                panel_top = parseInt(presenter.$panel.css('top'), 10),
                window_scroll = $(window).scrollTop(),
                panel_outerHeight = presenter.$panel.outerHeight(true),
                panel_differance = ic_page_height-panel_top-window_scroll,
                top=0;

            var offsetTopelement,
                scrollTop;
            if (presenter.config.panelPosition == 'fixed') {
                offsetTopelement = presenter.$pagePanel.offset().top;
                scrollTop = $(window).scrollTop();
            } else {
                offsetTopelement = '';
                scrollTop = '';
            }

            if (panel_differance < panel_outerHeight) {
                top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + scrollTop - presenter.$pagePanel.offset().top - 120
            } else {
                top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + scrollTop - offsetTopelement
            }

            if (!presenter.stopwatchAdded) {
                stopwatch.draggable({
                    containment: 'parent',
                    opacity: 0.35,
                    create: function(event, _) {
                        $(event.target).css({
                            'top': presenter.getVerticalPosition(savedStopwatch, presenter.POPUP_TYPE.STOPWATCH),
                            ...presenter.getHorizontalPosition(savedStopwatch, presenter.POPUP_TYPE.STOPWATCH),
                            'position' : 'absolute'
                        });
                    },

                    stop: function NoteStopFunction() {
                        $.ui.ddmanager.current = null;
                        presenter.pushStateToStack();
                    }
                });

                presenter.$pagePanel.find('.ic_page').append(stopwatch);
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').click(function(e) {
                    e.stopPropagation();
                });
            }

            var h1 = document.getElementsByClassName('stopwatch-time')[0];
            var start = document.getElementById('start');
            var stop = document.getElementById('stop');
            var clear = document.getElementById('clear');
            presenter.stopButtonClicked = stopClicked;
            presenter.startButtonClicked = startClicked;

            if (seconds) {
                presenter.seconds = seconds; presenter.minutes = minutes; presenter.hours = hours;
                h1.textContent = (presenter.hours ? (presenter.hours > 9 ? presenter.hours : "0" + presenter.hours) : "00") + ":" + (presenter.minutes ? (presenter.minutes > 9 ? presenter.minutes : "0" + presenter.minutes) : "00") + ":" + (presenter.seconds > 9 ? presenter.seconds : "0" + presenter.seconds);

                if (!presenter.stopButtonClicked) {
                    timer();
                    presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#start').addClass('button-clicked');
                }
            } else {
                presenter.seconds = 0; presenter.minutes = 0; presenter.hours = 0;
            }

            function add() {
                presenter.seconds++;
                if (presenter.seconds >= 60) {
                    presenter.seconds = 0;
                    presenter.minutes++;
                    if (presenter.minutes >= 60) {
                        presenter.minutes = 0;
                        presenter.hours++;
                    }
                }

                h1.textContent = (presenter.hours ? addZero(presenter.hours) : "00") + ":" + (presenter.minutes ? addZero(presenter.minutes) : "00") + ":" + addZero(presenter.seconds);

                timer();
            }
            function timer() {
                presenter._stopwatchTimer = setTimeout(add, 1000);
            }

            function clearClickedButtons (){
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#start').removeClass('button-clicked');
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#stop').removeClass('button-clicked');
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#clear').removeClass('button-clicked');
            }

            $(start).on('click', function(){
                if (!presenter.startButtonClicked) {
                    clearClickedButtons();
                    presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#start').addClass('button-clicked');
                    timer();
                    presenter.stopButtonClicked = false;
                    presenter.startButtonClicked = true;
                }
            });

            $(stop).on('click', function() {
                clearClickedButtons();
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#stop').addClass('button-clicked');
                clearTimeout(presenter._stopwatchTimer);
                presenter.stopButtonClicked = true;
                presenter.startButtonClicked = false;
                presenter.pushStateToStack();
            });

            $(clear).on('click', function() {
                clearClickedButtons();
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#clear').addClass('button-clicked');
                h1.textContent = "00:00:00";
                presenter.seconds = 0; presenter.minutes = 0; presenter.hours = 0;
                presenter.stopButtonClicked = false;
                presenter.pushStateToStack();
            });

            presenter._stopwatch = {
                stopwatch: stopwatch,
                closeButton: closeButton,
                start: start,
                stop: stop,
                clear: clear
            };
        }

        presenter.stopwatchAdded = true;
    };

    presenter.getLeftValueVerticalPopups = function (popupType) {
        const panelLeftValue = parseInt(presenter.$panel.css('left'), 10);
        const toolbarWidth = parseInt(presenter.$panel.outerWidth(), 10);

        return panelLeftValue + toolbarWidth + GAP_VALUE + presenter.getHorizontalOffset(popupType);
    }

    presenter.getLeftValueHorizontalPopups = function (popupType) {
        const panelLeftValue = parseInt(presenter.$panel.css('left'), 10);
        const offset = presenter.getHorizontalPopupOffset(popupType);

        return panelLeftValue + offset;
    }

    presenter.getHorizontalPopupOffset = function (popupType) {
        switch (popupType) {
            case presenter.POPUP_TYPE.STOPWATCH:
                return 0;

            case presenter.POPUP_TYPE.CLOCK:
                return presenter.getStopwatchWidth() + GAP_VALUE;

            case presenter.POPUP_TYPE.NOTE:
                return presenter.getStopwatchWidth() + GAP_VALUE
                    + presenter.getClockWidth() + GAP_VALUE
                    + presenter.notesCounter * GAP_VALUE;
        }
    }

    presenter.getStopwatchWidth = function () {
        const stopwatchWidth = $('.iwb-toolbar-stopwatch').outerWidth();
        return stopwatchWidth ? stopwatchWidth : 180;
    }

    presenter.getClockWidth = function () {
        const clockWidth = $('.iwb-toolbar-clock').outerWidth();
        return clockWidth ? clockWidth : 100;
    }

    presenter.getRightValueVerticalPopups = function (popupType) {
        const panelRightValue = parseInt(presenter.$panel.css('right'), 10);
        const toolbarWidth = parseInt(presenter.$panel.outerWidth(), 10);

        return panelRightValue + toolbarWidth + GAP_VALUE + presenter.getHorizontalOffset(popupType);
    }

    presenter.getTopValue = function (popupType) {
        const panelTopValue = parseInt(presenter.$panel.css('top'), 10);
        let offset;
        if (presenter.config.popupsDirection === 'left' || presenter.config.popupsDirection === 'right') {
            offset = presenter.getVerticalOffset(popupType);
        } else if (presenter.config.popupsDirection === 'down') {
            const toolbarHeight = parseInt(presenter.$panel.outerHeight(), 10);
            const noteOffset = popupType === presenter.POPUP_TYPE.NOTE ? presenter.notesCounter * GAP_VALUE : 0;
            offset = toolbarHeight + GAP_VALUE + noteOffset;
        } else if (presenter.config.popupsDirection === 'up') {
            const noteOffset = popupType === presenter.POPUP_TYPE.NOTE ? presenter.notesCounter * GAP_VALUE : 0;
            offset = -(presenter.getPopupHeight(popupType) + GAP_VALUE + noteOffset);
        }

        return panelTopValue + offset;
    }

    presenter.getPopupHeight = function (popupType) {
        switch (popupType) {
            case presenter.POPUP_TYPE.STOPWATCH:
                return STOPWATCH_OFFSET;

            case presenter.POPUP_TYPE.CLOCK:
                return CLOCK_OFFSET - 8;

            case presenter.POPUP_TYPE.NOTE:
                return NOTE_OFFSET;
        }
    }

    presenter.getVerticalOffset = function (popupType) {
        switch (popupType) {
            case presenter.POPUP_TYPE.STOPWATCH:
                return 0;

            case presenter.POPUP_TYPE.CLOCK:
                return CLOCK_OFFSET + GAP_VALUE;

            case presenter.POPUP_TYPE.NOTE:
                return NOTE_OFFSET + GAP_VALUE + presenter.notesCounter * GAP_VALUE;
        }
    }

    presenter.getHorizontalOffset = function (popupType) {
        switch (popupType) {
            case presenter.POPUP_TYPE.CLOCK:
            case presenter.POPUP_TYPE.STOPWATCH:
                return 0;

            case presenter.POPUP_TYPE.NOTE:
                return presenter.notesCounter * GAP_VALUE;
        }
    }

    presenter.getVerticalPosition = function (savedElement, popupType) {
        if (savedElement) {
            return savedElement.top
        }

        return presenter.getTopValue(popupType)
    }

    presenter.getHorizontalPosition = function (savedElement, popupType) {
        if (savedElement) {
            return {'left' : savedElement.left}
        }
        switch (presenter.config.popupsDirection) {
            case 'down':
            case 'up':
                return {'left': presenter.getLeftValueHorizontalPopups(popupType)};

            case 'right':
                return {'left': presenter.getLeftValueVerticalPopups(popupType)};

            case 'left':
               return {'right': presenter.getRightValueVerticalPopups(popupType)};
        }
    }

    function closeClock() {
        presenter._clockwatch.clock.remove();
        presenter.$panel.find('.clock.clicked').removeClass('clicked');
        presenter.clockAdded = false;
    }

    presenter.createClock = function IWB_Toolbar_createClock(savedClock) {
        if (!presenter.clockAdded) {
            var clock = $('<div class="iwb-toolbar-clock"></div>'),
                header = $('<div class="clock-header"></div>'),
                closeButton = $('<div class="clock-close">&times;</div>'),
                clockBody = $('<div class="clock-body"></div>');

            closeButton.on('click', function(e) {
                e.stopPropagation();
                closeClock();
                presenter.pushStateToStack();
            });

            header.append(closeButton);
            clock.append(header);
            clock.append(clockBody);

            var ic_page_height = presenter.$view.parent().height(),
                panel_top = parseInt(presenter.$panel.css('top'), 10),
                window_scroll = $(window).scrollTop(),
                panel_outerHeight = presenter.$panel.outerHeight(true),
                panel_differance = ic_page_height-panel_top-window_scroll,
                top=0;

            var offsetTopelement,
                scrollTop;
            if (presenter.config.panelPosition == 'fixed') {
                offsetTopelement = presenter.$pagePanel.offset().top;
                scrollTop = $(window).scrollTop();
            } else {
                offsetTopelement = '';
                scrollTop = '';
            }

            if (panel_differance < panel_outerHeight) {
                top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + scrollTop - presenter.$pagePanel.offset().top - 120
            } else {
                top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + scrollTop - offsetTopelement
            }

            clock.draggable({
                containment: 'parent',
                opacity: 0.35,
                create: function(event, _) {
                    $(event.target).css({
                        'top': presenter.getVerticalPosition(savedClock, presenter.POPUP_TYPE.CLOCK),
                        ...presenter.getHorizontalPosition(savedClock, presenter.POPUP_TYPE.CLOCK),
                        'position' : 'absolute'
                    });
                },
                stop: function NoteStopFunction() {
                    $.ui.ddmanager.current = null;
                    presenter.pushStateToStack();
                }
            });

            presenter.$pagePanel.find('.ic_page').append(clock);
            presenter.$pagePanel.find('.iwb-toolbar-clock').click(function(e) {
                e.stopPropagation();
            });

            function getTime() {
                var date = new Date();
                return addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
            }

            presenter.$pagePanel.find('.iwb-toolbar-clock').find('.clock-body').html(getTime());

            presenter._clockwatchTimer = setInterval(function() {
                presenter.$pagePanel.find('.iwb-toolbar-clock').find('.clock-body').html(getTime());
            }, 1000);

            presenter._clockwatch = {
                clock: clock,
                closeButton: closeButton
            };
        }
        presenter.clockAdded = true;
    };

    presenter.Note = function () {
        this.$note = null;
        this.$header = null;
        this.$date = null;
        this.$closeButton = null;
        this.$noteBody = null;
        this.$textarea = null;
        this.$buttonSave = null;
        this.currentValue = '';
    };


    presenter.Note._internals = {};

    presenter.Note._internals.getCurrentDate = function () {
        var day = new Date().getDate(),
            month = new Date().getMonth() + 1,
            year = new Date().getFullYear(),
            hours = new Date().getHours(),
            minutes = new Date().getMinutes();

        var time = addZero(hours) + ':' + addZero(minutes);
        return day + '/' + month + '/' + year + ', ' + time;
    };

    presenter.Note._internals.createView = function () {
        this.$note = $('<div class="iwb-toolbar-note"></div>');
        this.$header = $('<div class="note-header"></div>');
        this.$date = $('<div class="note-date"></div>');
        this.$closeButton = $('<div class="note-close">&times;</div>');
        this.$noteBody = $('<div class="note-body"></div>');

        this.$header.append(this.$date);
        this.$header.append(this.$closeButton);
        this.$note.append(this.$header);
        this.$note.append(this.$noteBody);
    };

    presenter.Note.prototype.init = function (savedNote) {
        presenter.Note._internals.createView.call(this);

        this.connectHandlers();
        this.connectDraggable(savedNote);
    };

    presenter.Note.prototype.setDate = function (date) {
        this.$date.html(date);
    };

    presenter.Note.prototype.setBody = function (body) {
        this.$noteBody.html(body);
        this.$textarea = this.$noteBody.find('textarea');
        this.$buttonSave = this.$noteBody.find('.save');
    };

    presenter.Note.prototype.getView = function () {
        return this.$note;
    };

    presenter.Note.prototype.connectNoteEditHandler = function () {
        this.$note.on('dblclick', function () {
            this.noteEditHandler();
            this.$note.off('dblclick');
        }.bind(this));

        const foundTouchPoints = (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || foundTouchPoints) {
            window.EventsUtils.DoubleTap.on(this.$note, function () {
                this.noteEditHandler();
                window.EventsUtils.DoubleTap.off(this.$note);
            }.bind(this));
        }
    };

    presenter.Note.prototype.saveButtonHandler = function() {
        var value = this.$textarea.val();
        this.$noteBody.html(value);
        this.$textarea.remove();
        this.connectNoteEditHandler();
        presenter.pushStateToStack();
    };

    presenter.Note.prototype.noteEditHandler = function () {
        this.$textarea = $('<textarea></textarea>');
        this.$buttonSave = $('<button class="save">Save</button>');

        this.currentValue = this.$noteBody.html();

        if(MobileUtils.isEventSupported('touchstart')) {
            this.$buttonSave.on('touchstart', function() {
                this.saveButtonHandler();
            }.bind(this));
        } else {
            this.$buttonSave.on('click', function() {
                this.saveButtonHandler();
            }.bind(this));
        }

        this.$textarea.on('click', function (){
            var val = this.$textarea.val();
            this.$textarea.focus().val("").val(val);
        }.bind(this));

        this.$textarea.val(this.currentValue);

        this.$noteBody.html(this.$textarea);
        this.$noteBody.append(this.$buttonSave);
        this.$textarea.focus();
    };

    presenter.Note.prototype.closeButtonHandler = function(event) {
        var confirmation = presenter.$removeConfirmationBox;
        var window_scroll = presenter.playerController.iframeScroll() > 0 ? presenter.playerController.iframeScroll() : $(window).scrollTop();

        confirmation.css('top', window_scroll + 10 + 'px');
        confirmation.show();
        confirmation.find('.no-button').on(getTouchStartOrMouseDownEventName(),function(e) {
            e.stopPropagation();
            confirmation.hide();
        });
        confirmation.find('.yes-button').on(getTouchStartOrMouseDownEventName(), {"note": event.data.note}, function(e) {
            e.stopPropagation();
            var note = e.data.note;

            presenter.noteObjects = presenter.noteObjects.filter(function (note) {
                return note != this;
            }, note);
            note.destroy();
            confirmation.hide();
            presenter.pushStateToStack();
        });
    };

    presenter.Note.prototype.connectHandlers = function () {
        if(MobileUtils.isEventSupported('touchstart')) {
            this.$closeButton.on('touchstart', {"note": this}, function(event) {
                event.stopPropagation();
                this.closeButtonHandler(event);
            }.bind(this));
        } else {
            this.$closeButton.on('click', {"note": this}, function(event) {
                event.stopPropagation();
                this.closeButtonHandler(event);
            }.bind(this));
        }

        this.connectNoteEditHandler();
    };

    presenter.Note.prototype.connectDraggable = function (savedNote) {
        var ic_page_height = presenter.$view.parent().height(),
            panel_top = parseInt(presenter.$panel.css('top'), 10),
            window_scroll = presenter.playerController.iframeScroll() > 0 ? presenter.playerController.iframeScroll() : $(window).scrollTop(),
            panel_outerHeight = presenter.$panel.outerHeight(true),
            panel_differance = ic_page_height-panel_top-window_scroll,
            top=0;

        var offsetTopelement,
            scrollTop;
        if (presenter.config.panelPosition == 'fixed') {
            offsetTopelement = presenter.$pagePanel.offset().top;
            scrollTop = window_scroll;
        } else {
            offsetTopelement = '';
            scrollTop = '';
        }

        if (panel_differance < panel_outerHeight) {
            top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + scrollTop - presenter.$pagePanel.offset().top - 120;
        } else {
            top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + scrollTop - offsetTopelement;
        }

        this.$note.draggable({
            containment: 'parent',
            opacity: 0.35,
            create: function(event, _) {
                $(event.target).css({
                    'top': presenter.getVerticalPosition(savedNote, presenter.POPUP_TYPE.NOTE),
                    ...presenter.getHorizontalPosition(savedNote, presenter.POPUP_TYPE.NOTE),
                    'position' : 'absolute'
                });
            },

            stop: function NoteStopFunction() {
                $.ui.ddmanager.current = null;
                presenter.pushStateToStack();
            }
        });
        presenter.notesCounter += 1;
    };

    presenter.Note.prototype.destroy = function () {
        if(this.$note) {
            var $note = this.$note.draggable("destroy");
            $note.off();
            this.$note.off();
            this.$header.off();
            this.$date.off();
            this.$closeButton.off();
            this.$noteBody.off();
            if (this.$textarea !== null) {
                this.$textarea.off();
            }

            if (this.$buttonSave !== null) {
                this.$buttonSave.off();
            }

            window.EventsUtils.DoubleTap.off(this.$note);

            this.$note.remove();
            this.$note = null;
            this.$header = null;
            this.$date = null;
            this.$closeButton = null;
            this.$noteBody = null;
            this.$textarea = null;
            this.$buttonSave = null;

            presenter.notesCounter -= 1;
        }
    };

    presenter.Note.prototype.getState = function () {
        return {
            'top': this.$note.css('top'),
            'left': this.$note.css('left'),
            'date': this.$date.html(),
            'body': this.$noteBody.html()
        };
    };

    presenter.Note.createNote = function (savedNote) {
        var note = new presenter.Note();
        note.init(savedNote);

        if (savedNote) {
            note.setDate(savedNote.date);
            note.setBody(savedNote.body);
        }

        return note;
    };

    presenter.createNote = function IWB_Toolbar_createNote(savedNote) {
        return presenter.Note.createNote(savedNote);
    };


    presenter.executeUserEventCode = function (eventCode) {
        presenter.playerController.getCommands().executeEventCode(eventCode);
    };

    presenter.runCustomScript = function IWB_Toolbar_runCustomScript() {
        var eventCode = presenter.isCustomButtonActive() ? presenter.config.onCustomButtonSelected : presenter.config.onCustomButtonDeselected;
        presenter.executeUserEventCode(eventCode);
    };


    presenter.zoomSelectedModule = function IWB_Toolbar_zoomSelectedModule(event) {
        var selectedModule = event.currentTarget;
        if (presenter.$pagePanel.find('.zoomed').length > 0) {
            presenter.$panel.show();
            zoom.out();
            $(selectedModule).parent().find('.zoomed').removeClass('zoomed');
            presenter.changeCursor('zoom-in');
        } else {
            presenter.$panel.hide();
            var topWindowHeight = 0;
            var iframeTopOffset = 0;
            if (window.iframeSize) {
                topWindowHeight = window.iframeSize.windowInnerHeight;
                iframeTopOffset = window.iframeSize.offsetTop - window.iframeSize.frameOffset;
            }
            if ($(selectedModule).hasClass('iwb-default-zoom-cover')) {
                var y = event.clientY;
                var minY = (presenter.zoomConfiguration.initialWindowHeight/2 - window.iframeSize.frameOffset) / presenter.config.defaultZoom;
                var pageHeight = $('.ic_page').height();
                if ($('.ic_header').length > 0) pageHeight += $('.ic_header').height();
                if ($('.ic_footer').length > 0) pageHeight += $('.ic_footer').height();
                var maxY = pageHeight - (presenter.zoomConfiguration.initialWindowHeight/2 / presenter.config.defaultZoom);
                if (y < minY) y = minY;
                if (y > maxY) y = maxY;

                zoom.to({
                    x: event.clientX,
                    y: y,
                    scale: presenter.config.defaultZoom,
                    topWindowHeight: topWindowHeight,
                    iframeTopOffset: iframeTopOffset
                });
            } else {
                zoom.to({
                    element: selectedModule,
                    topWindowHeight: topWindowHeight,
                    iframeTopOffset: iframeTopOffset
                });
            }
            $(selectedModule).addClass('zoomed');
            presenter.changeCursor('zoom-out');
        }
    };

    presenter.changeCursor = function(type) {
        presenter.$pagePanel.removeClass('iwb-zoom-in iwb-zoom-out');

        switch (type) {
            case 'zoom-in':
                presenter.$pagePanel.addClass('iwb-zoom-in');
                break;
            case 'zoom-out':
                presenter.$pagePanel.addClass('iwb-zoom-out');
                break;
        }
    };

    function isDependingOnDrawing(button) {
        return $(button).hasClass('color') || $(button).hasClass('thickness');
    }

    presenter.isDrawingActive = function IWB_Toolbar_isDrawingActive() {
        return presenter.$pagePanel.find('.button.pen.clicked, .button.marker.clicked').length > 0;
    };

    presenter.isAreaDrawingActive = function IWB_Toolbar_isAreaDrawingActive() {
        return presenter.$pagePanel.find('.button.hide-area.clicked, .button.stand-area.clicked').length > 0
            || presenter.drawMode == presenter.DRAW_MODE.HIDE_AREA;
    };

    presenter.areDrawingButtonsActive = function () {
        return presenter.isDrawingActive() || presenter.isAreaDrawingActive();
    };

    function isFloatingImageButton(button) {
        return $(button).hasClass('floating-image');
    }

    function shouldHideDrawingMasks(button) {
        return !$(button).hasClass('pen') && !$(button).hasClass('marker') && !$(button).hasClass('eraser');
    }

    function shouldHideSelectingMasks(button) {
        return !$(button).hasClass('stand-area') && !$(button).hasClass('hide-area');
    }

    function shouldHideFloatingImage(button) {
        return !$(button).hasClass('reset') && !$(button).hasClass('floating-image');
    }

    function shouldClosePanelsOnReset(button) {
        return !$(button).hasClass('pen') && !$(button).hasClass('marker');
    }

    function changeBottomButtonState(button) {
        presenter.$panel.find('.container .clicked-lighter').removeClass('clicked-lighter');
        $(button).toggleClass('clicked-lighter');
    }

    presenter.isSupportCSSPointerEvents = function IWB_Toolbar_isSupportCSSPointerEvents() {
        var myNav = navigator.userAgent.toLowerCase();
        var version = (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
        return !(version == 9 || version == 10);
    };

    presenter.toogleMasks = function IWB_Toolbar_toggleMasks() {
        if (!presenter.isSupportCSSPointerEvents()) {
            presenter.$penMask.hide();
            presenter.$markerMask.hide();
        }

        presenter.$selectingMask.hide();
        if (presenter.isDrawingActive() || presenter.$pagePanel.find('.eraser').hasClass('clicked')) {
            presenter.$penMask.show();
            presenter.$markerMask.show();
        }

        if (presenter.isAreaDrawingActive()) {
            presenter.$selectingMask.show();
        }
    };

    presenter.toggleBottomPanels = function IWB_Toolbar_toggleBottomPanels() {
        var $thicknessPanel = presenter.$pagePanel.find('.bottom-panel-thickness');
        var $colorPanel = presenter.$pagePanel.find('.bottom-panel-color');

        $thicknessPanel.hide();
        $colorPanel.hide();

        function showPanel($panel) {
            if ($panel === 'COLOR') {
                $colorPanel.show();
            } else if ($panel === 'THICKNESS') {
                $thicknessPanel.show();
            } else {
                // NONE
            }
        }

        if (presenter.$pagePanel.find('.pen').hasClass('clicked')) {
            showPanel(presenter.config.showForPen);
        }

        if (presenter.$pagePanel.find('.marker').hasClass('clicked')) {
            showPanel(presenter.config.showForMarker);
        }
    };

    presenter.createCanvases = function () {
        presenter.createCanvas(
            function(mask) {
                presenter.$markerMask = mask;
                presenter.$markerMask.addClass('marker-mask');
                return presenter.$markerMask;
            },
            function(ctx) {
                presenter.markerCtx = ctx;
            },
            function(canvas) {
                presenter.$markerCanvas = canvas;
            }
        );

        presenter.createCanvas(
            function(mask) {
                presenter.$penMask = mask;
                presenter.$penMask.addClass('pen-mask');
                return presenter.$penMask;
            },
            function(ctx) {
                presenter.ctx = ctx;
            },
            function(canvas) {
                presenter.$canvas = canvas;
            }
        );

        presenter.createCanvas(
            function(mask) {
                presenter.$selectingMask = mask;
                presenter.$selectingMask.addClass('selecting');
                return presenter.$selectingMask;
            },
            function(ctx) {
                presenter.selectingCtx = ctx
            },
            function(canvas) {
                presenter.selectingCanvas = canvas;
            }
        );
    };

    presenter.createCanvas = function (setMask, setContext, setCanvas) {
        var $mask = $('<div class="iwb-toolbar-mask"></div>');
        $mask = setMask($mask);
        $mask.hide();

        var icPage = presenter.$pagePanel.find('.ic_page');
        icPage.css('position', 'relative');
        icPage.append($mask);

        var canvas = $('<canvas></canvas>');
        setCanvas(canvas);
        setContext(canvas[0].getContext("2d"));

        $mask.append(canvas);
        canvas[0].width = $mask.width();
        canvas[0].height = $mask.height();
    };

    presenter.applyHovered = function (elements) {
        $.each(elements, function(_, btn) {
            presenter._hoveredButtons.push($(btn));
            $(btn).hover(function() {
                $(this).addClass('hovered');
                $(this).find('.tooltip').show();
            }, function() {
                $(this).removeClass('hovered');
                $(this).find('.tooltip').hide();
            });
        });
    };

    presenter.createPreview = function(view, model) {
        model = presenter.upgradeModel(model);
        presenter.model = model;
        presenter.isKeepStateAndPosition = ModelValidationUtils.validateBoolean(model['keepStateAndPosition']);

        $(view).find('.iwb-toolbar-panel').width(model['Width'] - 50 + 'px');
        $(view).find('.iwb-toolbar-panel').addClass(presenter.model['expansionDirection']);

        var moduleClasses = $(view).attr('class');

        if (moduleClasses.indexOf('addon_IWB_Toolbar') < 0){
            var moduleCustomClass =  moduleClasses.replace('ice_module', '');
            $(view).find('.iwb-toolbar-panel').addClass(moduleCustomClass);
            $(view).removeClass(moduleCustomClass);
        }else{
            $(view).find('.iwb-toolbar-panel').addClass('addon_IWB_Toolbar');
            $(view).removeClass('addon_IWB_Toolbar');
        }
    };

    presenter.run = function(view, model) {
        Kinetic.pixelRatio = 1;
        model = presenter.upgradeModel(model);
        presenter.model = model;
        presenter.isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        presenter.isKeepStateAndPosition = ModelValidationUtils.validateBoolean(model['keepStateAndPosition']);

        presenter.headerLoadedDeferred = new $.Deferred();
        presenter.headerLoaded = presenter.headerLoadedDeferred.promise();


        presenter.setBasicConfiguration(view, model);

        if (!presenter.config.isValid) {
            DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.ERROR_CODES, presenter.config.errorCode);
            return;
        }

        if (!presenter.config.enableUndoRedo) {
            presenter.$pagePanel.find('.reset-one').css('display', 'none');
            presenter.$pagePanel.find('.redo-one').css('display', 'none');
        }

        presenter.addFloatingImages(model);

        presenter.createCanvases();

        presenter.markerTmpCanvas = document.createElement('canvas');
        presenter.markerTmpCtx = presenter.markerTmpCanvas.getContext('2d');
        presenter.markerTmpCanvas.classList.add('iwb_tmp_canvas');

        presenter.$panel.draggable({
            containment: 'parent',
            opacity: 0.35,
            create: function (event, _) {
                $(event.target).addClass('running');
                $(event.target).css('position', presenter.config.panelPosition);
                if (window.savedPanel && window.savedPanel.position) {
                    if (presenter.isKeepStateAndPosition) {
                        if (presenter.config.panelPosition == 'fixed') {
                            $(event.target).css('top', window.savedPanel.position.top + presenter.$pagePanel.offset().top + 'px');
                            $(event.target).css('left', window.savedPanel.position.left + presenter.$pagePanel.offset().left + 'px');
                        } else {
                            $(event.target).css('top', window.savedPanel.position.top + 'px');
                            $(event.target).css('left', window.savedPanel.position.left + 'px');
                        }
                    } else {
                        if (presenter.config.panelPosition == 'fixed') {
                            $(event.target).css('top', (parseInt(model['Top'], 10)) + presenter.$pagePanel.offset().top + 'px');
                            $(event.target).css('left', (parseInt(model['Left'], 10)) + presenter.$pagePanel.offset().left + 'px');

                        } else {
                            $(event.target).css('top', (parseInt(model['Top'], 10)) + 'px');
                            $(event.target).css('left', (parseInt(model['Left'], 10)) + 'px');
                        }
                    }
                } else {
                    var offsetTopPrev,
                        offsetLeftPrev;
                    if (presenter.config.panelPosition == 'fixed') {
                        offsetTopPrev = presenter.$pagePanel.offset().top;
                        offsetLeftPrev = presenter.$pagePanel.offset().left;
                    } else {
                        offsetTopPrev = $(presenter.$panel).position().top;
                        offsetLeftPrev = $(presenter.$panel).position().left;
                    }
                    $(event.target).css('top', (offsetTopPrev + parseInt(model['Top'], 10)) + 'px');
                    $(event.target).css('left', (offsetLeftPrev + parseInt(model['Left'], 10)) + 'px');
                    presenter.headerLoaded.then(function () {
                        var offsetTop,
                            offsetLeft;
                        if (presenter.config.panelPosition == 'fixed') {
                            offsetTop = presenter.$pagePanel.offset().top;
                            offsetLeft = presenter.$pagePanel.offset().left;
                        } else {
                            offsetTop = '';
                            offsetLeft = '';
                        }
                        $(event.target).css('top', (offsetTop + parseInt(model['Top'], 10)) + 'px');
                        $(event.target).css('left', (offsetLeft + parseInt(model['Left'], 10)) + 'px');
                    });
                }
            },
            stop: function (event, ui) {
                var top = ui.position.top;
                var left = ui.position.left;

                if (presenter.config.panelPosition == 'fixed') {
                    window.savedPanel.position = { top: top - presenter.$pagePanel.offset().top, left: left - presenter.$pagePanel.offset().left};
                } else {
                    window.savedPanel.position = { top: top, left: left};
                }

                $.ui.ddmanager.current = null;

                presenter.zoomConfiguration.viewLeftOffset = presenter.$panel.offset().left;
            }
        });


        presenter.applyHovered([presenter.$panel.find('.button')]);

        var newWidthWhenClosed = presenter.config.widthWhenClosed - 50;
        presenter.trueClosedPanelSize = {
            width: newWidthWhenClosed < 0 ? presenter.$panel.width() : newWidthWhenClosed,
            height: presenter.$panel.height()
        }
        if (presenter.config.expansionDirection == "left" || presenter.config.expansionDirection == "right") {
            presenter.$panel.width(presenter.trueClosedPanelSize.width + 'px');
        } else {
            presenter.$panel.css("min-width", presenter.trueClosedPanelSize.width + 'px');
        }

        window.savedPanel = window.savedPanel || {};

        if (window.savedPanel && window.savedPanel.isOpen && presenter.isKeepStateAndPosition) {
            presenter.openPanel(false);
        } else {
            window.savedPanel.widthWhenOpened = presenter.config.widthWhenOpened;
        }

        presenter.addEventHandlers();


        if ((presenter.isInFrame || MobileUtils.isMobileUserAgent(navigator.userAgent)) && presenter.config.panelPosition == 'fixed') {
            addScrollHandler();
        }

        $(view).hide();
        presenter.setVisibility(presenter.isVisible, false, view);

        var width = presenter.$pagePanel.find('.marker-mask').find('canvas')[0].width;
        var height = presenter.$pagePanel.find('.marker-mask').find('canvas')[0].height;

        presenter.markerTmpCanvas.width = width;
        presenter.markerTmpCanvas.height = height;
        presenter.$pagePanel.find('.marker-mask').append(presenter.markerTmpCanvas);

        /**
         * We're adding addon class to its panel as a way of ensuring custom class styling applies.
         * Normally addon has custom class set by Player, but in our case the view is hidden and visible part
         * (panel) is not a child of it.
         */
        presenter.$panel.addClass(document.getElementById(model["ID"]).className);

        zoom.init();
        if(presenter.isKeepStateAndPosition){
           if(window.savedPanel.tools){
               presenter.activeFunction = window.savedPanel.tools.activeFunction;
               presenter.customButtonActive = window.savedPanel.tools.customButtonActive;
               presenter.closePenColor = window.savedPanel.tools.stateColor;
               presenter.closePenThickness = window.savedPanel.tools.stateThickness;
               presenter.buttonColor = presenter.$bottomPanels.find('[color*='+window.savedPanel.tools.buttonColor+']')[0];
               presenter.buttonThickness = presenter.$bottomPanels.find('[thickness*='+window.savedPanel.tools.buttonThickness+']')[0];
               presenter.isCloseColor = window.savedPanel.tools.isCloseColor;
               presenter.shouldSaveColor = window.savedPanel.tools.shouldSaveColor;
                   if(presenter.activeFunction){
                       if(presenter.activeFunction != 'clock'
                       && presenter.activeFunction != 'stopwatch'
                       && presenter.activeFunction != 'note'
                       && presenter.activeFunction != 'reset'
                       && presenter.activeFunction != 'open'
                       && presenter.activeFunction != 'reset-one'
                       && presenter.activeFunction != 'redo-one'){
                           if(!presenter.recklick){
                               presenter.functionButton = presenter.$pagePanel.find('.'+ presenter.activeFunction);
                               if(window.savedPanel.isOpen){
                                   presenter.buttonsLogic[presenter.activeFunction].onOpen(presenter.functionButton);
                                   presenter.functionButton.addClass('clicked');
                               }
                           }
                           presenter.isRecklicked = false;
                       }
                   }
                   if (presenter.customButtonActive) {
                        var button = presenter.$pagePanel.find('.' + CUSTOM_BUTTON_NAME);
                        if(window.savedPanel.isOpen) {
                            button.addClass('clicked');
                        }
                   }
               if(presenter.isCloseColor){
                   presenter.changeColor(presenter.closePenColor, presenter.buttonColor);
                   presenter.changeThickness(presenter.closePenThickness, presenter.buttonThickness);
               }
           }
        }

        presenter._view = view;

        presenter.updateZoomConfiguration();
    };

    presenter.onDestroy = function () {
        var isOpenPanel = window.savedPanel.isOpen;
        if (isOpenPanel) {
            presenter.closePanel(false);
            window.savedPanel.isOpen = true;
        }
        clearCanvases();

        presenter.points = [];
        presenter.points = null;
        presenter.mouse = null;

        /***
         * **********************************************
         * addEventHandlers
         * **********************************************
         */
        presenter.$pagePanel.find('.iwb-toolbar-mask').off();
        presenter.$pagePanel.find('.note').off();

        //noteObjects
        if(presenter.noteObjects) {
            presenter.noteObjects.forEach(function (note) {
                note.destroy();
                note = null;
            });
        }
        presenter.noteObjects = [];
        presenter.noteObjects = null;

        presenter.Note.prototype.getView = null;
        presenter.Note.createNote = null;
        presenter.Note = null;
        presenter.createNote = null;

        //stopwatch
        if (presenter._stopwatch !== null) {
            presenter._stopwatch.stopwatch.off();
            presenter._stopwatch.stopwatch.draggable('destroy');
            presenter._stopwatch.closeButton.off();
            $(presenter._stopwatch.start).off();
            $(presenter._stopwatch.stop).off();
            $(presenter._stopwatch.clear).off();

            if (presenter._stopwatchTimer !== null) {
                clearTimeout(presenter._stopwatchTimer);
            }

            presenter._stopwatch.stopwatch = null;
            presenter._stopwatch.closeButton = null;
            presenter._stopwatch.start = null;
            presenter._stopwatch.stop = null;
            presenter._stopwatch.clear = null;
            presenter._stopwatchTimer = null;
            presenter._stopwatch = null;
        }

        //clock
        if (presenter._clockwatch !== null) {

            if (presenter._clockwatchTimer !== null) {
                clearInterval(presenter._clockwatchTimer);
            }

            presenter._clockwatch.clock.off();
            presenter._clockwatch.clock.draggable('destroy');
            presenter._clockwatch.closeButton.off();

            presenter._clockwatchTimer = null;
            presenter._clockwatch.clock = null;
            presenter._clockwatch.closeButton = null;
            presenter._clockwatch = null;
        }

        presenter.$pagePanel.find('.button').off();
        presenter.$defaultColorButton.off();
        presenter._iwb_buttons.forEach(function ($btn) {
           $btn.off();
        });

        presenter.$pagePanel.off();
        presenter.$panel.off();


        presenter._iwb_buttons.length = 0;
        presenter._iwb_buttons = null;

        presenter.buttonClicked = null;
        presenter.isSavedState = null;
        presenter.buttonsLogic = null;
        presenter.recklick = null;

        $(presenter.markerTmpCanvas).off();
        presenter.$canvas.off(`${EventsUtils.PointingEvents.TYPES.DOWN} ${EventsUtils.PointingEvents.TYPES.MOVE} ${EventsUtils.PointingEvents.TYPES.UP} touchstart touchmove touchend`);
        presenter.$markerCanvas.off(`${EventsUtils.PointingEvents.TYPES.DOWN} ${EventsUtils.PointingEvents.TYPES.MOVE} ${EventsUtils.PointingEvents.TYPES.UP} touchstart touchmove touchend`);

        presenter.isZoomActive = null;
        presenter.$defaultColorButton = null;
        presenter.currentLineColor = null;
        presenter.drawMode = null;

        //changeThickness
        presenter.currentLineWidth = null;
        presenter.currentMarkerThickness = null;
        presenter.currentEraserThickness = null;


        //penCloseHandler
        presenter.penLineColor = null;
        presenter.penLineWidth = null;
        presenter.penColorBackground = null;
        presenter.penThicknessBackground = null;

        //penUnclickHandler
        presenter.colorBackground = null;
        presenter.penClicked = null;

        presenter.markerColorBackground = null;
        presenter.markerThicknessBackground = null;
        presenter.markerCtx = null;
        presenter.markerClicked = null;
        presenter.markerTmpCanvas = null;

        //markerCloseHandler
        presenter.markerLineColor = null;
        presenter.markerLineWidth = null;

        //markerUnclickHandler
        //pass

        //defaultClickHandler
        //pass

        //thicknessClickHandler
        //pass

        //zoomClickHandler
        $(".iwb-zoom-cover").off();
        if (presenter.modules !== undefined) {
            presenter.modules.find('a').unbind('click', presenter.preventClickAction_zoomClickHandler);
            presenter.modules.length = 0;
            presenter.modules = null;
        }

        //textAudioEvents
        presenter.textAudioEvents.forEach(function (element) {
            $(element).unbind('click', preventClickActionTextAudio);
        });
        presenter.areZoomEventHandlersAttached = null;
        presenter.isPointerDown = null;

        //eraserClickHandler
        presenter.ctx = null;
        presenter.drawMode = null;

        //eraserUnClickHandler
        presenter.$penMask = null;

        //hideAreaClickHandler
        var $hideAreaCanvas = presenter.$view.parent().find('.selecting').find('#iwb_tmp_canvas');
        $hideAreaCanvas.off();

        //standAreaClickHandler
        //pass

        //resetClickHandler
        presenter.selectingCtx = null;
        presenter.areas = [];
        presenter.areas = null;

        //noteClickHandler
        //pass

        //customScriptClickHandler
        //pass

        //floatingImageClickHandler
        //pass

        //clockClickHandler
        //pass

        //stopwatchClickHandler
        //pass

        //closeClickHandler
        presenter.closePenColor = null;
        presenter.currentLineColor = null;
        presenter.closePenThickness = null;
        presenter.currentLineWidth = null;
        presenter.isCloseColor = null;
        presenter.shouldSaveColor = null;
        presenter.closePenColor = null;
        presenter.closePenThickness = null;
        presenter.currentMarkerThickness = null;
        presenter.isCloseColor = null;
        presenter.isCloseColor = null;
        presenter.isPanelOpened = null;
        presenter.activeFunction = null;
        presenter.activeButton = null;
        presenter.customButtonActive = null;

        //openClickHandler
        presenter.isRecklicked = null;

        /***
         * *******************************************************************
         * setBasicConfiguration
         * *******************************************************************
         */
        presenter.$removeConfirmationBox.off();
        presenter.$removeConfirmationBoxClock.off();
        presenter.$removeConfirmationBoxStopwatch.off();
        presenter.$panel.draggable("destroy");
        presenter.$view.off();
        presenter.$defaultThicknessButton.off();
        presenter.$buttonsExceptOpen.off();
        presenter.$removeConfirmationBox.off();
        presenter.$removeConfirmationBoxClock.off();
        presenter.$removeConfirmationBoxStopwatch.off();
        presenter.$bottomPanels.off();

        presenter.$removeConfirmationBox.remove();
        presenter.$removeConfirmationBoxClock.remove();
        presenter.$removeConfirmationBoxStopwatch.remove();
        presenter.$panel.remove();

        presenter.headerLoadedDeferred = null;
        presenter.headerLoaded = null;

        presenter.$view = null;
        presenter.$panel = null;
        presenter.$defaultThicknessButton = null;
        presenter.isInFrame = null;
        presenter.$buttonsExceptOpen = null;
        presenter.buttonWidth = null;

        presenter.$removeConfirmationBox = null;

        presenter._view = null;
        presenter.model = null;
        presenter.isVisible = null;
        presenter.isKeepStateAndPosition = null;

        presenter.$pagePanel = null;
        presenter.$removeConfirmationBoxClock = null;
        presenter.$removeConfirmationBoxStopwatch = null;
        presenter.$bottomPanels = null;

        presenter.config = null;

        presenter.iwb_tmp_canvas = null;
        presenter.tmp_ctx = null;

        presenter.$markerMask = null;
        presenter.$markerCanvas = null;
        presenter.markerCtx = null;
        presenter.$penMask = null;
        presenter.ctx = null;
        presenter.$canvas = null;
        presenter.$selectingMask = null;
        presenter.selectingCtx = null;
        presenter.selectingCanvas = null;

        /***
         * *****************************************
         * presenter.addFloatingImages - kinetic.js
         * *****************************************
         */
        presenter.$floatingImageMask.off();

        if(presenter.floatingImageLayer) {
            presenter.floatingImageLayer.destroy();
        }
        if(presenter.floatingImageStage) {
            presenter.floatingImageStage.destroy();
        }

        for(var i = 0; i < 3; i++) {
            if(presenter._kinetic.images[i]) {
                presenter._kinetic.images[i].destroy();
            }

            //imageRotateObj
            if(presenter._kinetic.rotateObj[i]) {
                $(presenter._kinetic.rotateObj[i]).off();
                presenter._kinetic.rotateObj[i].src = '';
            }

            //imageMoveObj
            if(presenter._kinetic.moveObj[i]) {
                $(presenter._kinetic.moveObj[i]).off();
                presenter._kinetic.moveObj[i].src = '';
            }


            //imageObj
            if(presenter._kinetic.imageObj[i]) {
                $(presenter._kinetic.imageObj[i]).off();
                presenter._kinetic.imageObj[i].src = '';
            }

            if(presenter._kinetic.rotateIcon[i]) {
                presenter._kinetic.rotateIcon[i].destroy();
            }
            if(presenter._kinetic.moveIcon[i]) {
                presenter._kinetic.moveIcon[i].destroy();
            }
            if(presenter.floatingImageGroups[i]) {
                presenter.floatingImageGroups[i].destroy();
            }
        }

        presenter._kinetic.images = [];
        presenter._kinetic.rotateObj = [];
        presenter._kinetic.moveObj = [];
        presenter._kinetic.rotateIcon = [];
        presenter._kinetic.moveIcon = [];

        presenter._kinetic.groups = null;
        presenter._kinetic.images = null;
        presenter._kinetic.rotateObj = null;
        presenter._kinetic.moveObj = null;
        presenter._kinetic.rotateIcon = null;
        presenter._kinetic.moveIcon = null;

        presenter._kinetic.imageObj = [];
        presenter._kinetic.imageObj.length = 0;
        presenter._kinetic.imageObj = null;

        presenter._kinetic = null;

        presenter.floatingImageLayer = null;
        presenter.floatingImageStage = null;
        presenter.allImagesLoadedPromises = [];
        presenter.allImagesLoadedPromises.length = 0;
        presenter.allImagesLoadedPromises = null;

        /***
         * ***********************************************
         *  applyHovered
         * ***********************************************
         */
        presenter._hoveredButtons.forEach(function ($btn) {
            $btn.off();
        });
        presenter._hoveredButtons.length = [];
        presenter._hoveredButtons = null;

        /***
         * **************************************************
         * addScrollHandler
         * **************************************************
         */
         if (presenter.playerController && !presenter.playerController.isPlayerInCrossDomain()) {
             $(window.parent.document).unbind('scroll', IWB_Toolbar_scrollHandler);
             $(window.parent.document).find('#lesson-view > div > div').unbind('scroll', IWB_Toolbar_scrollHandler);
             $(window).unbind('scroll', IWB_Toolbar_scrollHandler);
             $("#content-view").unbind('scroll', IWB_Toolbar_scrollHandler);
         }

        /***
         * ************************************************
         * zoom
         * ************************************************
         */
        if(zoom) {
            zoom.destroy();
        }

        /***
         *************************************************
         * setState
         *************************************************
        */
        presenter._setState.images.forEach(function (image) {
            $(image).off();
            image.src = '';
        });
        presenter._setState.images.length = 0;
        presenter._setState.images = null;

        presenter._setState = null;



        /***
         * ***********************************************
         * functions
         * ***********************************************
         */
        presenter.setBasicConfiguration = null;
        presenter.changeCursor = null;
        presenter.createCanvases = null;
        presenter.createCanvas = null;
        presenter.addFloatingImages = null;
        presenter.loadDeferredFloatingImage = null;
        presenter.applyHovered = null;
        presenter.setVisibility = null;
        presenter.openPanel = null;
        presenter._openPanelShow = null;
        presenter._closePanelShow = null;
        presenter.toogleMasks = null;
        presenter.isSupportCSSPointerEvents = null;
        presenter.panelView = null;
        presenter.markerDrawingLogic = null;
        applyOnDblClickHandler = null;
        applyDoubleTapHandler = null;

        //buttonsLogic clearing
        presenter.addEventHandlers = null;
        presenter.penClickHandler = null;
        presenter.penCloseHandler = null;
        presenter.penUnclickHandler = null;
        presenter.markerClickHandler = null;
        presenter.markerCloseHandler = null;
        presenter.markerUnclickHandler = null;
        presenter.defaultClickHandler = null;
        presenter.colorClickHandler = null;
        presenter.thicknessClickHandler = null;
        presenter.zoomClickHandler = null;
        presenter.zoomCloseHandler = null;
        presenter.eraserClickHandler = null;
        presenter.eraserUnClickHandler = null;
        presenter.hideAreaClickHandler = null;
        presenter.standAreaClickHandler = null;
        presenter.resetClickHandler = null;
        presenter.resetOneClickHandler = null;
        presenter.redoOneClickHandler = null;
        presenter.noteClickHandler = null;
        presenter.customScriptClickHandler = null;
        presenter.floatingImageClickHandler = null;
        presenter.clockClickHandler = null;
        presenter.stopwatchClickHandler = null;
        presenter.closeClickHandler = null;
        presenter.openClickHandler = null;
        presenter.areDrawingButtonsActive = null;
        presenter.isDrawingActive = null;
        presenter.isAreaDrawingActive = null;
        presenter.getTheWidestAndHighest = null;
        presenter.preventClickAction_zoomClickHandler = null;
        presenter.zoomSelectedModule = null;
        presenter.drawAreaLogic = null;
        presenter.setImagePosition = null;
        presenter.createClock = null;
        presenter.createStopwatch = null;
        presenter.closePanel = null;

        //markerDrawingLogicFunctions
        presenter.onTouchStartCallback = null;
        presenter.onTouchEndEventCallback = null;
        presenter.markerPointerMoveHandler = null;
        presenter.markerPointerDownHandler = null;
        presenter.markerPointerUpHandler = null;

        //penDrawingLogicFunctions
        presenter.penPointerMoveHandler = null;
        presenter.penPointerDownHandler = null;
        presenter.penPointerUpHandler = null;

        //hideArea
        presenter.drawAreaLogic_touchStartCallback = null;
        presenter.drawAreaLogic_touchEndCallback = null;
        presenter.drawAreaLogic_mouseDownCallback = null;
        presenter.drawAreaLogic_mouseUpCallback = null;

        presenter.drawAreaLogic = null;

        presenter.disableTextAudioEventHandlers = null;
        presenter.restoreTextAudioEventHandlers = null;
        presenter.changeColor = null;
        presenter.changeThickness = null;
        presenter.drawingLogic = null;
        presenter.toggleBottomPanels = null;
        presenter.reset = null;
        presenter._reset = null;
    };

    presenter._reset = function IWB_Toolbar_private_reset(closePanel, shouldClearCanvas, shouldHideDrawingMasks, shouldHideSelectingMasks, shouldHideFloatingImage, shouldClearSelectingMask) {
        presenter.$panel.find('.clicked-lighter').removeClass('clicked-lighter');
        presenter.$panel.find('.hovered').removeClass('hovered');
        presenter.$pagePanel.find('.zoomed').removeClass('zoomed');
        presenter.$pagePanel.enableSelection();
        presenter.changeCursor('default');

        if (closePanel) {
            presenter.$pagePanel.find('.bottom-panel-color').hide();
            presenter.$pagePanel.find('.bottom-panel-thickness').hide();
        }

        if (shouldClearCanvas) {
            presenter.changeColor('#0fa9f0');
            clearCanvases();
        }

        if (shouldHideDrawingMasks && !presenter.isSupportCSSPointerEvents()) {
            if (presenter.$penMask) {
                presenter.$penMask.hide();
            }
            if (presenter.$markerMask) {
                presenter.$markerMask.hide();
            }
        }

        if (shouldHideSelectingMasks) {
            if (presenter.$selectingMask) {
                presenter.$selectingMask.hide();
            }
        }

        if(shouldHideFloatingImage){
            if (presenter.$floatingImageMask) {
                presenter.$floatingImageMask.hide();
                presenter.$pagePanel.find('.bottom-panel-floating-image').hide();
                presenter.$pagePanel.find('.bottom-panel-floating-image').attr('isHidden', '1');
            }
        }

        if (shouldClearSelectingMask) {
            clearSelectingCanvas();
        }

        setOverflowWorkAround(true);
        setOverflowWorkAround(false);
    };

    presenter.changeColor = function IWB_Toolbar_changeColor(color, button) {
        if (button) {
            presenter.$panel.find('.button.color').css('background-image', $(button).css('background-image'));
        } else {
            presenter.$panel.find('.button.color').css('background-image', presenter.$defaultColorButton.css('background-image'));
        }
        presenter.currentLineColor = color;
    };

    presenter.changeThickness = function IWB_Toolbar_changeThickness(size, button) {
        if (button) {
            presenter.$panel.find('.button.thickness').css('background-image', $(button).css('background-image'));
        } else {
            presenter.$panel.find('.button.thickness').css('background-image', presenter.$defaultThicknessButton.css('background-image'));
        }
        presenter.currentLineWidth = presenter.data.defaultPenWidth === 1 ? size : presenter.data.defaultPenWidth;

        presenter.currentMarkerThickness = presenter.data.markerThickness === 10 ? size : presenter.data.markerThickness;
        presenter.currentEraserThickness = presenter.data.eraserThickness === 20 ? size : presenter.data.eraserThickness;
    };

    function clearCanvases() {
        if (presenter.$canvas) {
            presenter.penUsed = false;
            presenter.$canvas.off(`${EventsUtils.PointingEvents.TYPES.MOVE} ${EventsUtils.PointingEvents.TYPES.DOWN} ${EventsUtils.PointingEvents.TYPES.UP}`);
            presenter.ctx.clearRect(0, 0, presenter.$canvas[0].width, presenter.$canvas[0].height);
        }

        if (presenter.$markerCanvas) {
            presenter.markerUsed = false;
            presenter.$markerCanvas.off(`${EventsUtils.PointingEvents.TYPES.MOVE} ${EventsUtils.PointingEvents.TYPES.DOWN} ${EventsUtils.PointingEvents.TYPES.UP}`);
            presenter.markerCtx.clearRect(0, 0, presenter.$markerCanvas[0].width, presenter.$markerCanvas[0].height);
        }
    }

    function clearSelectingCanvas() {
        if (presenter.selectingCanvas) {
            presenter.selectingCanvas.off(`${EventsUtils.PointingEvents.TYPES.MOVE} ${EventsUtils.PointingEvents.TYPES.DOWN} ${EventsUtils.PointingEvents.TYPES.UP}`);
            presenter.selectingCtx.clearRect(0, 0, presenter.selectingCanvas[0].width, presenter.selectingCanvas[0].height);
        }
    }

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.isVisible = false;
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$panel.css('visibility', isVisible ? 'visible' : 'hidden');
    };

    presenter.isCustomButtonActive = function() {
        return presenter.customButtonActive;
    }

    presenter.executeCommand = function(name, params) {
        var commands = {
            'deselectCustomButton': presenter.deselectCustomButton,
            'open' : presenter.open,
            'hide' : presenter.hide,
            'show' : presenter.show,
            'setPenColor' : presenter.setPenColor,
            'setMarkerColor' : presenter.setMarkerColor,
            'setDefaultPenThickness' : presenter.setDefaultPenThickness,
            'setMarkerThickness': presenter.setMarkerThickness,
            'setEraserThickness': presenter.setEraserThickness
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function IWB_Toolbar_reset() {
        if (presenter.customButtonActive) {
            presenter.deselectCustomButton();
        }
        presenter.$pagePanel.find('.clicked').removeClass('clicked');
        presenter._reset(true, true, true, true, true, true);
        presenter.penLineWidth = 1;
        presenter.data.defaultPenWidth = 1;
        presenter.markerLineWidth = 10;
        presenter.data.eraserThickness = 20;
        presenter.penDataURL = null;
        presenter.markerDataUrl = null;
    };

    presenter.getErrorCount = function() { return 0; };
    presenter.getMaxScore = function() { return 0; };
    presenter.getScore = function() { return 0; };

    function getSavedClocks() {
        var clocks = [];
        $.each(presenter.$pagePanel.find('.iwb-toolbar-clock'), function() {
            clocks.push({
                'top': $(this).css('top'),
                'left': $(this).css('left')
            });
        });
        return clocks;
    }

    function getSavedStopwatches() {
        var stopwatches = [];
        $.each(presenter.$pagePanel.find('.iwb-toolbar-stopwatch'), function() {
            stopwatches.push({
                'top': $(this).css('top'),
                'left': $(this).css('left')
            });
        });
        return stopwatches;
    }

    function isPanelOpened() {
        return presenter.$panel.hasClass('opened');
    }

    presenter.getState = function() {
        zoom.out();
        var notes = presenter.noteObjects.map(function (note) {
            return note.getState();
        });

        var clocks = getSavedClocks(),
           stopwatches = getSavedStopwatches(),
           position = presenter.$panel.position(),
           openedPanel = isPanelOpened(),
           drawings = {
               'pen' : (presenter.penUsed && presenter.$canvas) ? presenter.penDataURL : null,
               'marker' : (presenter.markerUsed && presenter.$markerCanvas) ? presenter.markerDataUrl : null
           };

        var stateColor;
        var stateThickness;
        if(openedPanel){
           if(presenter.shouldSaveColor == 'pen' || presenter.shouldSaveColor == 'stand-area' || presenter.shouldSaveColor == 'hide-area'){
               presenter.closePenColor = presenter.currentLineColor;
               presenter.closePenThickness = presenter.currentLineWidth;

               presenter.isCloseColor = true;
           }else if(presenter.shouldSaveColor == 'marker'){
               presenter.closePenColor = presenter.currentLineColor;
               presenter.closePenThickness = presenter.currentMarkerThickness;

               presenter.isCloseColor = true;
           }
           else{
               presenter.isCloseColor = false;
           }
           if(presenter.activeButton != 'open'){
               presenter.activeFunction = presenter.activeButton;
           }
        }

        if(presenter.shouldSaveColor == 'pen' || presenter.shouldSaveColor == 'stand-area' || presenter.shouldSaveColor == 'hide-area'){
           stateColor = presenter.closePenColor;
           stateThickness = presenter.closePenThickness;
        }else if(presenter.shouldSaveColor == 'marker'){
           stateColor = presenter.closePenColor;
           stateThickness = presenter.closePenThickness;
        }else{
           stateColor = '';
           stateThickness = '';
        }

        if(presenter.isKeepStateAndPosition){
           if(window.savedPanel.tools){
               if(!presenter.activeFunction || presenter.activeFunction == 'open' || presenter.activeFunction == 'close'){
                   presenter.activeFunction = window.savedPanel.tools.activeFunction;
               }
           }
        }

        var isSelectingVisible = presenter.$selectingMask.is(':visible');

        window.savedPanel.tools = {
           'activeFunction': presenter.activeFunction,
           'customButtonActive': presenter.customButtonActive,
           'stateColor': stateColor,
           'stateThickness': stateThickness,
           'isCloseColor': presenter.isCloseColor,
           'buttonColor': $(presenter.buttonColor).attr("color"),
           'buttonThickness': $(presenter.buttonThickness).attr("thickness"),
           'shouldSaveColor': presenter.shouldSaveColor
        };

        var state = {
           'areas' : presenter.areas,
           'notes' : notes,
           'clocks' : clocks,
           'stopwatches' : stopwatches,
           'drawings' : drawings,
           'seconds' : presenter.seconds,
           'minutes' : presenter.minutes,
           'hours' : presenter.hours,
           'stopClicked' : presenter.stopButtonClicked,
           'startClicked' : presenter.startButtonClicked,
           'isVisible' : presenter.isVisible,
           'position' : position,
           'openedPanel' : openedPanel,
           'activeFunction': presenter.activeFunction,
           'customButtonActive': presenter.customButtonActive,
           'stateColor': stateColor,
           'stateThickness': stateThickness,
           'isCloseColor': presenter.isCloseColor,
           'buttonColor': $(presenter.buttonColor).attr("color"),
           'buttonThickness': $(presenter.buttonThickness).attr("thickness"),
           'shouldSaveColor': presenter.shouldSaveColor,
           'isSelectingVisible': isSelectingVisible
        };

        return JSON.stringify(state);
    };

    /**
     * We are omitting state properties as follows:
     * - hours
     * - minutes
     * - seconds
     * - stopClicked
     * - startClicked
     *
     * Because they are used when creating stopwatches and we assume here that no stopwatches should be created
     * (hence empty array of them).
     */
    presenter.upgradeStateForStopwatchesAndClocks = function(parsedState) {
        if (parsedState.stopwatches == undefined) {
            parsedState.stopwatches = [];
        }
        if (parsedState.clocks == undefined) {
            parsedState.clocks = [];
        }

        return parsedState;
    };

    presenter.upgradeStateForVisibility = function (parsedState) {
        if (parsedState.isVisible == undefined) {
            parsedState.isVisible = true;
        }

        return parsedState;
    };

    presenter.upgradeStateForSavingTools = function (parsedState){
        if(parsedState.activeFunction == undefined){
            parsedState.activeFunction = '';
        }
        if(presenter.customButtonActive == undefined){
            parsedState.customButtonActive = '';
        }
        if(parsedState.buttonColor == undefined){
            parsedState.buttonColor = '';
        }
        if(parsedState.buttonThickness == undefined){
            parsedState.buttonThickness = '';
        }
        if(parsedState.isCloseColor == undefined){
            parsedState.isCloseColor = false;
        }
        if(parsedState.shouldSaveColor == undefined){
            parsedState.shouldSaveColor = '';
        }
        if(parsedState.stateColor == undefined){
            parsedState.stateColor = '#000';
        }
        if(parsedState.stateThickness == undefined){
            parsedState.stateThickness = 1;
        }

        return parsedState;
    };

    presenter.upgradeStateForSelectingMaskVisibility = function (parsedState) {
            if (parsedState.isSelectingVisible == undefined) {
                parsedState.isSelectingVisible = false;
            }

            return parsedState;
        };

    presenter.upgradeState = function (parsedState) {
        var upgradedState = presenter.upgradeStateForStopwatchesAndClocks(parsedState);
        upgradedState = presenter.upgradeStateForVisibility(upgradedState);
        upgradedState = presenter.upgradeStateForSavingTools(upgradedState);
        upgradedState = presenter.upgradeStateForSelectingMaskVisibility(upgradedState);

        return  upgradedState;
    };

    presenter.shouldRestoreStateAndPosition = function (model, state) {
        var keepStateAndPosition = model['keepStateAndPosition'];

        if (keepStateAndPosition == undefined || state.position == undefined) {
            return false;
        }

        return keepStateAndPosition === 'True';
    };

    presenter.setState = function(state) {
        if (!state) {
           return;
        }
        var parsedState = JSON.parse(state);

        var upgradedState = presenter.upgradeState(parsedState);
        presenter.areas = parsedState.areas;
        presenter.stopwatches = parsedState.stopwatches;
        presenter.clocks = parsedState.clocks;
        if (presenter.shouldRestoreStateAndPosition(presenter.model, upgradedState)) {
           if (upgradedState.openedPanel) {
               if(presenter.isKeepStateAndPosition){
                   presenter.openPanel(false);
               }
           }
           presenter.position = upgradedState.position;

           var visibility = presenter.$panel.css('visibility');
           var width = presenter.$panel.css('width');
           var position = presenter.$panel.css('position');

           presenter.$panel.attr('style', 'position: ' + position + '; top: ' + presenter.position.top + 'px; left: ' + presenter.position.left + 'px; visibility: ' + visibility + '; width: ' + width + ';');
        }


        var image1 = new Image();
        var image2 = new Image();
        presenter._setState.images.push(image1);
        presenter._setState.images.push(image2);

        if (upgradedState.drawings.pen) {
            presenter.penUsed = true;
        }
        if (upgradedState.drawings.marker) {
            presenter.markerUsed = true;
        }

        presenter.penDataURL = upgradedState.drawings.pen;
        presenter.markerDataUrl = upgradedState.drawings.marker;
        setDrawingState(new Image(), presenter.ctx, upgradedState.drawings.pen);
        setDrawingState(new Image(), presenter.markerCtx, upgradedState.drawings.marker);

        $.each(parsedState.notes, function(_, noteData) {
            var note = presenter.createNote(noteData);
            presenter.noteObjects.push(note);
            presenter.$pagePanel.find('.ic_page').append(note.getView());
        });

        $.each(presenter.clocks, function() {
           presenter.createClock(this);
        });

        $.each(presenter.stopwatches, function() {
           presenter.createStopwatch(this, upgradedState.hours, upgradedState.minutes, upgradedState.seconds, upgradedState.stopClicked, upgradedState.startClicked);
        });

        drawSavedAreas();
        presenter.isVisible = upgradedState.isVisible;
        presenter.setVisibility(presenter.isVisible, false, presenter.$view);

        if (presenter.isSupportCSSPointerEvents()) {
           presenter.$penMask.show();
           presenter.$markerMask.show();
           if (presenter.isKeepStateAndPosition
               && window.savedPanel.tools != undefined
               && (window.savedPanel.tools.activeFunction == 'pen' || window.savedPanel.tools.activeFunction == 'marker')
               && window.savedPanel.isOpen)
           {
               presenter.$penMask.css('pointer-events', 'auto');
               presenter.$markerMask.css('pointer-events', 'auto');
               presenter.$penMask.css('touch-action', 'none');
               presenter.$markerMask.css('touch-action', 'none');
           } else {
               presenter.$penMask.css('pointer-events', 'none');
               presenter.$markerMask.css('pointer-events', 'none');
               presenter.$penMask.css('touch-action', 'auto');
               presenter.$markerMask.css('touch-action', 'auto');
           }
        }

        if(presenter.isKeepStateAndPosition && (window.savedPanel.tools != undefined)){
           presenter.customButtonActive = window.savedPanel.tools.customButtonActive;
           presenter.activeFunction = window.savedPanel.tools.activeFunction;
           presenter.closePenColor = window.savedPanel.tools.stateColor;
           presenter.closePenThickness = window.savedPanel.tools.stateThickness;
           presenter.buttonColor = presenter.$bottomPanels.find('[color*='+window.savedPanel.tools.buttonColor+']')[0];
           presenter.buttonThickness = presenter.$bottomPanels.find('[thickness*='+window.savedPanel.tools.buttonThickness+']')[0];
           presenter.isCloseColor = window.savedPanel.tools.isCloseColor;
           presenter.shouldSaveColor = window.savedPanel.tools.shouldSaveColor;
        }else{
           presenter.customButtonActive = upgradedState.customButtonActive;
           presenter.activeFunction = upgradedState.activeFunction;
           presenter.closePenColor = upgradedState.stateColor;
           presenter.closePenThickness = upgradedState.stateThickness;
           presenter.buttonColor = presenter.$bottomPanels.find('[color*='+upgradedState.buttonColor+']')[0];
           presenter.buttonThickness = presenter.$bottomPanels.find('[thickness*='+upgradedState.buttonThickness+']')[0];
           presenter.isCloseColor = upgradedState.isCloseColor;
           presenter.shouldSaveColor = upgradedState.shouldSaveColor;
        }
        if(presenter.activeFunction){
           presenter.activeButton = presenter.activeFunction;
        }

        presenter.isSavedState = true;

        if(!presenter.isKeepStateAndPosition){
           if(presenter.isCloseColor){
               presenter.changeColor(presenter.closePenColor, presenter.buttonColor);
               presenter.changeThickness(presenter.closePenThickness, presenter.buttonThickness);
           }
        }

        if(upgradedState.isSelectingVisible) {
            presenter.$selectingMask.show();
        } else {
            presenter.$selectingMask.hide();
        }

        setOverflowWorkAround(true);
        setOverflowWorkAround(false);
    };

    presenter.updateZoomConfiguration = function () {
        presenter.zoomConfiguration.playerInitialLeftOffset = $("#_icplayer").offset().left;
        presenter.zoomConfiguration.viewLeftOffset = presenter.$panel.offset().left;
    };

    function setDrawingState(image, ctx, data) {
        if (data) {
            $(image).load(function() {
                ctx.drawImage(image, 0, 0);
            });
            image.src = data;
        }
    }

    presenter.setPenColor = function(color) {
        color = color[0];
        presenter.data.penColor = color;
        if (presenter.$pagePanel.find('.clicked').hasClass('pen')) {
            presenter.currentLineColor = color;
        }
    };

    presenter.setMarkerColor = function(color) {
        color = color[0];
        presenter.data.markerColor = color;
        if (presenter.$pagePanel.find('.clicked').hasClass('marker')) {
            presenter.currentLineColor = color;
        }
    };

    presenter.setDefaultPenThickness = function(lineWidth) {
        presenter.data.defaultPenWidth = parseInt(lineWidth, 10);
        presenter.changeThickness(presenter.data.defaultPenWidth);
    };

    presenter.setMarkerThickness = function (thickness){
        presenter.data.markerThickness = parseInt(thickness, 10);
        presenter.changeThickness(presenter.data.markerThickness);
    };

    presenter.setEraserThickness = function (thickness){
        presenter.data.eraserThickness = parseInt(thickness, 10);
        presenter.changeThickness(presenter.data.eraserThickness);
    };

    presenter.destroyDraggableItems = function() {
        for (var i = 0; i < presenter.noteObjects.length; i++) {
            presenter.noteObjects[i].destroy();
        }
        presenter.noteObjects = [];

        if (presenter.stopwatchAdded) {
            closeStopwatch();
        }

        if (presenter.clockAdded) {
            closeClock();
        }
    }

    presenter.resetDrawingMode = function() {
        presenter.drawMode = presenter.DRAW_MODE.NONE;
        presenter.ctx.globalCompositeOperation = 'source-over';
        presenter.markerCtx.globalCompositeOperation = 'source-over';
        presenter.$penMask.css('pointer-events', 'none');
        presenter.$markerMask.css('pointer-events', 'none');
        presenter.$penMask.css('touch-action', 'auto');
        presenter.$markerMask.css('touch-action', 'auto');
    }

    presenter.restoreLastState = function() {
        presenter.stateStack.restoreLastState();
    }

    presenter.pushStateToStack = function() {
        this.stateStack.pushStateToStack();
    }

    presenter.redoStateFromArray = function() {
        presenter.stateStack.redoStateFromArray();
    }

    // Method added to aid in testing
    presenter.getStateStack = function() {
        if (presenter.stateStack == null) {
            presenter.stateStack = new StateStack(presenter);
        }
        return presenter.stateStack;
    }

    function StateStack(iwbPresenter) {
        this.iwbPresenter = iwbPresenter;
        this.currentState = "";
        this.prevStateStack = [];
        this.nextStateStack = [];
        this.stateStackOverflow = false;
        if (iwbPresenter.playerController) {
            var pageIndex = iwbPresenter.playerController.getCurrentPageIndex();
            if (window.savedPanel && window.savedPanel.histories && window.savedPanel.histories[pageIndex]) {
                this.setState(window.savedPanel.histories[pageIndex]);
            }
        }
    }

    StateStack.prototype.getState = function() {
        var state = {
            currentState: this.currentState,
            prevStateStack: this.prevStateStack,
            nextStateStack: this.nextStateStack,
            stateStackOverflow: this.stateStackOverflow
        };
        return JSON.stringify(state);
    }

    StateStack.prototype.setState = function(state) {
        var parsedState = JSON.parse(state);
        this.currentState = parsedState.currentState;
        this.prevStateStack = parsedState.prevStateStack;
        this.nextStateStack = parsedState.nextStateStack;
        this.stateStackOverflow = parsedState.stateStackOverflow;
    }

    StateStack.prototype.compareStates = function(state1, state2) {
        if (state1.length == 0 || state2.length == 0) {
            return state1.length == state2.length;
        }
        var json1 = JSON.parse(state1);
        var json2 = JSON.parse(state2);
        var newJson1 = {};
        var newJson2 = {};
        var compareFields = ["areas", "clocks", "drawings", "notes", "stopwatches"];
        for(var i = 0; i < compareFields.length; i++) {
            var fieldName = compareFields[i];
            newJson1[fieldName] = json1[fieldName];
            newJson2[fieldName] = json2[fieldName] ;
        }
        var result = JSON.stringify(newJson1) == JSON.stringify(newJson2);
        return result;
    }

    StateStack.prototype.pushStateToStack = function() {
        if (!this.iwbPresenter.config.enableUndoRedo) return;
        var newState = this.iwbPresenter.getState();
        if (!this.compareStates(newState, this.currentState)) {
            if (this.nextStateStack.length > 0) {
                this.nextStateStack = [];
            }
            if (this.currentState.length > 0) {
                this.prevStateStack.push(this.currentState);
                this.currentState = newState;
                if (this.prevStateStack.length > 5) {
                    this.stateStackOverflow = true;
                    this.prevStateStack.splice(0, this.prevStateStack.length - 5);
                }
            } else {
                this.currentState = newState;
            }
            this.updateGlobalHistory();
        }
    }

    StateStack.prototype.restoreLastState = function() {
        if (!this.iwbPresenter.config.enableUndoRedo) return;
        this.iwbPresenter.resetDrawingMode();
        if (this.prevStateStack.length > 0) {
            this.iwbPresenter.reset();
            this.iwbPresenter.destroyDraggableItems();
            this.nextStateStack.push(this.currentState);
            this.currentState = this.prevStateStack.pop();
            this.iwbPresenter.setState(this.currentState);
            this.updateGlobalHistory();
        } else if (!this.stateStackOverflow && this.currentState.length > 0) {
            this.iwbPresenter.reset();
            this.iwbPresenter.destroyDraggableItems();
            this.nextStateStack.push(this.currentState);
            this.currentState = "";
            this.updateGlobalHistory();
        }
    }

    StateStack.prototype.redoStateFromArray = function() {
        if (!this.iwbPresenter.config.enableUndoRedo) return;
        this.iwbPresenter.resetDrawingMode();
        if (this.nextStateStack.length > 0) {
            this.iwbPresenter.reset();
            this.iwbPresenter.destroyDraggableItems();
            this.prevStateStack.push(this.currentState);
            this.currentState = this.nextStateStack.pop();
            this.iwbPresenter.setState(this.currentState);
            this.updateGlobalHistory();
        }
    }

    StateStack.prototype.updateGlobalHistory = function() {
        if (!window.savedPanel.histories) {
            window.savedPanel.histories = {};
        };
        if (presenter.playerController) {
            var pageIndex = this.iwbPresenter.playerController.getCurrentPageIndex();
            window.savedPanel.histories[pageIndex] = this.getState();
        }
    }

    return presenter;
}

AddonIWB_Toolbar_create.__supported_player_options__ = {
    interfaceVersion: 2
};
