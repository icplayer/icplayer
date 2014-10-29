function AddonIWB_Toolbar_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.areas = [];
    presenter.notes = [];
    presenter.clocks = [];
    presenter.stopwatches = [];
    presenter.currentLineColor = ['#0fa9f0', '#0fa9f0'];
    presenter.currentLineWidth = 1;
    presenter.isMouseDown = false;
    presenter.lastMousePosition = {};
    presenter.floatingImageGroups = {};
    presenter.currentFloatingImageIndex = 0;

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
            'black' : ['#000', '#000'],
            'white' : ['#fff', '#fff'],
            'yellow' : ['#FFFF66', '#FFFF66'],
            'red' : ['#cf304b', '#cf304b'],
            'orange' : ['#FF9900', '#FF9900'],
            'blue' : ['#0fa9f0', '#0fa9f0'],
            'violet' : ['#990099', '#990099'],
            'green' : ['#05fa98', '#05fa98']
        },
        'thickness' : {
            'pen' : {
                '1' : 1,
                '2' : 3,
                '3' : 5,
                '4' : 7
            },
            'marker' : {
                '1' : 10,
                '2' : 15,
                '3' : 20,
                '4' : 25
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
        'E01' : 'Width can NOT be negative.'
    };

    presenter.createPreview = function(view, model) {
        runLogic(view, model, true);
    };

    function closePanel() {
        if (!presenter.$panel.hasClass('animationInProgress')) {

            presenter.$panel.addClass('animationInProgress');
            presenter.$panel.children('.button-separator').hide();
            presenter.$buttonsExceptOpen.addClass('hidden');

            presenter.$panel.animate({
                'width' : presenter.config.widthWhenClosed + 'px'
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
//        presenter.$buttonsExceptOpen.css('width', presenter.buttonWidth);

        function _show() {
            presenter.$buttonsExceptOpen.removeClass('hidden');
            presenter.$panel.children('.button.open').hide();
            presenter.$panel.children('.button-separator').show();
            presenter.$panel.removeClass('animationInProgress');
            presenter.$panel.addClass('opened');
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
        grad.addColorStop(0, presenter.currentLineColor[0]);
        grad.addColorStop(1, presenter.currentLineColor[1]);

        ctx.lineWidth = presenter.currentLineWidth;
        ctx.strokeStyle = grad;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();

        ctx.moveTo(presenter.lastMousePosition.x, presenter.lastMousePosition.y);
        ctx.lineTo(mousePosition.x, mousePosition.y);

        ctx.stroke();
    };

    function fixTouch (touch) {
        var winPageX = window.pageXOffset,
            winPageY = window.pageYOffset,
            x = touch.clientX,
            y = touch.clientY;

        if (touch.pageY === 0 && Math.floor(y) > Math.floor(touch.pageY) ||
            touch.pageX === 0 && Math.floor(x) > Math.floor(touch.pageX)) {
            // iOS4 clientX/clientY have the value that should have been
            // in pageX/pageY. While pageX/page/ have the value 0
            x = x - winPageX;
            y = y - winPageY;
        } else if (y < (touch.pageY - winPageY) || x < (touch.pageX - winPageX) ) {
            // Some Android browsers have totally bogus values for clientX/Y
            // when scrolling/zooming a page. Detectable since clientX/clientY
            // should never be smaller than pageX/pageY minus page scroll
            x = touch.pageX - winPageX;
            y = touch.pageY - winPageY;
        }

        return {
            x: x,
            y: y
        };
    }

    function getCursorPosition(e) {
        var client = {
            x: typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX,
            y: typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY
        };

        if (e.type == 'touchmove' || e.type == 'touchstart') {
            client = fixTouch(event.touches[0] || event.changedTouches[0]);
        }

        return {
            x: parseInt(client.x, 10),
            y: parseInt(client.y, 10)
        };

    }

    function changeDrawingType(button) {
        var activeButton = presenter.$pagePanel.find('.clicked');
        if ($(button).parent().parent().hasClass('bottom-panel-thickness')) { // is changing thickness
            var thickness = $(button).attr('thickness'),
                drawingType = activeButton.hasClass('pen') ? 'pen' : 'marker';

            changeThickness(presenter.DRAWING_DATA['thickness'][drawingType][thickness], button);
        } else {
            var color = $(button).attr('color'),
                drawingType = (activeButton.hasClass('pen') || activeButton.hasClass('hide-area') || activeButton.hasClass('stand-area'))   ? 'pen' : 'marker';

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
        //presenter.$pagePanel = presenter.$view.parents('.ic_player').find('.ic_page').parent('.ic_page_panel');
        presenter.$pagePanel = $('.ic_page:last').parent('.ic_page_panel');
        presenter.$icplayer = presenter.$panel.parents('.ic_player').parent();
        presenter.$defaultThicknessButton = presenter.$panel.find('.thickness-1');
        presenter.$defaultColorButton = presenter.$panel.find('.color-blue');
        window.$icplayer = presenter.$icplayer;
        presenter.isInFrame = window.parent.location != window.location;
        presenter.$buttonsExceptOpen = presenter.$panel.children('.button:not(.open)');
        presenter.buttonWidth = presenter.$buttonsExceptOpen.width();
        $('.ic_page:last').append(presenter.$panel);
        presenter.$pagePanel.css('cursor', 'initial');
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
        presenter.config = validateModel(model);
    }

    function validateModel(model) {
        var validated,
            widthWhenOpened,
            widthWhenClosed;

        if (model['widthWhenOpened']) {
            validated = ModelValidationUtils.validatePositiveInteger(model['widthWhenOpened']);
        } else {
            validated = {
                isValid: true,
                value: 538
            }
        }

        if (!validated.isValid) {
            return {
                'isValid' : false,
                'errorCode' : 'E01'
            }
        }

        widthWhenOpened = validated.value;

        if (model['widthWhenClosed']) {
            validated = ModelValidationUtils.validatePositiveInteger(model['widthWhenClosed']);
        } else {
            validated = {
                isValid: true,
                value: 30
            }
        }

        if (!validated.isValid) {
            return {
                'isValid' : false,
                'errorCode' : 'E01'
            }
        }

        widthWhenClosed = validated.value;

        return {
            'widthWhenClosed' : widthWhenClosed,
            'widthWhenOpened' : widthWhenOpened,
            'isValid' : true
        }
    }

    function addEventHandlers() {
//        presenter.$pagePanel.on('click', function(e) {
//            e.stopPropagation();
//        });

        presenter.$pagePanel.find('.iwb-toolbar-mask').click(function(e) {
            e.stopPropagation();
        });

        presenter.$pagePanel.find('.iwb-toolbar-note').click(function(e) {
            e.stopPropagation();
        });

        presenter.$panel.click(function(e) {
            e.stopPropagation();
        });

        presenter.$panel.find('.open').click(function(e) {
            e.stopPropagation();
            e.preventDefault();

            openPanel(true);

        });

        presenter.$panel.find('.close').click(function(e) {
            e.stopPropagation();
            e.preventDefault();

            closePanel();
        });

        presenter.$pagePanel.find('.button').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            changeButtonState(this);

            if (isDependingOnDrawing(this) && isDrawingButtonActive() || isFloatingImageButton(this)) {
                openBottomPanel(this);
            }
        });

        presenter.$pagePanel.find('.button-drawing-details').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            changeBottomButtonState(this);

            changeDrawingType(this);
        });

        presenter.$pagePanel.find('.button-floating-image').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            changeBottomButtonState(this);

            changeCurrentFloatingImage(parseInt($(this).attr('index'), 10));
        });

        presenter.$pagePanel.find('.pen').click(function() {
            presenter.$defaultColorButton = presenter.$panel.find('.color-blue');
            changeColor(['#0fa9f0', '#0fa9f0']);
            changeThickness(1);
            toggleMasks(
                [presenter.$mask, presenter.$markerMask],
                presenter.DRAW_MODE.PEN,
                [presenter.DRAW_MODE.NONE, presenter.DRAW_MODE.STAND_AREA, presenter.DRAW_MODE.HIDE_AREA]
            );

            presenter.ctx.globalCompositeOperation = 'source-over';
            presenter.drawMode = presenter.DRAW_MODE.PEN;

            drawingLogic();
        });

        presenter.$pagePanel.find('.marker').click(function() {
            presenter.$defaultColorButton = presenter.$panel.find('.color-yellow');
            changeColor(['#ffff99', '#ffff99']);
            changeThickness(10);
            toggleMasks(
                [presenter.$mask, presenter.$markerMask],
                presenter.DRAW_MODE.MARKER,
                [presenter.DRAW_MODE.NONE, presenter.DRAW_MODE.STAND_AREA, presenter.DRAW_MODE.HIDE_AREA]
            );

            presenter.markerCtx.globalCompositeOperation = 'source-over';
            presenter.drawMode = presenter.DRAW_MODE.MARKER;

            drawingLogic();
        });

        presenter.$pagePanel.find('.eraser').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            if (presenter.ctx) {
                presenter.ctx.globalCompositeOperation = 'destination-out';
            }
            if (presenter.markerCtx) {
                presenter.markerCtx.globalCompositeOperation = 'destination-out';
            }
            changeColor(['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']);
            changeThickness(20);
            presenter.drawMode = presenter.DRAW_MODE.ERASER;
            drawingLogic();
        });

        presenter.$pagePanel.find('.reset').click(function(e) {
            e.stopPropagation();
            e.preventDefault();

            presenter.selectingCtx.clearRect(0, 0, presenter.$selectingMask.width(), presenter.$selectingMask.height());
            presenter.ctx.clearRect(0, 0, presenter.$mask.width(), presenter.$mask.height());
            presenter.markerCtx.clearRect(0, 0, presenter.$markerMask.width(), presenter.$markerMask.height());

            presenter.areas = [];
            presenter.drawMode = presenter.DRAW_MODE.NONE;
        });

        presenter.$pagePanel.find('.hide-area').click(function(e) {
            toggleMasks([presenter.$selectingMask],
                presenter.DRAW_MODE.HIDE_AREA,
                [presenter.DRAW_MODE.NONE, presenter.DRAW_MODE.PEN, presenter.DRAW_MODE.MARKER, presenter.DRAW_MODE.ERASER]);
            drawAreaLogic(true);

            presenter.drawMode = presenter.DRAW_MODE.HIDE_AREA;
            presenter.$defaultColorButton = presenter.$panel.find('.color-black');
            changeColor(['#000', '#000']);
        });

        presenter.$pagePanel.find('.stand-area').click(function(e) {
            toggleMasks([presenter.$selectingMask],
                presenter.DRAW_MODE.STAND_AREA,
                [presenter.DRAW_MODE.NONE, presenter.DRAW_MODE.PEN, presenter.DRAW_MODE.MARKER, presenter.DRAW_MODE.ERASER]);
            drawAreaLogic(false);

            presenter.drawMode = presenter.DRAW_MODE.STAND_AREA;
            presenter.$defaultColorButton = presenter.$panel.find('.color-black');
            changeColor(['#000', '#000']);
        });

        presenter.$pagePanel.find('.zoom').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            changeCursor('zoom-in');
            var zoomClicked = presenter.$panel.find('.zoom').hasClass('clicked');

            var lastEvent = null;
            presenter.modules = presenter.$pagePanel.find('.ic_page > div:not(.iwb-toolbar-panel,.iwb-toolbar-note,.iwb-toolbar-clock,.iwb-toolbar-stopwatch,.confirmation-remove-note)');

            presenter.$pagePanel.disableSelection();

            presenter.modules.on('click mousedown mouseup', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });

            presenter.modules.find('a').on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });

            presenter.modules.on('mousedown', function(e) {
                e.stopPropagation();
                e.preventDefault();
                lastEvent = e;
                presenter.isMouseDown= true;
            });

            presenter.modules.on('mouseup', function(e) {
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
        });

        presenter.$pagePanel.find('.clock').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            createClock();
        });

        presenter.$pagePanel.find('.stopwatch').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            createStopwatch();
        });

        presenter.$pagePanel.find('.note').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            var note = createNote();

            presenter.$pagePanel.find('.ic_page').append(note);
            presenter.$pagePanel.find('.iwb-toolbar-note').click(function(e) {
                e.stopPropagation();
            });
        });

        presenter.$pagePanel.find('.default').click(function(e) {
            e.stopPropagation();
            e.preventDefault();

//                changeButtonState(this);
        });

        presenter.$pagePanel.find('.floating-image').click(function() {
            $.when.apply($, presenter.allImagesLoadedPromises).then(function() {
                var display = presenter.$pagePanel.find('.floating-image-mask').css('display');
                if(display == 'none'){
                    presenter.$floatingImageMask.show();
                }else{
                    presenter.$floatingImageMask.hide();
                    presenter.$pagePanel.find('.floating-image').removeClass('clicked');
                    presenter.$pagePanel.find('.bottom-panel-floating-image').hide();
                }
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

    presenter.isLeft = function(center, startingPosition, currentPosition) {
        return ((startingPosition.x - center.x)*(currentPosition.y - center.y) - (startingPosition.y - center.y)*(currentPosition.x - center.x)) >= 0;
    };

    function Vector(imageCenterPosition, mousePosition){
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

            presenter.$floatingImageMask.off('mousedown touchstart mouseup touchend touchmove mousemove')
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

        for(var index = 0; index < 3; index++) {
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
                        y: $(window).scrollTop() + (imageObj.height / 2),
                        image: imageObj,
                        width: imageObj.width,
                        height: imageObj.height,
                        offset: { x: imageObj.width / 2, y: imageObj.height / 2 }
                    });

                    group.on('dblclick', function() {
                        applyOnDblClickHandler();
                    });

                    applyDoubleTapHandler(group, applyOnDblClickHandler);
//                    group.on('doubleTap', function() {
//                        applyOnDblClickHandler();
//                    });

                    var imageMoveObj = new Image();
                    $(imageMoveObj).load(function() {
                        var moveIcon = new Kinetic.Image({
                            x: (imageObj.width / 2) - 16, // -16, czyli połowa szerokości obrazka
                            y: (imageObj.height / 2) - 16, // -16, czyli połowa wysokości obrazka
                            image: imageMoveObj,
                            opacity: 0.4
                        });

                        var imageRotateObj = new Image();
                        $(imageRotateObj).load(function() {
                            var rotateIcon = new Kinetic.Image({
                                x: (imageObj.width / 2) - 16, // -16, czyli połowa szerokości obrazka
                                y: (imageObj.height / 2) - 16, // -16, czyli połowa wysokości obrazka
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
                    $(event.target).css('position', '');
                    if (window.savedPanel && window.savedPanel.position) {
                        presenter.headerLoaded.then(function() {
                            $(event.target).css('top', window.savedPanel.position.top + 'px');
                            $(event.target).css('left', window.savedPanel.position.left + 'px');
                        });
                    } else {
                        presenter.headerLoaded.then(function() {
                            $(event.target).css('top', (presenter.$pagePanel.offset().top + parseInt(model['Top'], 10)) + 'px');
                            $(event.target).css('left', (presenter.$pagePanel.offset().left + parseInt(model['Left'], 10)) + 'px');
                        });
                    }
                },
                stop: function( event, ui ) {
                    window.savedPanel.position = ui.position;
                }
            });

            applyHovered([presenter.$panel.find('.button')]);

            window.savedPanel = window.savedPanel || {};

            if (window.savedPanel && window.savedPanel.isOpen) {
    //            presenter.$toggleButton.addClass('clicked');
                openPanel(false);
            } else {
                window.savedPanel.widthWhenOpened = presenter.config.widthWhenOpened;
            }

            addEventHandlers();
            if(presenter.isInFrame) {
                addScrollHandler();
            }

            $(view).hide();
            presenter.setVisibility(presenter.isVisible, false, view);
        }else{
            presenter.setVisibility(presenter.isVisible, true, view);
        }
    }

    function addScrollHandler() {
        var difference = 0,
            lastScrollTop = 0,
            panelTop = 0;

        $(window.parent.document).scroll(function() {
            var containerHeight = presenter.$pagePanel.outerHeight(true),
                scrollTop = $(this).scrollTop(),
                min = presenter.$pagePanel.offset().top,
                max = containerHeight;

            difference = scrollTop - lastScrollTop;
            panelTop = parseInt(presenter.$panel.css('top'), 10) + difference;
            lastScrollTop = scrollTop;

            if(panelTop && (panelTop) > min && (panelTop) < max) {
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
        });
    }

    function drawSketch () {
        var canvas = $('.ic_page:last').find('.selecting').find('canvas');
        var ctx = canvas[0].getContext('2d');

        var sketch = $('.ic_page:last').find('.selecting');
        canvas.width = sketch.width;
        canvas.height = sketch.height;

        var tmp_canvas = document.createElement('canvas');
        var tmp_ctx = tmp_canvas.getContext('2d');
        tmp_canvas.id = 'tmp_canvas';
        tmp_canvas.width = canvas.width();
        tmp_canvas.height = canvas.height();

        $('.ic_page:last').find('.selecting').append(tmp_canvas);

        var mouse = {x: 0, y: 0};
        var start_mouse = {x: 0, y: 0};


        /* Mouse Capturing Work */
        tmp_canvas.addEventListener('mousemove', function(e) {
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
        }, false);


        /* Drawing on Paint App */
        tmp_ctx.lineWidth = 1;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = 'black';
        tmp_ctx.fillStyle = 'black';

        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', onPaint, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            onPaint();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', onPaint, false);

            // Writing down to real canvas now
            //ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        }, false);

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
        $('.ic_page:last').find('.selecting').find('#tmp_canvas').on('mousedown', function (event) {
            var pos = getCursorPosition(event.originalEvent);
            presenter.startSelection = {
                x: pos.x,
                y: pos.y
            };
        });

        $('.ic_page:last').find('.selecting').find('#tmp_canvas').on('mouseup', function (event) {
            var pos = getCursorPosition(event.originalEvent);
            presenter.stopSelection = {
                x: pos.x,
                y: pos.y
            };
            drawArea(isHide);
            presenter.areas.push({
                isHide: isHide,
                width: presenter.startSelection.x - presenter.stopSelection.x,
                height: presenter.startSelection.y - presenter.stopSelection.y,
                x: presenter.stopSelection.x,
                y: presenter.stopSelection.y,
                color: presenter.currentLineColor
            });
        });
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
            drawHideArea(context, presenter.stopSelection.x, presenter.stopSelection.y, width, height, presenter.currentLineColor[0]);
        } else {
            drawStandArea(context, presenter.stopSelection.x, presenter.stopSelection.y, width, height, presenter.currentLineColor[0]);
        }
    }

    function drawSavedAreas() {
        $.each(presenter.areas, function() {
            if (this.isHide) {
                drawHideArea(presenter.selectingCtx, this.x, this.y, this.width, this.height, this.color[0]);
            } else {
                drawStandArea(presenter.selectingCtx, this.x, this.y, this.width, this.height, this.color[0]);
            }
        });
    }

    function createStopwatch(savedStopwatch, hours, minutes, seconds, stopClicked, startClicked) {
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
            });

        header.append(time);
        header.append(closeButton);
        buttons.append(startButton);
        buttons.append(stopButton);
        buttons.append(clearButton);
        stopwatch.append(header);
        stopwatch.append(buttons);

        var ic_page_height = $('.ic_page:last').height(),
            panel_top = parseInt(presenter.$panel.css('top'), 10),
            window_scroll = $(window).scrollTop(),
            panel_outerHeight = presenter.$panel.outerHeight(true),
            panel_differance = ic_page_height-panel_top-window_scroll,
            top=0;

        if(panel_differance < panel_outerHeight){
            top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + $(window).scrollTop() - presenter.$pagePanel.offset().top - 120
        }else{
            top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + $(window).scrollTop() - presenter.$pagePanel.offset().top
        }

        if(!presenter.stopwatchAdded){
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
        presenter.stopwatchAdded = true;

        var h1 = document.getElementsByClassName('stopwatch-time')[0],
            start = document.getElementById('start'),
            stop = document.getElementById('stop'),
            clear = document.getElementById('clear');
        presenter.stopButtonClicked = stopClicked;
        presenter.startButtonClicked = startClicked;

        if(seconds){
            presenter.seconds = seconds; presenter.minutes = minutes; presenter.hours = hours;
            h1.textContent = (presenter.hours ? (presenter.hours > 9 ? presenter.hours : "0" + presenter.hours) : "00") + ":" + (presenter.minutes ? (presenter.minutes > 9 ? presenter.minutes : "0" + presenter.minutes) : "00") + ":" + (presenter.seconds > 9 ? presenter.seconds : "0" + presenter.seconds);

            if(!presenter.stopButtonClicked){
                timer();
                presenter.$pagePanel.find('.iwb-toolbar-stopwatch').find('#start').addClass('button-clicked');
            }
        }else{
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

            h1.textContent = (presenter.hours ? (presenter.hours > 9 ? presenter.hours : "0" + presenter.hours) : "00") + ":" + (presenter.minutes ? (presenter.minutes > 9 ? presenter.minutes : "0" + presenter.minutes) : "00") + ":" + (presenter.seconds > 9 ? presenter.seconds : "0" + presenter.seconds);

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
            if(!presenter.startButtonClicked){
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

        var ic_page_height = $('.ic_page:last').height(),
            panel_top = parseInt(presenter.$panel.css('top'), 10),
            window_scroll = $(window).scrollTop(),
            panel_outerHeight = presenter.$panel.outerHeight(true),
            panel_differance = ic_page_height-panel_top-window_scroll,
            top=0;

        if(panel_differance < panel_outerHeight){
            top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + $(window).scrollTop() - presenter.$pagePanel.offset().top - 120
        }else{
            top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + $(window).scrollTop() - presenter.$pagePanel.offset().top
        }

        if(!presenter.clockAdded){
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

        function getTime()
        {
            var hours = new Date().getHours(),
                minutes = new Date().getMinutes(),
                seconds = new Date().getSeconds();

            return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ':' + (seconds < 10 ? "0" + seconds : seconds);
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

            var time = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
            currentDate = day+'/'+month+'/'+year+ ', ' + time;
        }

        closeButton.on('click', function(e) {
            e.stopPropagation();
            var confirmation = presenter.$removeConfirmationBox;
            confirmation.css('top', $(window).scrollTop() + 10 + 'px');
            confirmation.show();
            confirmation.find('.no-button').click(function(e) {
                e.stopPropagation();
               confirmation.hide();
            });
            confirmation.find('.yes-button').click(function(e) {
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


        var ic_page_height = $('.ic_page:last').height(),
            panel_top = parseInt(presenter.$panel.css('top'), 10),
            window_scroll = $(window).scrollTop(),
            panel_outerHeight = presenter.$panel.outerHeight(true),
            panel_differance = ic_page_height-panel_top-window_scroll,
            top=0;

        if(panel_differance < panel_outerHeight){
            top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + $(window).scrollTop() - presenter.$pagePanel.offset().top - 120
        }else{
            top = parseInt(presenter.$panel.css('top'), 10) + presenter.$panel.outerHeight(true) + $(window).scrollTop() - presenter.$pagePanel.offset().top
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

        applyDoubleTapHandler(note, function() {
            noteEditHandler(note, noteBody);
        });
    }

    function noteEditHandler(note, noteBody) {
        var currentValue = noteBody.html(),
            textarea = $('<textarea></textarea>'),
            buttonSave = $('<button class="save">Save</button>');

        buttonSave.on('click', function() {
            var value = textarea.val();
            noteBody.html(value);
            textarea.remove();
            applyNoteEditHandler(note, noteBody);
        });

        textarea.focus();
        textarea.val(currentValue);

        noteBody.html(textarea);
        noteBody.append(buttonSave);
    }

    function zoomSelectedModule(selectedModule) {
        if (presenter.$pagePanel.find('.zoomed').length > 0) {
            zoom.out();
            $(selectedModule).parent().find('.zoomed').removeClass('zoomed');
            changeCursor('zoom-in');
        } else {
            zoom.to({
                element: selectedModule
            });
            $(selectedModule).addClass('zoomed');
            presenter.$pagePanel.css('cursor', 'pointer');
        }
    }

    function changeCursor(type) {
        if (type == 'zoom-in') {
            presenter.$pagePanel.css({
                'cursor' : 'zoom-in',
                'cursor' : '-moz-zoom-in',
                'cursor' : '-webkit-zoom-in'
            });
        }
    }

    function isDependingOnDrawing(button) {
        return $(button).hasClass('color') || $(button).hasClass('thickness');
    }

    function isDrawingButtonActive() {
        return presenter.$pagePanel.find('.button.pen.clicked, .button.marker.clicked, .button.hide-area.clicked, .button.stand-area.clicked').length > 0;
    }

    function isFloatingImageButton(button) {
        return $(button).hasClass('floating-image');
    }

    function shouldHideDrawingMasks(button) {
        return !$(button).hasClass('pen') &&
            !$(button).hasClass('marker') &&
            !$(button).hasClass('eraser');
    }

    function shouldHideSelectingMasks(button) {
        return !$(button).hasClass('stand-area') &&
            !$(button).hasClass('hide-area');
    }

    function shouldHideFloatingImage(button) {
        return !$(button).hasClass('reset') && !$(button).hasClass('floating-image');
    }

    function changeButtonState(button) {
        if (isDependingOnDrawing(button)) {
            if (isDrawingButtonActive()) {
                presenter.$panel.find('.button.clicked-lighter').removeClass('clicked-lighter');
                $(button).toggleClass('clicked-lighter');
            }
        } else {
            reset(false, false, shouldHideDrawingMasks(button), shouldHideSelectingMasks(button), shouldHideFloatingImage(button));
            presenter.$panel.find('.clicked').removeClass('clicked');
            if(!$(button).hasClass('zoom')){
                if(presenter.modules){
                    presenter.modules.off('mouseup mousemove');
                }
            }
            if ( !$(button).hasClass('open') && !$(button).hasClass('close') ) {
                $(button).toggleClass('clicked');
            }
            changeCurrentFloatingImage(presenter.currentFloatingImageIndex);
        }
    }

    function changeBottomButtonState(button) {
        presenter.$panel.find('.container .clicked-lighter').removeClass('clicked-lighter');
        $(button).toggleClass('clicked-lighter');
    }

    function toggleMasks(masks, currentDrawingMode, oppositeDrawingModes) {
        if (currentDrawingMode == presenter.drawMode || oppositeDrawingModes.indexOf(presenter.drawMode) >= 0) {
            $.each(masks, function() {
                if ($(this).is(':visible')) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
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
                presenter.$mask = mask;
                presenter.$mask.addClass('pen-mask');
                return presenter.$mask;
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

        var icPage = presenter.$pagePanel.find('.ic_page:last');
        icPage.css('position', 'relative');
        icPage.append($mask);

        var canvas = $('<canvas></canvas>');
        setCanvas(canvas);
        setContext(canvas[0].getContext("2d"));

        try {
            presenter.canvasPosition = canvas[0].getBoundingClientRect(); // IE 11 has problem with this method http://bugs.jquery.com/ticket/4996
        } catch(_) {
            presenter.canvasPosition = { 'top' : canvas[0].offsetTop, 'left' : canvas[0].offsetLeft };
        }

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

    presenter.run = function(view, model){
        runLogic(view, model, false);
    };

    presenter.setShowErrorsMode = function(){
    };

    presenter.setWorkMode = function(){
    };

    function reset(closePanel, shouldClearCanvas, shouldHideDrawingMasks, shouldHideSelectingMasks, shouldHideFloatingImage) {
        presenter.$panel.find('.clicked').removeClass('clicked');
        presenter.$panel.find('.clicked-lighter').removeClass('clicked-lighter');
        presenter.$panel.find('.hovered').removeClass('hovered');
        presenter.$pagePanel.find('.zoomed').removeClass('zoomed');
        presenter.$pagePanel.enableSelection();
        presenter.$pagePanel.css('cursor', 'initial');
//        presenter.$pagePanel.find('.ic_page > div:not(.iwb-toolbar-panel)').off('mousemove mousedown mouseup');
        presenter.$pagePanel.find('.bottom-panel-color').hide();
        presenter.$pagePanel.find('.bottom-panel-thickness').hide();

        if (shouldClearCanvas) {
            changeColor(['#0fa9f0', '#0fa9f0']);
            changeThickness(1);
            clearCanvases();
        }

        if (shouldHideDrawingMasks) {
            if (presenter.$mask) {
                presenter.$mask.hide();
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


        if (closePanel) {
//            presenter.$toggleButton.removeClass('clicked');
//            presenter.$panel.hide();
//            window.savedPanel.isOpen = false;
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
        presenter.currentLineWidth = size;
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
        if(!isPreview){
            presenter.$panel.css('visibility', isVisible ? 'visible' : 'hidden');
        }else{
            $(view).css('visibility', isVisible ? 'visible' : 'hidden');
        }
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'open' : presenter.open,
            'hide' : presenter.hide,
            'show' : presenter.show
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function(){
        reset(true, true, true, true, true);
    };

    presenter.getErrorCount = function(){
        return 0;
    };

    presenter.getMaxScore = function(){
        return 0;
    };

    presenter.getScore = function(){
        return 0;
    };

    function getSavedNotes() {
        var notes = [];
        $.each(presenter.$pagePanel.find('.iwb-toolbar-note'), function() {
            notes.push({
                'top' : $(this).css('top'),
                'left' : $(this).css('left'),
                'date' : $(this).find('.note-date').html(),
                'body' : $(this).find('.note-body').html()
            });
            $(this).remove();
        });
        return notes;
    }

    function getSavedClocks() {
        var clocks = [];
        $.each(presenter.$pagePanel.find('.iwb-toolbar-clock'), function() {
            clocks.push({
                'top' : $(this).css('top'),
                'left' : $(this).css('left')
            });
            $(this).remove();
        });
        return clocks;
    }

    function getSavedStopwatches() {
        var stopwatches = [];
        $.each(presenter.$pagePanel.find('.iwb-toolbar-stopwatch'), function() {
            stopwatches.push({
                'top' : $(this).css('top'),
                'left' : $(this).css('left')
            });
            $(this).remove();
        });
        return stopwatches;
    }

    presenter.getState = function(){
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

    presenter.setState = function(state){
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

    return presenter;
}

/*!
 * zoom.js 0.3
 * http://lab.hakim.se/zoom-js
 * MIT licensed
 *
 * Copyright (C) 2011-2014 Hakim El Hattab, http://hakim.se
 *
 * Modified by Karol Gebert:
 * - removed pan function and all related functions
 * - added support for zooming elements in iframe
 *
 */
var zoom = (function(){

    var TRANSITION_DURATION = 800;

    // The current zoom level (scale)
    var level = 1;

    // Timeout for callback function
    var callbackTimeout = -1;

    // Check for transform support so that we can fallback otherwise
    var supportsTransforms = 	'WebkitTransform' in document.body.style ||
        'MozTransform' in document.body.style ||
        'msTransform' in document.body.style ||
        'OTransform' in document.body.style ||
        'transform' in document.body.style;

    if( supportsTransforms ) {
        // The easing that will be applied when we zoom in/out
        document.body.style.transition = 'transform '+ TRANSITION_DURATION +'ms ease';
        document.body.style.OTransition = '-o-transform '+ TRANSITION_DURATION +'ms ease';
        document.body.style.msTransition = '-ms-transform '+ TRANSITION_DURATION +'ms ease';
        document.body.style.MozTransition = '-moz-transform '+ TRANSITION_DURATION +'ms ease';
        document.body.style.WebkitTransition = '-webkit-transform '+ TRANSITION_DURATION +'ms ease';
    }

    // Zoom out if the user hits escape
    document.addEventListener( 'keyup', function( event ) {
        if( level !== 1 && event.keyCode === 27 ) {
            zoom.out();
        }
    } );

    /**
     * Applies the CSS required to zoom in, prefers the use of CSS3
     * transforms but falls back on zoom for IE.
     *
     * @param {Object} rect
     * @param {Number} scale
     */
    function magnify( rect, scale ) {

        var scrollOffset = getScrollOffset();

        // Ensure a width/height is set
        rect.width = rect.width || 1;
        rect.height = rect.height || 1;

        // Center the rect within the zoomed viewport
        rect.x -= ( window.innerWidth - ( rect.width * scale ) ) / 2;
        rect.y -= ( window.innerHeight - ( rect.height * scale ) ) / 2;

        if( supportsTransforms ) {
            // Reset
            if( scale === 1 ) {
                document.body.style.transform = '';
                document.body.style.OTransform = '';
                document.body.style.msTransform = '';
                document.body.style.MozTransform = '';
                document.body.style.WebkitTransform = '';
            }
            // Scale
            else {
                var origin = scrollOffset.x +'px '+ scrollOffset.y +'px',
                    transform = 'translate('+ -rect.x +'px,'+ -rect.y +'px) scale('+ scale +')';

                document.body.style.transformOrigin = origin;
                document.body.style.OTransformOrigin = origin;
                document.body.style.msTransformOrigin = origin;
                document.body.style.MozTransformOrigin = origin;
                document.body.style.WebkitTransformOrigin = origin;

                document.body.style.transform = transform;
                document.body.style.OTransform = transform;
                document.body.style.msTransform = transform;
                document.body.style.MozTransform = transform;
                document.body.style.WebkitTransform = transform;
            }
        }
        else {
            // Reset
            if( scale === 1 ) {
                document.body.style.position = '';
                document.body.style.left = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.height = '';
                document.body.style.zoom = '';
            }
            // Scale
            else {
                document.body.style.position = 'relative';
                document.body.style.left = ( - ( scrollOffset.x + rect.x ) / scale ) + 'px';
                document.body.style.top = ( - ( scrollOffset.y + rect.y ) / scale ) + 'px';
                document.body.style.width = ( scale * 100 ) + '%';
                document.body.style.height = ( scale * 100 ) + '%';
                document.body.style.zoom = scale;
            }
        }

        level = scale;
    }

    function getScrollOffset() {
        return {
            x: window.scrollX !== undefined ? window.scrollX : window.pageXOffset,
            y: window.scrollY !== undefined ? window.scrollY : window.pageYOffset
        }
    }

    return {
        /**
         * Zooms in on either a rectangle or HTML element.
         *
         * @param {Object} options
         *
         *   (required)
         *   - element: HTML element to zoom in on
         *   OR
         *   - x/y: coordinates in non-transformed space to zoom in on
         *   - width/height: the portion of the screen to zoom in on
         *   - scale: can be used instead of width/height to explicitly set scale
         *
         *   (optional)
         *   - callback: call back when zooming in ends
         *   - padding: spacing around the zoomed in element
         */
        to: function( options ) {

            // Due to an implementation limitation we can't zoom in
            // to another element without zooming out first
            if( level !== 1 ) {
                zoom.out();
            }
            else {
                options.x = options.x || 0;
                options.y = options.y || 0;

                // If an element is set, that takes precedence
                if( !!options.element ) {
                    // Space around the zoomed in element to leave on screen
                    var padding = typeof options.padding === 'number' ? options.padding : 20;
                    var bounds = options.element.getBoundingClientRect();

                    options.x = bounds.left - padding;
                    options.y = bounds.top - padding;
                    options.width = bounds.width + ( padding * 2 );
                    options.height = bounds.height + ( padding * 2 );
                }

                // If width/height values are set, calculate scale from those values
                if( options.width !== undefined && options.height !== undefined ) {
                    options.scale = Math.max( Math.min( window.innerWidth / options.width, window.innerHeight / options.height ), 1 );
                }

                if( options.scale > 1 ) {
                    options.x *= options.scale;
                    options.y *= options.scale;

                    options.x = Math.max( options.x, 0 );
                    options.y = Math.max( options.y, 0 );

                    magnify( options, options.scale );

                    if( typeof options.callback === 'function' ) {
                        callbackTimeout = setTimeout( options.callback, TRANSITION_DURATION );
                    }
                }
            }
        },

        /**
         * Resets the document zoom state to its default.
         */
        out: function() {
            magnify( { x: 0, y: 0 }, 1 );

            level = 1;
        },

        // Alias
        magnify: function( options ) { this.to( options ) },
        reset: function() { this.out() },

        zoomLevel: function() {
            return level;
        }
    }

})();

