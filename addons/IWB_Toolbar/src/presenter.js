function AddonIWB_Toolbar_create() {

    function getCorrectObject(val) { return { isValid: true, value: val } }

    function getErrorObject(ec) { return { isValid: false, errorCode: ec } }

    function addZero(val) { return (val > 9 ? '' : '0') + val; }

    function getPoint(x, y) { return { x: x, y: y }; }

    var presenter = function() {};

    var DEFAULT_COLOR = '#0fa9f0';

    presenter.data = {
        defaultPenWidth: 1,
        penColor: DEFAULT_COLOR,
        markerColor: '#ffff99'
    };

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.areas = [];
    presenter.notes = [];
    presenter.clocks = [];
    presenter.stopwatches = [];
    presenter.currentLineColor = DEFAULT_COLOR;
    presenter.currentLineWidth = presenter.data.defaultPenWidth;
    presenter.isMouseDown = false;
    presenter.lastMousePosition = {};
    presenter.floatingImageGroups = {};
    presenter.currentFloatingImageIndex = 0;

    presenter.isZoomActive = false;
    presenter.areZoomEventHandlersAttached = false;

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
    };

    presenter.onEventReceived = function(eventName, eventData) {
        if (eventName == 'PageLoaded' && eventData.source == 'header') {
            presenter.headerLoadedDeferred.resolve();
        }
    };

    presenter.ERROR_CODES = {
        'E01': 'Width can NOT be negative.'
    };

    presenter.createPreview = function(view, model) {
        runLogic(view, model, true);
    };

    function closePanel() {
        if (!presenter.$panel.hasClass('animationInProgress')) {
            presenter.$bottomPanels.addClass('closed-hide');

            presenter.$panel.addClass('animationInProgress');
            presenter.$panel.children('.button-separator').hide();
            presenter.$buttonsExceptOpen.addClass('hidden');

            presenter.$panel.animate({
                'width' : presenter.config.widthWhenClosed - 50 + 'px'
            }, 1000, function() {
                presenter.$panel.children('.button.open').show();
                presenter.$panel.removeClass('animationInProgress');
                presenter.$panel.removeClass('opened');
            });

            window.savedPanel.isOpen = false;
        }
    }

    function openPanel(doAnimation) {
        window.savedPanel.isOpen = true;

        function _show() {
            presenter.$buttonsExceptOpen.removeClass('hidden');
            presenter.$panel.children('.button.open').hide();
            presenter.$panel.children('.button-separator').show();
            presenter.$panel.removeClass('animationInProgress');
            presenter.$panel.addClass('opened');
            presenter.$bottomPanels.removeClass('closed-hide');
            toggleMasks();
        }

        if (doAnimation) {
            presenter.$panel.addClass('animationInProgress');
            presenter.$panel.animate({
                'width' : presenter.config.widthWhenOpened + 'px'
            }, 1000, _show);
        } else {
            _show();
            presenter.$panel.css('width', window.savedPanel.widthWhenOpened + 'px');
        }

    }

    presenter.IWBDraw = function(canvas, ctx, mousePosition) {
        var grad = ctx.createLinearGradient(0, 0, canvas[0].width, 0);
        grad.addColorStop(0, presenter.currentLineColor);
        grad.addColorStop(1, presenter.currentLineColor);

        ctx.lineWidth = presenter.currentLineWidth;
        ctx.strokeStyle = grad;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(presenter.lastMousePosition.x, presenter.lastMousePosition.y);
        ctx.lineTo(mousePosition.x, mousePosition.y);
        ctx.stroke();
    };

    function getCursorPosition(e) {
        var canvas = presenter.canvas[0];
        var rect = canvas.getBoundingClientRect();
        var header = 0;
        var scrollTop = 0;
        var canvasOffsetLeft = $(canvas).offset().left;

        if(presenter.standHideAreaClicked){
            if($('.ic_header').length){
                header = $('.ic_header').outerHeight(true);
            }
                scrollTop = $(window).scrollTop();
            if(/MSIE/i.test(navigator.userAgent)){
                scrollTop = 0;
            }
            canvasOffsetLeft = 0;
        }

        if (e.clientX) {
            return getPoint(
                parseInt(e.clientX - rect.left, 10),
                parseInt(e.clientY - rect.top, 10) + scrollTop - header
            );
        }

        var t = event.targetTouches[0] || event.touches[0] || event.changedTouches[0];
        return getPoint(
            parseInt(t.pageX - canvasOffsetLeft, 10),
            parseInt(t.pageY - $(canvas).offset().top, 10) + scrollTop - header
        );
    }

    function changeDrawingType(button) {
        var activeButton = presenter.$pagePanel.find('.clicked');

        if ($(button).parent().parent().hasClass('bottom-panel-thickness')) { // is changing thickness
            var thickness = $(button).attr('thickness'),
                drawingType = activeButton.hasClass('pen') ? 'pen' : 'marker';

            changeThickness(presenter.DRAWING_DATA['thickness'][drawingType][thickness], button);
        } else {
            var color = $(button).attr('color');
            changeColor(presenter.DRAWING_DATA['color'][color], button);
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

        if (panel.is(':visible')) {
            panel.hide();
        } else {
            panel.show();
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

    function drawingLogic() {
        $(presenter.canvas).off('mousedown mousemove mouseup touchstart touchmove touchend');
        $(presenter.markerCanvas).off('mousedown mousemove mouseup touchstart touchmove touchend');

        var lastEvent = null;

        $(presenter.canvas).on('mousedown', mouseDownHandler);
        $(presenter.canvas).on('touchstart', function(e) {
            mouseDownHandler(e)
        });
        $(presenter.markerCanvas).on('mousedown', mouseDownHandler);
        $(presenter.markerCanvas).on('touchstart', function(e) {
            mouseDownHandler(e)
        });

        function mouseDownHandler(e) {
            e.stopPropagation();
            e.preventDefault();
            lastEvent = e;
            presenter.lastMousePosition = getCursorPosition(e);
            presenter.isMouseDown = true;
        }

        $(presenter.canvas).on('mousemove', mouseMoveHandler);
        $(presenter.canvas).on('touchmove', function(e) {
            mouseMoveHandler(e);
        });
        $(presenter.markerCanvas).on('mousemove', mouseMoveHandler);
        $(presenter.markerCanvas).on('touchmove', function(e) {
            mouseMoveHandler(e);
        });

        function mouseMoveHandler(e) {
            if (presenter.isMouseDown) {
                e.stopPropagation();
                e.preventDefault();
                if (presenter.drawMode == presenter.DRAW_MODE.MARKER) {
                    presenter.IWBDraw(presenter.markerCanvas, presenter.markerCtx, getCursorPosition(e));
                } else if (presenter.drawMode == presenter.DRAW_MODE.PEN) {
                    presenter.IWBDraw(presenter.canvas, presenter.ctx, getCursorPosition(e));
                } else if (presenter.drawMode == presenter.DRAW_MODE.ERASER) {
                    presenter.IWBDraw(presenter.markerCanvas, presenter.markerCtx, getCursorPosition(e));
                    presenter.IWBDraw(presenter.canvas, presenter.ctx, getCursorPosition(e));
                }
                presenter.lastMousePosition = getCursorPosition(e);
            }

            lastEvent = e;
        }

        $(presenter.canvas).on('mouseup', mouseUpHandler);
        $(presenter.canvas).on('touchend', function(e) {
            mouseUpHandler(e);
        });
        $(presenter.markerCanvas).on('mouseup', mouseUpHandler);
        $(presenter.markerCanvas).on('touchend', function(e) {
            mouseUpHandler(e);
        });

        function mouseUpHandler(e) {
            e.stopPropagation();
            e.preventDefault();
            lastEvent = e;

            presenter.isMouseDown = false;
        }
    }

    function setBasicConfiguration(view, model) {
        presenter.$view = $(view);
        presenter.$panel = $(view).find('.iwb-toolbar-panel');
        presenter.$panel.attr('id', model['ID'] + '-panel');
        presenter.$pagePanel = presenter.$view.parent().parent('.ic_page_panel');
        presenter.$icplayer = presenter.$panel.parents('.ic_player').parent();
        presenter.$defaultThicknessButton = presenter.$panel.find('.thickness-1');
        presenter.$defaultColorButton = presenter.$panel.find('.color-blue');
        window.$icplayer = presenter.$icplayer;
        presenter.isInFrame = window.parent.location != window.location;
        presenter.$buttonsExceptOpen = presenter.$panel.children('.button:not(.open)');
        presenter.buttonWidth = presenter.$buttonsExceptOpen.width();

        presenter.$view.parent().append(presenter.$panel);

        changeCursor('default');
        presenter.$view.disableSelection();
        presenter.$removeConfirmationBox = presenter.$view.find('.confirmation-remove-note');
        presenter.$removeConfirmationBox.attr('id', 'confirmationBox-' + model['ID']);
        presenter.$pagePanel.find('.ic_page').append(presenter.$removeConfirmationBox);
        presenter.$removeConfirmationBoxClock = presenter.$view.find('.confirmation-remove-clock');
        presenter.$removeConfirmationBoxClock.attr('id', 'confirmationBox-' + model['ID']);
        presenter.$pagePanel.find('.ic_page').append(presenter.$removeConfirmationBoxClock);
        presenter.$removeConfirmationBoxStopwatch = presenter.$view.find('.confirmation-remove-stopwatch');
        presenter.$removeConfirmationBoxStopwatch.attr('id', 'confirmationBox-' + model['ID']);
        presenter.$pagePanel.find('.ic_page').append(presenter.$removeConfirmationBoxStopwatch);

        presenter.$bottomPanels = $('.bottom-panel-color, .bottom-panel-thickness, .bottom-panel-floating-image');

        presenter.config = validateModel(model);
    }

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

        if (model['widthWhenOpened']) {
            validated = ModelValidationUtils.validatePositiveInteger(model['widthWhenOpened']);
        } else {
            validated = getCorrectObject(538);
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

        return {
            'isValid' : true,

            'widthWhenClosed' : widthWhenClosed,
            'widthWhenOpened' : widthWhenOpened,
            'panelPosition' : model['Fixed Position'] == 'True' ? 'absolute' : 'fixed',

            'showForPen' : ModelValidationUtils.validateOption(presenter.SHOW_PANEL, model.forPen),
            'showForMarker' : ModelValidationUtils.validateOption(presenter.SHOW_PANEL, model.forMarker)
        }
    }

    function setImagePosition() {
        var topPosition = parseInt(/*$(window).scrollTop() + */(getCurrentImage().height() / 2)+ presenter.$panel.offset().top, 10);
        var leftPosition = parseInt((getCurrentImage().width() / 2) + presenter.$panel.position().left, 10);

        presenter.floatingImageLayer.draw();
        getCurrentImage().setAbsolutePosition(getPoint(leftPosition, topPosition));
        getCurrentMoveIcon().setAbsolutePosition(getPoint(leftPosition - 10, topPosition - 20));
        getCurrentRotateIcon().setAbsolutePosition(getPoint(leftPosition - 10, topPosition - 20));
        presenter.floatingImageLayer.draw();
    }

    function addEventHandlers() {
        var eventClickStart;
        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            eventClickStart = 'touchstart';
        }else{
            eventClickStart = 'mousedown';
        }

        presenter.$pagePanel.find('.iwb-toolbar-mask').click(function(e) {
            e.stopPropagation();
        });

        presenter.$pagePanel.find('.iwb-toolbar-note').click(function(e) {
            e.stopPropagation();
        });

        presenter.$panel.click(function(e) {
            e.stopPropagation();
        });

        presenter.$panel.find('.open').on(eventClickStart, function(e) {
            e.stopPropagation();
            e.preventDefault();

            if (!presenter.isPanelOpened) {
                openPanel(true);
            }

            presenter.isPanelOpened = true;
        });

        presenter.$panel.find('.close').on(eventClickStart, function(e) {
            e.stopPropagation();
            e.preventDefault();

            closePanel();
            presenter.isPanelOpened = false;
        });

        presenter.$pagePanel.find('.button').on(eventClickStart, function(e) {
            e.stopPropagation();
            e.preventDefault();

            changeButtonState(this);

            if (isDependingOnDrawing(this) && areDrawingButtonsActive() || isFloatingImageButton(this)) {
                openBottomPanel(this);
            }

            if ($(this).hasClass('reset')) {
                $(this).removeClass('clicked');
            }
        });

        presenter.$pagePanel.find('.button-drawing-details').on(eventClickStart, function(e) {
            e.stopPropagation();
            e.preventDefault();
            changeBottomButtonState(this);

            changeDrawingType(this);
        });

        presenter.$pagePanel.find('.button-floating-image').on(eventClickStart, function(e) {
            e.stopPropagation();
            e.preventDefault();
            changeBottomButtonState(this);

            changeCurrentFloatingImage(parseInt($(this).attr('index'), 10));
            setImagePosition();
        });

        presenter.$pagePanel.find('.pen').on(eventClickStart, function() {
            presenter.$defaultColorButton = presenter.$panel.find('.color-blue');
            changeColor(presenter.data.penColor);
            changeThickness(1);
            toggleMasks();

            presenter.ctx.globalCompositeOperation = 'source-over';
            presenter.drawMode = presenter.DRAW_MODE.PEN;

            drawingLogic();

            toggleBottomPanels();
        });

        presenter.$pagePanel.find('.marker').on(eventClickStart, function() {
            presenter.$defaultColorButton = presenter.$panel.find('.color-yellow');
            changeColor(presenter.data.markerColor);
            changeThickness(10);
            toggleMasks();

            presenter.markerCtx.globalCompositeOperation = 'source-over';
            presenter.drawMode = presenter.DRAW_MODE.MARKER;

            drawingLogic();

            toggleBottomPanels();
        });

        presenter.$pagePanel.find('.eraser').on(eventClickStart, function(e) {
            e.stopPropagation();
            e.preventDefault();

            if (presenter.ctx) {
                presenter.ctx.globalCompositeOperation = 'destination-out';
            }
            if (presenter.markerCtx) {
                presenter.markerCtx.globalCompositeOperation = 'destination-out';
            }
            changeColor('rgba(0, 0, 0, 1)');
            changeThickness(20);
            presenter.drawMode = presenter.DRAW_MODE.ERASER;
            drawingLogic();
            toggleMasks();
        });

        presenter.$pagePanel.find('.reset').on(eventClickStart, function(e) {
            e.stopPropagation();
            e.preventDefault();

            presenter.selectingCtx.clearRect(0, 0, presenter.$selectingMask.width(), presenter.$selectingMask.height());
            presenter.ctx.clearRect(0, 0, presenter.$penMask.width(), presenter.$penMask.height());
            presenter.markerCtx.clearRect(0, 0, presenter.$markerMask.width(), presenter.$markerMask.height());

            presenter.areas = [];
            presenter.drawMode = presenter.DRAW_MODE.NONE;

            reset(true, false, false, false, false);
        });

        presenter.$pagePanel.find('.hide-area').on(eventClickStart, function(e) {
            toggleMasks();
            drawAreaLogic(true);

            presenter.drawMode = presenter.DRAW_MODE.HIDE_AREA;
            presenter.$defaultColorButton = presenter.$panel.find('.color-black');
            changeColor('#000');
        });

        presenter.$pagePanel.find('.stand-area').on(eventClickStart, function(e) {
            toggleMasks();
            drawAreaLogic(false);

            presenter.drawMode = presenter.DRAW_MODE.STAND_AREA;
            presenter.$defaultColorButton = presenter.$panel.find('.color-black');
            changeColor('#000');
        });

        presenter.$pagePanel.find('.zoom').on(eventClickStart, function(e) {
            e.stopPropagation();
            e.preventDefault();

            presenter.isZoomActive = !presenter.isZoomActive;
            presenter.$bottomPanels.hide();

            if (!presenter.isZoomActive) {
                changeCursor('default');
            } else {
                changeCursor('zoom-in');
            }

            var lastEvent = null;
            presenter.modules = presenter.$pagePanel.find('.ic_page > div:not(.iwb-toolbar-panel,.iwb-toolbar-note,.iwb-toolbar-clock,.iwb-toolbar-stopwatch,.confirmation-remove-note)');

            presenter.$pagePanel.disableSelection();

            if (presenter.areZoomEventHandlersAttached) {
                // We cannot attach multiple times the same event handlers
                return;
            }

            presenter.modules.on('click mousedown mouseup', function(e) {
                if (!presenter.isZoomActive) return;

                e.stopPropagation();
                e.preventDefault();
            });

            presenter.modules.find('a').on('click', function(e) {
                if (!presenter.isZoomActive) return;

                e.stopPropagation();
                e.preventDefault();
            });

            presenter.modules.on('mousedown', function(e) {
                if (!presenter.isZoomActive) return;

                e.stopPropagation();
                e.preventDefault();
                lastEvent = e;
                presenter.isMouseDown= true;
            });

            presenter.modules.on('mouseup', function(e) {
                if (!presenter.isZoomActive) return;

                e.stopPropagation();
                e.preventDefault();
                presenter.isMouseDown = false;

                if (lastEvent.type == 'mousedown' &&
                    !$(e.currentTarget).hasClass('iwb-toolbar-panel') &&
                    !$(e.currentTarget).hasClass('addon_IWB_Toolbar') &&
                    !$(e.currentTarget).hasClass('iwb-toolbar-note') &&
                    !$(e.currentTarget).hasClass('iwb-toolbar-clock') &&
                    !$(e.currentTarget).hasClass('iwb-toolbar-stopwatch')) { // click

                    zoomSelectedModule(e.currentTarget);
                }
                lastEvent = e;
            });

            presenter.modules.on('mousemove', function(e) {
                if (!presenter.isZoomActive) return;

                if (presenter.isMouseDown) {
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

            presenter.areZoomEventHandlersAttached = true;
        });

        presenter.$pagePanel.find('.clock').on(eventClickStart, function(e) {
            e.stopPropagation();
            e.preventDefault();
            presenter.$pagePanel.find('.clock').on('mousedown', function() {
                presenter.$pagePanel.find('.clock').addClass('clicked');
            });
            presenter.$pagePanel.find('.clock').on('mouseup', function() {
                presenter.$pagePanel.find('.clock').removeClass('clicked');
            });
            createClock();
        });

        presenter.$pagePanel.find('.stopwatch').on(eventClickStart, function(e) {
            e.stopPropagation();
            e.preventDefault();
            presenter.$pagePanel.find('.stopwatch').on('mousedown', function() {
                presenter.$pagePanel.find('.stopwatch').addClass('clicked');
            });
            presenter.$pagePanel.find('.stopwatch').on('mouseup', function() {
                presenter.$pagePanel.find('.stopwatch').removeClass('clicked');
            });
            createStopwatch();
        });

        presenter.$pagePanel.find('.note').on(eventClickStart, function(e){
            e.preventDefault();
            e.stopPropagation();
            var note = createNote();

            presenter.$pagePanel.find('.ic_page').append(note);
            presenter.$pagePanel.find('.iwb-toolbar-note').click(function(e) {
                e.stopPropagation();
            });
            presenter.$pagePanel.find('.note').on('mousedown', function() {
                presenter.$pagePanel.find('.note').addClass('clicked');
            });
            presenter.$pagePanel.find('.note').on('mouseup', function() {
                presenter.$pagePanel.find('.note').removeClass('clicked');
            });
        });


        presenter.$pagePanel.find('.default').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
        });

        presenter.$pagePanel.find('.floating-image').on(eventClickStart, function() {
            $.when.apply($, presenter.allImagesLoadedPromises).then(function() {
                var display = presenter.$pagePanel.find('.floating-image-mask').css('display');
                if (display == 'none') {
                    presenter.$floatingImageMask.show();
                } else {
                    presenter.$floatingImageMask.hide();
                    presenter.$pagePanel.find('.floating-image').removeClass('clicked');
                    presenter.$pagePanel.find('.bottom-panel-floating-image').hide();
                }
                setImagePosition();
            });
        });
    }

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

    function calculateVectorsAngle(v1, v2) {
        return Math.acos((v1.x * v2.x + v1.y * v2.y) / (v1.length * v2.length));
    }

    function changeCurrentFloatingImage(index) {
        $.when.apply($, presenter.allImagesLoadedPromises).then(function() {
            presenter.$panel.find('.button-floating-image-' + (index + 1)).addClass('clicked-lighter');
            getCurrentGroup().visible(false);
            presenter.currentFloatingImageIndex = index;
            getCurrentGroup().visible(true);
            presenter.floatingImageLayer.draw();

            var isMouseDown = false,
                startingVector = null;

            function rotateActionStartHandler() {
                if (presenter.floatingImageMode == presenter.FLOATING_IMAGE_MODE.ROTATE) {
                    isMouseDown = true;
                    var imageCenter = {
                        x: (getCurrentImage().getAbsolutePosition().x),
                        y: (getCurrentImage().getAbsolutePosition().y)
                    };

                    startingVector = new Vector(imageCenter, presenter.floatingImageStage.getPointerPosition());
                }
            }

            presenter.$floatingImageMask.off('mousedown touchstart mouseup touchend touchmove mousemove');
            presenter.$floatingImageMask.on('mousedown', rotateActionStartHandler);
            presenter.$floatingImageMask.on('touchstart', rotateActionStartHandler);

            function rotateActionEndHandler() {
                if (presenter.floatingImageMode == presenter.FLOATING_IMAGE_MODE.ROTATE) {
                    isMouseDown = false;
                }
            }

            presenter.$floatingImageMask.on('mouseup', rotateActionEndHandler);
            presenter.$floatingImageMask.on('touchend', rotateActionEndHandler);

            var previousPosition = null;

            function rotateActionMoveHandler() {
                var currentPosition = presenter.floatingImageStage.getPointerPosition();

                if (isMouseDown && presenter.floatingImageMode == presenter.FLOATING_IMAGE_MODE.ROTATE && previousPosition) {
                    var imageCenter = {
                        x: (getCurrentImage().getAbsolutePosition().x),
                        y: (getCurrentImage().getAbsolutePosition().y)
                    };

                    var currentVector = new Vector(imageCenter, presenter.floatingImageStage.getPointerPosition());
                    var angle = calculateVectorsAngle(startingVector, currentVector);
                    var isLeft = presenter.isLeft(imageCenter, previousPosition, currentPosition);

                    getCurrentImage().rotate(isLeft ? angle : -angle);
                    presenter.floatingImageLayer.draw();
                }

                previousPosition = currentPosition;
            }

            presenter.$floatingImageMask.on('mousemove', rotateActionMoveHandler);
            presenter.$floatingImageMask.on('touchmove', rotateActionMoveHandler);
        });
    }

    function addFloatingImages(model) {
        var $mask = $('<div class="iwb-toolbar-mask floating-image-mask"></div>');
        presenter.$pagePanel.find('.ic_page').append($mask);
        $mask.hide();

        var stage = new Kinetic.Stage({
            container: $mask[0],
            visible: true,
            width: presenter.$pagePanel.width(),
            height: presenter.$pagePanel.height()
        });

        var layer = new Kinetic.Layer();

        presenter.$floatingImageMask = $mask;
        presenter.floatingImageLayer = layer;
        presenter.floatingImageStage = stage;
        presenter.allImagesLoadedPromises = [];

        for (var index = 0; index < 3; index++) {
            var imageObj = new Image(),
                deferredImage = new $.Deferred();

            (function(deferredImage, index, imageObj) {
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

                    applyDoubleTapHandler(group, applyOnDblClickHandler);

                    var imageMoveObj = new Image();
                    $(imageMoveObj).load(function() {
                        var moveIcon = new Kinetic.Image({
                            x: (imageObj.width / 2) - 16, // -16, czyli połowa szerokości obrazka
                            y: (imageObj.height / 2) - 16 + presenter.$panel.offset().top, // -16, czyli połowa wysokości obrazka
                            image: imageMoveObj,
                            opacity: 0.4
                        });

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

                            deferredImage.resolve();
                        });
                        imageRotateObj.src = DOMOperationsUtils.getResourceFullPath(presenter.playerController, 'addons/resources/it_rotate.png');

                    });
                    imageMoveObj.src = DOMOperationsUtils.getResourceFullPath(presenter.playerController, 'addons/resources/it_move.png');

                });
                presenter.allImagesLoadedPromises.push(deferredImage.promise());
            })(deferredImage, index, imageObj);

            if (model['floatingImages'] && model['floatingImages'][index] && model['floatingImages'][index]['Image'].length > 0) {
                imageObj.src = model['floatingImages'][index]['Image'];
            } else {
                imageObj.src = DOMOperationsUtils.getResourceFullPath(presenter.playerController, 'addons/resources/' + presenter.DEFAULT_FLOATING_IMAGE[index]);
            }
        }
    }

    function runLogic(view, model, isPreview) {

        presenter.isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        if (!isPreview) {
            presenter.headerLoadedDeferred = new $.Deferred();
            presenter.headerLoaded = presenter.headerLoadedDeferred.promise();

            Kinetic.pixelRatio = 1;

            setBasicConfiguration(view, model);

            if (!presenter.config.isValid) {
                DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.ERROR_CODES, presenter.config.errorCode);
                return;
            }

            addFloatingImages(model);
            createCanvases();

            presenter.$panel.draggable({
                containment: 'parent',
                opacity: 0.35,
                create: function(event, _) {
                    $(event.target).addClass('running');
                    $(event.target).css('position', presenter.config.panelPosition);
                    if (window.savedPanel && window.savedPanel.position) {
                        $(event.target).css('top', window.savedPanel.position.top + 'px');
                        $(event.target).css('left', window.savedPanel.position.left + 'px');
                        presenter.headerLoaded.then(function() {
                            $(event.target).css('top', window.savedPanel.position.top + 'px');
                            $(event.target).css('left', window.savedPanel.position.left + 'px');
                        });
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
                        $(event.target).css('top', (offsetTopPrev +/*$(presenter.$panel).position().top + */parseInt(model['Top'], 10)) + 'px');
                        $(event.target).css('left', (offsetLeftPrev +/*$(presenter.$panel).position().left + */parseInt(model['Left'], 10)) + 'px');
                        presenter.headerLoaded.then(function() {
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
                stop: function( event, ui ) {
                    window.savedPanel.position = ui.position;
                }
            });

            applyHovered([presenter.$panel.find('.button')]);
            presenter.$panel.width(presenter.config.widthWhenClosed - 50 + 'px');

            window.savedPanel = window.savedPanel || {};

            if (window.savedPanel && window.savedPanel.isOpen) {
                openPanel(false);
            } else {
                window.savedPanel.widthWhenOpened = presenter.config.widthWhenOpened;
            }

            addEventHandlers();
            if (presenter.isInFrame && presenter.config.panelPosition == 'fixed') {
                addScrollHandler();
            }
            $(view).hide();
            presenter.setVisibility(presenter.isVisible, false, view);
        } else {
            presenter.setVisibility(presenter.isVisible, true, view);
            $(view).find('.iwb-toolbar-panel').width(model['Width'] - 50 + 'px');
        }
    }

    presenter.isOnScreen = function (element, windowElement) {
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

        return !(coords.right < bounds.left || coords.left > bounds.right || coords.bottom < bounds.top || coords.top > bounds.bottom);
    };

    function addScrollHandler() {
        var difference = 0,
            lastScrollTop = 0,
            panelTop = 0;

        $(window.parent.document).scroll(function() {
            if (presenter.isOnScreen(presenter.$view.parent(), window)) {
            var containerHeight = presenter.$pagePanel.outerHeight(true),
                scrollTop = $(this).scrollTop(),
                min = presenter.$pagePanel.offset().top,
                headerHeight = $('.ic_header').outerHeight(true)-20,
                max = containerHeight + headerHeight;
            difference = scrollTop - lastScrollTop;
            panelTop = parseInt(presenter.$panel.css('top'), 10) + difference;
            lastScrollTop = scrollTop;

                if (panelTop && (panelTop) > min && (panelTop) < max) {
                    presenter.$panel.css({
                        'top' : (panelTop) + 'px'
                    });
                } else if (panelTop && (panelTop) >= max) {
                    presenter.$panel.css({
                        'top' : (containerHeight - presenter.$panel.outerHeight(true) + min) + 'px'
                    });
                } else if (panelTop && (panelTop) <= min){
                    presenter.$panel.css({
                        'top' : min + 'px'
                    });
                }
            }
        });
    }

    function drawSketch() {
        var sketch = presenter.$view.parent().find('.selecting');
        var canvas = sketch.find('canvas');
        canvas.width = sketch.width;
        canvas.height = sketch.height;

        var tmp_canvas = document.createElement('canvas');
        var tmp_ctx = tmp_canvas.getContext('2d');
        tmp_canvas.id = 'tmp_canvas';
        tmp_canvas.width = canvas.width();
        tmp_canvas.height = canvas.height();

        presenter.$view.parent().find('.selecting').append(tmp_canvas);

        var mouse = getPoint(0, 0);
        var start_mouse = getPoint(0, 0);
        var header = 0;

        if($('.ic_header').length){
            header = $('.ic_header').outerHeight(true);
        }

        /* Mouse Capturing Work */
        if( /Android|X11|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            tmp_canvas.addEventListener('touchmove', function(e) {
                e.stopPropagation();
                e.preventDefault();

                mouse.x = e.changedTouches[0].pageX;
                mouse.y = e.changedTouches[0].pageY-header;
            }, false);

            tmp_canvas.addEventListener('touchstart', function(e) {
                tmp_canvas.addEventListener('touchmove', onPaint, false);

                e.stopPropagation();
                e.preventDefault();
                mouse.x = e.changedTouches[0].pageX;
                mouse.y = e.changedTouches[0].pageY-header;

                start_mouse.x = mouse.x;
                start_mouse.y = mouse.y;

                onPaint();
            }, false);

            tmp_canvas.addEventListener('touchend', function(e) {
                tmp_canvas.removeEventListener('touchmove', onPaint, false);
                e.stopPropagation();
                e.preventDefault();
                // Writing down to real canvas now
                // ctx.drawImage(tmp_canvas, 0, 0);
                // Clearing tmp canvas
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
            }, false);
        }else{
            tmp_canvas.addEventListener('mousemove', function(e) {
                e.stopPropagation();
                e.preventDefault();
                mouse.x = typeof e.offsetX !== 'undefined' ?  e.offsetX : e.layerX;
                mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
            }, false);

            tmp_canvas.addEventListener('mousedown', function(e) {
                e.stopPropagation();
                e.preventDefault();
                tmp_canvas.addEventListener('mousemove', onPaint, false);

                mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
                mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

                start_mouse.x = mouse.x;
                start_mouse.y = mouse.y;
                onPaint();
            }, false);

            tmp_canvas.addEventListener('mouseup', function(e) {
                e.stopPropagation();
                e.preventDefault();
                tmp_canvas.removeEventListener('mousemove', onPaint, false);
                // Writing down to real canvas now
                // ctx.drawImage(tmp_canvas, 0, 0);
                // Clearing tmp canvas
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
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
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            var x = Math.min(mouse.x, start_mouse.x);
            var y = Math.min(mouse.y, start_mouse.y);
            var width = Math.abs(mouse.x - start_mouse.x);
            var height = Math.abs(mouse.y - start_mouse.y);
            tmp_ctx.strokeRect(x, y, width, height);
        };
    }

    function drawAreaLogic(isHide) {
        drawSketch();

        if( /Android|X11|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            presenter.$view.parent().find('.selecting').find('#tmp_canvas').on('touchstart', function (event) {
                presenter.standHideAreaClicked = true;
                event.stopPropagation();
                event.preventDefault();
                var pos = getCursorPosition(event.originalEvent);
                presenter.startSelection = getPoint(pos.x, pos.y);
            });

            presenter.$view.parent().find('.selecting').find('#tmp_canvas').on('touchend', function (event) {
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
            });
        }else{
            presenter.$view.parent().find('.selecting').find('#tmp_canvas').on('mousedown', function (event) {
                event.stopPropagation();
                event.preventDefault();

                presenter.standHideAreaClicked = true;
                var pos = getCursorPosition(event.originalEvent);
                presenter.startSelection = getPoint(pos.x, pos.y);
            });

            presenter.$view.parent().find('.selecting').find('#tmp_canvas').on('mouseup', function (event) {
                event.stopPropagation();
                event.preventDefault();

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
            });
        }
    }

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
            if (this.isHide) {
                drawHideArea(presenter.selectingCtx, this.x, this.y, this.width, this.height, this.color);
            } else {
                drawStandArea(presenter.selectingCtx, this.x, this.y, this.width, this.height, this.color);
            }
        });
    }

    function createStopwatch(savedStopwatch, hours, minutes, seconds, stopClicked, startClicked) {
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
                    stopwatch.remove();
                    presenter.$panel.find('.stopwatch.clicked').removeClass('clicked');
                    presenter.stopwatchAdded = false;
                    clearTimeout(t);
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
                            'top' : savedStopwatch ? savedStopwatch.top : top,
                            'left' : savedStopwatch ? savedStopwatch.left : presenter.$panel.css('left'),
                            'position' : 'absolute'
                        });
                    }
                });

                presenter.$pagePanel.find('.ic_page').append(stopwatch);
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').click(function(e) {
                    e.stopPropagation();
                });
            }

            var h1 = document.getElementsByClassName('stopwatch-time')[0],
                start = document.getElementById('start'),
                stop = document.getElementById('stop'),
                clear = document.getElementById('clear');
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

            var t;

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
                t = setTimeout(add, 1000);
            }

            function clearClickedButtons (){
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#start').removeClass('button-clicked');
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#stop').removeClass('button-clicked');
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#clear').removeClass('button-clicked');
            }

            start.onclick = function(){
                if (!presenter.startButtonClicked) {
                    clearClickedButtons();
                    presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#start').addClass('button-clicked');
                    timer();
                    presenter.stopButtonClicked = false;
                    presenter.startButtonClicked = true;
                }
            };
            stop.onclick = function() {
                clearClickedButtons();
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#stop').addClass('button-clicked');
                clearTimeout(t);
                presenter.stopButtonClicked = true;
                presenter.startButtonClicked = false;
            };
            clear.onclick = function() {
                clearClickedButtons();
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#clear').addClass('button-clicked');
                h1.textContent = "00:00:00";
                presenter.seconds = 0; presenter.minutes = 0; presenter.hours = 0;
                presenter.stopButtonClicked = false;
            }
        }
        presenter.stopwatchAdded = true;
    }

    function createClock(savedClock) {
        var clock = $('<div class="iwb-toolbar-clock"></div>'),
            header = $('<div class="clock-header"></div>'),
            closeButton = $('<div class="clock-close">&times;</div>'),
            clockBody = $('<div class="clock-body"></div>');

        closeButton.on('click', function(e) {
            e.stopPropagation();
            clock.remove();
            presenter.$panel.find('.clock.clicked').removeClass('clicked');
            presenter.clockAdded = false;
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

        if (!presenter.clockAdded) {
            clock.draggable({
                containment: 'parent',
                opacity: 0.35,
                create: function(event, _) {
                    $(event.target).css({
                        'top' : savedClock ? savedClock.top : top,
                        'left' : savedClock ? savedClock.left : presenter.$panel.css('left'),
                        'position' : 'absolute'
                    });
                }
            });

            presenter.$pagePanel.find('.ic_page').append(clock);
            presenter.$pagePanel.find('.iwb-toolbar-clock').click(function(e) {
                e.stopPropagation();
            });
        }
        presenter.clockAdded = true;

        function getTime() {
            var date = new Date();
            return addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
        }

        presenter.$pagePanel.find('.iwb-toolbar-clock').find('.clock-body').html(getTime());

        setInterval(function() {
            presenter.$pagePanel.find('.iwb-toolbar-clock').find('.clock-body').html(getTime());
        }, 1000);
    }

    function createNote(savedNote) {
        var note = $('<div class="iwb-toolbar-note"></div>'),
            header = $('<div class="note-header"></div>'),
            date = $('<div class="note-date"></div>'),
            closeButton = $('<div class="note-close">&times;</div>'),
            noteBody = $('<div class="note-body"></div>'),
            currentDate = '';

        if (savedNote) {
            currentDate = savedNote.date;
            noteBody.html(savedNote.body);
        } else {
            var day = new Date().getDate(),
                month = new Date().getMonth() + 1,
                year = new Date().getFullYear(),
                hours = new Date().getHours(),
                minutes = new Date().getMinutes();

            var time = addZero(hours) + ':' + addZero(minutes);
            currentDate = day + '/' + month + '/' + year + ', ' + time;
        }

        var eventClickStart;
        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            eventClickStart = 'touchstart';
        }else{
            eventClickStart = 'mousedown';
        }

        closeButton.on('click', function(e) {
            e.stopPropagation();
            var confirmation = presenter.$removeConfirmationBox;
            confirmation.css('top', $(window).scrollTop() + 10 + 'px');
            confirmation.show();
            confirmation.find('.no-button').on(eventClickStart, function(e) {
                e.stopPropagation();
                confirmation.hide();
            });
            confirmation.find('.yes-button').on(eventClickStart, function(e) {
                e.stopPropagation();
                note.remove();
                confirmation.hide();
            });
        });

        date.html(currentDate);
        header.append(date);
        header.append(closeButton);
        note.append(header);
        note.append(noteBody);

        applyNoteEditHandler(note, noteBody);

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
            top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + scrollTop - presenter.$pagePanel.offset().top - 120;
        } else {
            top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + scrollTop - offsetTopelement;
        }

        note.draggable({
            containment: 'parent',
            opacity: 0.35,
            create: function(event, _) {
                $(event.target).css({
                    'top' : savedNote ? savedNote.top : top,
                    'left' : savedNote ? savedNote.left : presenter.$panel.css('left'),
                    'position' : 'absolute'
                });
            }
        });
        
        return note;
    }


    function applyNoteEditHandler(note, noteBody) {
        note.on('dblclick', function() {
            noteEditHandler(note, noteBody);
            note.off('dblclick');
        });

//        applyDoubleTapHandler(note, function() {
//            noteEditHandler(note, noteBody);
//        });
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            note.on('doubletap', function(e) {
                noteEditHandler(note, noteBody);
                note.off('doubletap');
            });
        }
    }

    function noteEditHandler(note, noteBody) {
        var currentValue = noteBody.html(),
            $textarea = $('<textarea></textarea>'),
            $buttonSave = $('<button class="save">Save</button>');

        $buttonSave.on('click', function() {
            var value = $textarea.val();
            noteBody.html(value);
            $textarea.remove();
            applyNoteEditHandler(note, noteBody);
        });

        $textarea.on('click', function (){
            var val = $textarea.val();
            $textarea.focus().val("").val(val);
        });

        $textarea.val(currentValue);

        noteBody.html($textarea);
        noteBody.append($buttonSave);
        $textarea.focus();
    }

    function zoomSelectedModule(selectedModule) {
        if (presenter.$pagePanel.find('.zoomed').length > 0) {
            presenter.$panel.show();
            zoom.out();
            $(selectedModule).parent().find('.zoomed').removeClass('zoomed');
            changeCursor('zoom-in');
        } else {
            presenter.$panel.hide();
            zoom.to({
                element: selectedModule
            });
            $(selectedModule).addClass('zoomed');
            changeCursor('zoom-out');
        }
    }

    function changeCursor(type) {
        presenter.$pagePanel.removeClass('iwb-zoom-in iwb-zoom-out');

        switch (type) {
            case 'zoom-in':
                presenter.$pagePanel.addClass('iwb-zoom-in');
                break;
            case 'zoom-out':
                presenter.$pagePanel.addClass('iwb-zoom-out');
                break;
        }
    }

    function isDependingOnDrawing(button) {
        return $(button).hasClass('color') || $(button).hasClass('thickness');
    }

    function isDrawingActive() {
        return presenter.$pagePanel.find('.button.pen.clicked, .button.marker.clicked').length > 0;
    }

    function isAreaDrawingActive() {
        return presenter.$pagePanel.find(', .button.hide-area.clicked, .button.stand-area.clicked').length > 0;
    }

    function areDrawingButtonsActive() {
        return isDrawingActive() || isAreaDrawingActive();
    }

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

    function isZoomButton(button) {
        return $(button).hasClass('zoom');
    }

    function changeButtonState(button) {
        if (!isZoomButton(button)) {
            presenter.isZoomActive = false;
        }

        if (isDependingOnDrawing(button)) {
            if (areDrawingButtonsActive()) {
                presenter.$panel.find('.button.clicked-lighter').removeClass('clicked-lighter');
                $(button).toggleClass('clicked-lighter');
            }
        } else {
            var shouldClosePanels = shouldClosePanelsOnReset(button);

            reset(shouldClosePanels, false, shouldHideDrawingMasks(button), shouldHideSelectingMasks(button), shouldHideFloatingImage(button));
            if (!$(button).hasClass('open') && !$(button).hasClass('close') && !$(button).hasClass('note') && !$(button).hasClass('clock') && !$(button).hasClass('stopwatch')) {
                if ($(button).hasClass('clicked')) {
                    $(button).removeClass('clicked');
                } else {
                    presenter.$panel.find('.clicked').removeClass('clicked');
                    $(button).addClass('clicked');
                }
            }
            changeCurrentFloatingImage(presenter.currentFloatingImageIndex);
        }
    }

    function changeBottomButtonState(button) {
        presenter.$panel.find('.container .clicked-lighter').removeClass('clicked-lighter');
        $(button).toggleClass('clicked-lighter');
    }

    function toggleMasks() {
        presenter.$penMask.hide();
        presenter.$markerMask.hide();
        presenter.$selectingMask.hide();

        if (isDrawingActive() || presenter.$pagePanel.find('.eraser').hasClass('clicked')) {
            presenter.$penMask.show();
            presenter.$markerMask.show();
        }

        if (isAreaDrawingActive()) {
            presenter.$selectingMask.show();
        }
    }

    function toggleBottomPanels() {
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
    }

    function createCanvases() {
        createCanvas(
            function(mask) {
                presenter.$markerMask = mask;
                presenter.$markerMask.addClass('marker-mask');
                return presenter.$markerMask;
            },
            function(ctx) {
                presenter.markerCtx = ctx;
            },
            function(canvas) {
                presenter.markerCanvas = canvas;
            }
        );

        createCanvas(
            function(mask) {
                presenter.$penMask = mask;
                presenter.$penMask.addClass('pen-mask');
                return presenter.$penMask;
            },
            function(ctx) {
                presenter.ctx = ctx;
            },
            function(canvas) {
                presenter.canvas = canvas;
            }
        );

        createCanvas(
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

    }

    function createCanvas(setMask, setContext, setCanvas) {
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
    }

    function applyHovered(elements) {
        $.each(elements, function(_, btn) {
            $(btn).hover(function() {
                $(this).addClass('hovered');
                $(this).find('.tooltip').show();
            }, function() {
                $(this).removeClass('hovered');
                $(this).find('.tooltip').hide();
            });
        });
    }

    presenter.run = function(view, model) {
        runLogic(view, model, false);
        zoom.init();
    };

    presenter.setShowErrorsMode = function() {};

    presenter.setWorkMode = function() {};

    function reset(closePanel, shouldClearCanvas, shouldHideDrawingMasks, shouldHideSelectingMasks, shouldHideFloatingImage) {
        presenter.$panel.find('.clicked-lighter').removeClass('clicked-lighter');
        presenter.$panel.find('.hovered').removeClass('hovered');
        presenter.$pagePanel.find('.zoomed').removeClass('zoomed');
        presenter.$pagePanel.enableSelection();
        changeCursor('default');

        if (closePanel) {
            presenter.$pagePanel.find('.bottom-panel-color').hide();
            presenter.$pagePanel.find('.bottom-panel-thickness').hide();
        }

        if (shouldClearCanvas) {
            changeColor('#0fa9f0');
            changeThickness(1);
            clearCanvases();
        }

        if (shouldHideDrawingMasks) {
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
            }
        }
    }

    function changeColor(color, button) {
        if (button) {
            presenter.$panel.find('.button.color').css('background-image', $(button).css('background-image'));
        } else {
            presenter.$panel.find('.button.color').css('background-image', presenter.$defaultColorButton.css('background-image'));
        }
        presenter.currentLineColor = color;
    }

    function changeThickness(size, button) {
        if (button) {
            presenter.$panel.find('.button.thickness').css('background-image', $(button).css('background-image'));
        } else {
            presenter.$panel.find('.button.thickness').css('background-image', presenter.$defaultThicknessButton.css('background-image'));
        }
        presenter.currentLineWidth = presenter.data.defaultPenWidth === 1 ? size : presenter.data.defaultPenWidth;
    }

    function clearCanvases() {
        if (presenter.canvas) {
            presenter.canvas.off('mousemove mousedown mouseup');
            presenter.ctx.clearRect(0, 0, presenter.canvas[0].width, presenter.canvas[0].height);
        }

        if (presenter.markerCanvas) {
            presenter.markerCanvas.off('mousemove mousedown mouseup');
            presenter.markerCtx.clearRect(0, 0, presenter.markerCanvas[0].width, presenter.markerCanvas[0].height);
        }
    }

    presenter.show = function() {
        presenter.setVisibility(true, false, presenter.$view);
        presenter.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false, false, presenter.$view);
        presenter.isVisible = false;
    };

    presenter.setVisibility = function (isVisible, isPreview, view) {
        if (!isPreview) {
            presenter.$panel.css('visibility', isVisible ? 'visible' : 'hidden');
        } else {
            $(view).css('visibility', isVisible ? 'visible' : 'hidden');
        }
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'open' : presenter.open,
            'hide' : presenter.hide,
            'show' : presenter.show,
            'setPenColor' : presenter.setPenColor,
            'setMarkerColor' : presenter.setMarkerColor,
            'setDefaultPenThickness' : presenter.setDefaultPenThickness
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function() {
        presenter.$pagePanel.find('.clicked').removeClass('clicked');
        reset(true, true, true, true, true);
    };

    presenter.getErrorCount = function() { return 0; };
    presenter.getMaxScore = function() { return 0; };
    presenter.getScore = function() { return 0; };

    function getSavedNotes() {
        var notes = [];
        $.each(presenter.$pagePanel.find('.iwb-toolbar-note'), function() {
            notes.push({
                'top': $(this).css('top'),
                'left': $(this).css('left'),
                'date': $(this).find('.note-date').html(),
                'body': $(this).find('.note-body').html()
            });
            $(this).remove();
        });
        return notes;
    }

    function getSavedClocks() {
        var clocks = [];
        $.each(presenter.$pagePanel.find('.iwb-toolbar-clock'), function() {
            clocks.push({
                'top': $(this).css('top'),
                'left': $(this).css('left')
            });
            $(this).remove();
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
            $(this).remove();
        });
        return stopwatches;
    }

    presenter.getState = function() {
        zoom.out();
        var notes = getSavedNotes(),
            clocks = getSavedClocks(),
            stopwatches = getSavedStopwatches(),
            drawings = {
                'pen' : presenter.canvas ? presenter.canvas[0].toDataURL('image/png') : null,
                'marker' : presenter.markerCanvas ? presenter.markerCanvas[0].toDataURL('image/png') : null
            };
        clearCanvases();

        return JSON.stringify({
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
            'isVisible' : presenter.isVisible
        });
    };

    presenter.setState = function(state) {
        var parsed = JSON.parse(state);
        presenter.areas = parsed.areas;
        presenter.notes = parsed.notes;
        presenter.clocks = parsed.clocks;
        presenter.stopwatches = parsed.stopwatches;
        setDrawingState(new Image(), presenter.ctx, parsed.drawings.pen);
        setDrawingState(new Image(), presenter.markerCtx, parsed.drawings.marker);

        $.each(presenter.notes, function() {
            var note = createNote(this);
            presenter.$pagePanel.find('.ic_page').append(note);
        });

        $.each(presenter.clocks, function() {
            createClock(this);
        });

        $.each(presenter.stopwatches, function() {
            createStopwatch(this, parsed.hours, parsed.minutes, parsed.seconds, parsed.stopClicked, parsed.startClicked);
        });

        drawSavedAreas();
        presenter.isVisible = parsed.isVisible;
        presenter.setVisibility(presenter.isVisible, false, presenter.$view);
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
        changeThickness(presenter.data.defaultPenWidth);
    };

    return presenter;
}
