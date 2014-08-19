function AddonInteractive_Table_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.areas = [];
    presenter.notes = [];
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
    };

    presenter.createPreview = function(view, model) {
        runLogic(view, model, true);
    };

    function closePanel() {
        if (!presenter.$panel.hasClass('animationInProgress')) {

            presenter.$panel.addClass('animationInProgress');
            presenter.$panel.children('.button-separator').hide();
            presenter.$buttonsExceptOpen.hide();

            presenter.$panel.animate({
                'width' : 30 + 'px'
//                    'left' : (parseInt(presenter.$panel.css('left'), 10) - 451) + 'px'
            }, 1000, function() {
                presenter.$panel.children('.button.open').show();
                presenter.$panel.removeClass('animationInProgress');
            });

            window.savedPanel.isOpen = false;
        }
    }

    function openPanel(doAnimation) {
        window.savedPanel.isOpen = true;
        presenter.$buttonsExceptOpen.css('width', presenter.buttonWidth);

        function _show() {
            presenter.$buttonsExceptOpen.show();
            presenter.$panel.children('.button.open').hide();
            presenter.$panel.children('.button-separator').show();
            presenter.$panel.removeClass('animationInProgress');
        }

        if (doAnimation) {
            presenter.$panel.addClass('animationInProgress');
            var left = (parseInt(presenter.$panel.css('left'), 10) - 421);
            presenter.$panel.animate({
                'width' : 457 + 'px'
//                    'left' : (left <= 0 ? 0 : left) + 'px'
            }, 1000, _show);
        } else {
            _show();
        }
    }

    presenter.interactiveTableDraw = function(canvas, ctx, mousePosition) {
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
            x: e.clientX,
            y: e.clientY
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
                    presenter.interactiveTableDraw(presenter.markerCanvas, presenter.markerCtx, getCursorPosition(e));
                } else if (presenter.drawMode == presenter.DRAW_MODE.PEN) {
                    presenter.interactiveTableDraw(presenter.canvas, presenter.ctx, getCursorPosition(e));
                } else if (presenter.drawMode == presenter.DRAW_MODE.ERASER) {
                    presenter.interactiveTableDraw(presenter.markerCanvas, presenter.markerCtx, getCursorPosition(e));
                    presenter.interactiveTableDraw(presenter.canvas, presenter.ctx, getCursorPosition(e));
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

    function setBasicConfiguration(view) {
        presenter.$view = $(view);
        presenter.$panel = $(view).find('.interactive-table-panel');
        presenter.$pagePanel = presenter.$view.parents('.ic_player').find('.ic_page').parent('.ic_page_panel');
        presenter.$icplayer = presenter.$panel.parents('.ic_player').parent();
        presenter.$defaultThicknessButton = presenter.$panel.find('.thickness-1');
        presenter.$defaultColorButton = presenter.$panel.find('.color-blue');
        window.$icplayer = presenter.$icplayer;
        presenter.isInFrame = window.parent.location != window.location;
        presenter.$buttonsExceptOpen = presenter.$panel.children('.button:not(.open)');
        presenter.buttonWidth = presenter.$buttonsExceptOpen.width();
        $('.ic_page:first').append(presenter.$panel);
        presenter.$pagePanel.css('cursor', 'initial');
        presenter.$view.disableSelection();
    }

    function addEventHandlers() {
        presenter.$pagePanel.on('click', function(e) {
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

            $.each(presenter.$pagePanel.find('.interactive-table-note'), function() {
                $(this).remove();
            });

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

            var lastEvent = null;
            var modules = presenter.$pagePanel.find('.ic_page > div:not(.interactive-table-panel)');

            presenter.$pagePanel.disableSelection();

            modules.on('click mousedown mouseup', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });

            modules.find('a').on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });

            modules.on('mousedown', function(e) {
                e.stopPropagation();
                e.preventDefault();
                lastEvent = e;
                presenter.isMouseDown= true;
            });

            modules.on('mouseup', function(e) {
                e.stopPropagation();
                e.preventDefault();
                presenter.isMouseDown = false;

                if (lastEvent.type == 'mousedown' &&
                    !$(e.currentTarget).hasClass('interactive-table-panel') &&
                    !$(e.currentTarget).hasClass('addon_Interactive_Table')) { // click

                    zoomSelectedModule(e.currentTarget);
                }

                lastEvent = e;
            });

            modules.on('mousemove', function(e) {
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

            //            function MouseWheelHandler(e) {
            //                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            //
            //                if (delta > 0) {
            //                    zoom.scaleUp();
            //                } else {
            //                    zoom.scaleDown();
            //                }
            //            }
            //
            //            presenter.$pagePanel[0].addEventListener('mousewheel', MouseWheelHandler, false);
            //            presenter.$pagePanel[0].addEventListener('DOMMouseScroll', MouseWheelHandler, false);
        });

        presenter.$pagePanel.find('.note').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            var note = createNote();

            presenter.$pagePanel.append(note);
        });

        presenter.$pagePanel.find('.default').click(function(e) {
            e.stopPropagation();
            e.preventDefault();

//                changeButtonState(this);
        });

        presenter.$pagePanel.find('.floating-image').click(function() {
            $.when.apply($, presenter.allImagesLoadedPromises).then(function() {
                presenter.$floatingImageMask.show();
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
        });
    }

    function addFloatingImages(model) {
        var $mask = $('<div class="interactive-table-mask floating-image-mask"></div>');
        presenter.$icplayer.append($mask);
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
                        y: $(window.top).scrollTop() + (imageObj.height / 2),
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

                            var isMouseDown = false,
                                startingVector = null;

                            function rotateActionStartHandler() {
                                if (presenter.floatingImageMode == presenter.FLOATING_IMAGE_MODE.ROTATE) {
                                    isMouseDown = true;
                                    var imageCenter = {
                                        x: (getCurrentImage().getAbsolutePosition().x),
                                        y: (getCurrentImage().getAbsolutePosition().y)
                                    };

                                    startingVector = new Vector(imageCenter, stage.getPointerPosition());
                                }
                            }

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
                                var currentPosition = stage.getPointerPosition();

                                if (isMouseDown && presenter.floatingImageMode == presenter.FLOATING_IMAGE_MODE.ROTATE && previousPosition) {
                                    var imageCenter = {
                                        x: (getCurrentImage().getAbsolutePosition().x),
                                        y: (getCurrentImage().getAbsolutePosition().y)
                                    };

                                    var currentVector = new Vector(imageCenter, stage.getPointerPosition());
                                    var angle = calculateVectorsAngle(startingVector, currentVector);
                                    var isLeft = presenter.isLeft(imageCenter, previousPosition, currentPosition);

                                    getCurrentImage().rotate(isLeft ? angle : -angle);
                                    layer.draw();
                                }

                                previousPosition = currentPosition;
                            }

                            presenter.$floatingImageMask.on('mousemove', rotateActionMoveHandler);
                            presenter.$floatingImageMask.on('touchmove', rotateActionMoveHandler);

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
        if (!isPreview) {
            presenter.headerLoadedDeferred = new $.Deferred();
            presenter.headerLoaded = presenter.headerLoadedDeferred.promise();

            Kinetic.pixelRatio = 1;

            setBasicConfiguration(view);

            addFloatingImages(model);
            createCanvases();
            presenter.$panel.draggable({
                containment: 'parent',
                opacity: 0.35,
                create: function(event, _) {
                    if (window.savedPanel && window.savedPanel.position) {
                        $(event.target).css('top', window.savedPanel.position.top + 'px');
                        $(event.target).css('left', window.savedPanel.position.left + 'px');
                    } else {
                        presenter.headerLoaded.then(function() {
                            $(event.target).css('top', presenter.$pagePanel.offset().top + 'px');
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
            }

            addEventHandlers();
            if(presenter.isInFrame) {
                addScrollHandler();
            }

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

    function drawAreaLogic(isHide) {
        presenter.selectingCanvas.selectable({
            stop: function( event, _ ) {
                presenter.stopSelection = {
                    x: event.clientX,
                    y: event.clientY
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
            },
            start: function( event, _ ) {
                presenter.startSelection = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
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

    function createNote(savedNote) {
        var note = $('<div class="interactive-table-note"></div>'),
            header = $('<div class="note-header"></div>'),
            date = $('<div class="note-date"></div>'),
            closeButton = $('<div class="note-close">&times;</div>'),
            noteBody = $('<div class="note-body"></div>'),
            currentDate = '';

        if (savedNote) {
            currentDate = savedNote.date;
            noteBody.html(savedNote.body);
        } else {
            var dateObject = new Date();
            currentDate = dateObject.toLocaleDateString() + ', ' + dateObject.toLocaleTimeString()
        }

        closeButton.on('click', function() {
            if ( confirm('Are you sure to remove this note?') ) {
                note.remove();
            }
        });

        date.html(currentDate);
        header.append(date);
        header.append(closeButton);
        note.append(header);
        note.append(noteBody);

        applyNoteEditHandler(note, noteBody);

        note.draggable({
            containment: 'parent',
            opacity: 0.35,
            create: function(event, _) {
                $(event.target).css({
                    'top' : savedNote ? savedNote.top : $(window.top).scrollTop() + 'px',
                    'left' : savedNote ? savedNote.left : '0px',
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
            presenter.$pagePanel.find('*:not(.interactive-table-panel, .interactive-table-panel .button)').css('cursor', 'pointer');
        }
    }

    function changeCursor(type) {
        if (type == 'zoom-in') {
            presenter.$pagePanel.find('*:not(.interactive-table-panel, .interactive-table-panel .button)').css({
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

    function changeButtonState(button) {
        if (isDependingOnDrawing(button)) {
            if (isDrawingButtonActive()) {
                presenter.$panel.find('.button.clicked-lighter').removeClass('clicked-lighter');
                $(button).toggleClass('clicked-lighter');
            }
        } else {
            reset(false, false, shouldHideDrawingMasks(button), shouldHideSelectingMasks(button));
            presenter.$panel.find('.clicked').removeClass('clicked');
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
                presenter.selectingCanvas = canvas
            }
        );

    }

    function createCanvas(setMask, setContext, setCanvas) {
        var $mask = $('<div class="interactive-table-mask"></div>');
        $mask = setMask($mask);
        $mask.hide();
        presenter.$pagePanel.css('position', 'relative');
        presenter.$pagePanel.append($mask);

        var canvas = $('<canvas></canvas>');
        setCanvas(canvas);
        setContext(canvas[0].getContext("2d"));

        presenter.canvasPosition = canvas[0].getBoundingClientRect();

        $mask.append(canvas);
        canvas[0].width = $mask.width();
        canvas[0].height = $mask.height();
    }

    function applyHovered(elements) {
        $.each(elements, function(_, btn) {
            $(btn).hover(function() {
                $(this).addClass('hovered');
            }, function() {
                $(this).removeClass('hovered');
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

    function reset(closePanel, shouldClearCanvas, shouldHideDrawingMasks, shouldHideSelectingMasks) {
        presenter.$panel.find('.clicked').removeClass('clicked');
        presenter.$panel.find('.clicked-lighter').removeClass('clicked-lighter');
        presenter.$panel.find('.hovered').removeClass('hovered');
        presenter.$pagePanel.find('.zoomed').removeClass('zoomed');
        presenter.$pagePanel.enableSelection();
        presenter.$pagePanel.find('.ic_page > div:not(.interactive-table-panel)').off('mousemove mousedown mouseup');
        presenter.$pagePanel.find('.bottom-panel').hide();

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

        if (presenter.$floatingImageMask) {
            presenter.$floatingImageMask.hide();
        }


        if (closePanel) {
//            presenter.$toggleButton.removeClass('clicked');
            presenter.$panel.hide();
            window.savedPanel.isOpen = false;
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
        presenter.$panel.show();
    };

    presenter.hide = function() {
        presenter.$panel.hide();
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'open' : presenter.open,
            'hide' : presenter.hide
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function(){
        reset(true, true, true, true);
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
        $.each(presenter.$pagePanel.find('.interactive-table-note'), function() {
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

    presenter.getState = function(){
        var notes = getSavedNotes(),
            drawings = {
                'pen' : presenter.canvas ? presenter.canvas[0].toDataURL('image/png') : null,
                'marker' : presenter.markerCanvas ? presenter.markerCanvas[0].toDataURL('image/png') : null
            };

        clearCanvases();

        return JSON.stringify({
           'areas' : presenter.areas,
           'notes' : notes,
           'drawings' : drawings
        });
    };

    presenter.setState = function(state){
        var parsed = JSON.parse(state);
        presenter.areas = parsed.areas;
        presenter.notes = parsed.notes;
        setDrawingState(new Image(), presenter.ctx, parsed.drawings.pen);
        setDrawingState(new Image(), presenter.markerCtx, parsed.drawings.marker);

        $.each(presenter.notes, function() {
            var note = createNote(this);
            presenter.$pagePanel.append(note);
        });

        drawSavedAreas();
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

    // The current zoom level (scale)
    var level = 1;

    // Check for transform support so that we can fallback otherwise
    var supportsTransforms = 	'WebkitTransform' in document.body.style ||
        'MozTransform' in document.body.style ||
        'msTransform' in document.body.style ||
        'OTransform' in document.body.style ||
        'transform' in document.body.style;

    if( supportsTransforms ) {
        // The easing that will be applied when we zoom in/out
        document.body.style.transition = 'transform 0.8s ease';
        document.body.style.OTransition = '-o-transform 0.8s ease';
        document.body.style.msTransition = '-ms-transform 0.8s ease';
        document.body.style.MozTransition = '-moz-transform 0.8s ease';
        document.body.style.WebkitTransition = '-webkit-transform 0.8s ease';
    }

    // Zoom out if the user hits escape
    document.addEventListener( 'keyup', function( event ) {
        if( level !== 1 && event.keyCode === 27 ) {
            zoom.out();
        }
    } );

    function getScrollOffset() {
        return {
            x: window.scrollX !== undefined ? window.scrollX : window.pageXOffset,
            y: window.scrollY !== undefined ? window.scrollY : window.pageYOffset
        }
    }

    function _magnify() {
        var origin = window.currentOrigin[0] +'px '+ window.currentOrigin[1] +'px',
            transform = 'translate('+ window.currentTransform[0] +'px,'+ window.currentTransform[1] +'px) scale('+ window.currentTransform[2] +')';

        window.top.document.body.style.transformOrigin = origin;
        window.top.document.body.style.OTransformOrigin = origin;
        window.top.document.body.style.msTransformOrigin = origin;
        window.top.document.body.style.MozTransformOrigin = origin;
        window.top.document.body.style.WebkitTransformOrigin = origin;

        window.top.document.body.style.transform = transform;
        window.top.document.body.style.OTransform = transform;
        window.top.document.body.style.msTransform = transform;
        window.top.document.body.style.MozTransform = transform;
        window.top.document.body.style.WebkitTransform = transform;
    }

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

        if (window.parent.location != window.location) {
//            rect.x -= 100;
//            rect.y -= 100;
            rect.y -= $(window.top).scrollTop();
        } else {
            rect.x -= ( window.innerWidth - ( rect.width * scale ) ) / 2 ;
            rect.y -= ( window.innerHeight - ( rect.height * scale ) ) / 2;
            // Center the rect within the zoomed viewport
        }

        if( supportsTransforms ) {
            // Reset
            if( scale === 1 ) {
                window.top.document.body.style.transform = '';
                window.top.document.body.style.OTransform = '';
                window.top.document.body.style.msTransform = '';
                window.top.document.body.style.MozTransform = '';
                window.top.document.body.style.WebkitTransform = '';
            }
            // Scale
            else {

                window.currentOrigin = [scrollOffset.x, scrollOffset.y];
                window.currentTransform = [-rect.x, - rect.y, scale];

                _magnify();
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

    return {
        /**
         * Zooms in on either a rectangle or HTML element.
         *
         * @param {Object} options
         *   - element: HTML element to zoom in on
         *   OR
         *   - x/y: coordinates in non-transformed space to zoom in on
         *   - width/height: the portion of the screen to zoom in on
         *   - scale: can be used instead of width/height to explicitly set scale
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
                    var padding = 20;
                    var bounds = options.element.getBoundingClientRect();
                    var offsetTop = 0,
                        offsetLeft = 0;
                    if (window.parent.location != window.location) {
                        var iframe = $(window.top.document).find('iframe');
                        offsetLeft = iframe.offset().left;
                        offsetTop = iframe.offset().top;
                    }
                    options.x = bounds.left + offsetLeft - padding;
                    options.y = bounds.top + offsetTop - padding;
                    options.width = bounds.width + ( padding * 2 );
                    options.height = options.element.scrollHeight + ( padding * 2 );
                }

                // If width/height values are set, calculate scale from those values
                if( options.width !== undefined && options.height !== undefined ) {
                    var height = window.top.innerHeight;
                    options.scale = Math.max( Math.min( window.top.innerWidth / options.width, height / options.height ), 1 );
                }

                if( options.scale > 1 ) {
                    options.x *= options.scale;
                    options.y *= options.scale;

                    magnify( options, options.scale );

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
        },

        scaleUp: function() {
            //window.currentOrigin = [scrollOffset.x, scrollOffset.y];
            window.currentTransform[2] += 0.1// = [-rect.x, - rect.y, scale];
            _magnify();
        },

        scaleDown: function() {
            //window.currentOrigin = [scrollOffset.x, scrollOffset.y];
            window.currentTransform[2] -= 0.1// = [-rect.x, - rect.y, scale];
            _magnify();
        }
    }

})();

