function AddonSlider_create () {
    var presenter = function () {};

    presenter.$view = null;
    presenter.savedState = null;
    presenter.counter = 0;
    presenter.isTouched = false;
    presenter.isWCAGOn = false;

    var playerController, onStepChangeEvent;

    presenter.ORIENTATION = {
        LANDSCAPE : 0, // Horizontal
        PORTRAIT : 1 // Vertical
    };

    presenter.ERROR_CODES = {
        'ES_01' : "Element source was not given!",
        'SC_01' : "Steps count incorrect!",
        'SC_02' : "Steps count cannot be less than 2!",
        'IS_01' : "Initial step incorrect! It must be a positive number between 1 and steps count!",
        'AT_01' : "Step number must be a positive number between 1 and steps count",
        "AT_02" : "Step number has been provided but the alternative text is missing",
        "AT_03" : "Duplicate step number!"
    };

    presenter.addonID = '';

    presenter.mouseData = {
        isMouseDown : false,
        oldPosition : {
            x : 0,
            y : 0
        },
        isMouseDragged : false
    };

    var imageElementData = {
        width : 0,
        height : 0,
        maxLeft : 0,
        maxTop : 0
    };

    var CLASSES_NAMES = {
        WRAPPER : {
            STANDARD_CLASS : 'slider-wrapper',
            SELECTOR : '.slider-wrapper:first'
        },
        ELEMENT_IMAGE : {
            STANDARD_CLASS : 'slider-element-image',
            MOUSE_HOVER : 'slider-element-image-mouse-hover',
            MOUSE_CLICK : 'slider-element-image-mouse-click',
            SELECTOR : 'div[class*="slider-element-image"]:first'
        }
    };

    /**
     * Trigger a callback when the selected images are loaded:
     * @param {String} selector
     * @param {Function} callback
     */
    var onImgLoaded = function($element, callback){
        if ($element[0].complete) {
            callback($element[0]);
        }
        else {
            $element.on('load', function(){
                callback($element[0]);
            });
        }
    };

    function loadImageElement(isPreview) {
        var addonContainer = presenter.$addonContainer;
        var imageElement = document.createElement('img');
        $(imageElement).attr('src', presenter.configuration.imageSrc + "?" + new Date().getTime()); // fix for IE 10 cached images http://css-tricks.com/snippets/jquery/fixing-load-in-ie-for-cached-images/
        addonContainer.html(imageElement);

        onImgLoaded($(imageElement), function(image) {
            var width = image.width;
            var height = image.height;
            imageElementData.width = width;
            imageElementData.height = height;
            imageElementData.maxLeft = $(addonContainer).width() - width;
            imageElementData.maxTop = $(addonContainer).height() - height;

            var imageContainer = document.createElement('div');

            $(imageContainer).addClass(CLASSES_NAMES.ELEMENT_IMAGE.STANDARD_CLASS);
            $(imageContainer).css({
                backgroundImage: "url('" + presenter.configuration.imageSrc + "')",
                backgroundSize : '100% 100%',
                width: imageElementData.width + 'px',
                height: imageElementData.height + 'px'
            });
            addonContainer.html(imageContainer);

            var containerLength = presenter.configuration.orientation === presenter.ORIENTATION.LANDSCAPE ? $(addonContainer).width() : $(addonContainer).height();

            var elementLength = presenter.configuration.orientation === presenter.ORIENTATION.LANDSCAPE ? $(imageContainer).width() : $(imageContainer).height();
            if(!presenter.configuration.stepwise) {
                presenter.configuration.stepsCount = containerLength - elementLength + 1;
            }
            var stepZoneLength = (containerLength - elementLength) / (presenter.configuration.stepsCount - 1);



            presenter.configuration.snapPoints.push(elementLength / 2);
            for (var i = 0; i < presenter.configuration.stepsCount - 2; i++) {
                var snapPoint = elementLength / 2 + (i + 1) * stepZoneLength;
                presenter.configuration.snapPoints.push(parseInt(snapPoint, 10));
            }
            presenter.configuration.snapPoints.push(containerLength - elementLength / 2);

            presenter.moveToStep(imageContainer, presenter.configuration.initialStep, presenter.configuration);

            if (!isPreview) {
                presenter.configuration.stepwiseModeBarAlwaysVisible && drawBurret();
                handleMouseDrag(addonContainer);
            } else {
                drawBurret();
            }

            presenter.setVisibility(presenter.configuration.isVisibleByDefault);

            presenter.imageElement = imageContainer;

            presenter.imageLoadedDeferred.resolve();
        });
    }

    presenter.moveToStep = function(element, step, configuration) {
        var elementContainer = presenter.$addonContainer;
        var containerLength = configuration.orientation === presenter.ORIENTATION.LANDSCAPE ? $(elementContainer).width() : $(elementContainer).height();
        var elementLength = configuration.orientation === presenter.ORIENTATION.LANDSCAPE ? $(element).width() : $(element).height();
        var zoneLength = containerLength - elementLength;
        var singleStepZoneLength = (containerLength - elementLength) / (configuration.stepsCount - 1);
        var distance = singleStepZoneLength * (step - 1);

        if (distance < 0 || step === 1) {
            distance = 0;
        }

        if (distance > zoneLength || step === configuration.stepsCount) {
            distance = zoneLength;
        }

        $(element).css({
            top : configuration.orientation === presenter.ORIENTATION.PORTRAIT ? distance : 0,
            left : configuration.orientation === presenter.ORIENTATION.LANDSCAPE ? distance : 0
        });

        var tempElement = document.createElement('p');
        elementContainer.append(tempElement);
        $(elementContainer).find('p:first').remove();

    };


    function mouseDownCallback (eventData) {
        if (presenter.configuration.isErrorMode && presenter.configuration.shouldBlockInErrorMode) return;

        presenter.mouseData.isMouseDown = true;
        presenter.mouseData.oldPosition.x = eventData.pageX;
        presenter.mouseData.oldPosition.y = eventData.pageY;
        if (eventData.stopPropagation) eventData.stopPropagation();
        if (eventData.preventDefault) eventData.preventDefault();
    }

    function touchStartCallback (event) {
        presenter.isTouched = true;

        var touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];
        
        var touch = event.touches[0] || touchPoints[0];
        mouseDownCallback(touch);
    }

    presenter.mouseUpEventDispatcher = function (event) {
        if (presenter.mouseData.isMouseDown) {
            presenter.mouseUpHandler(event);
        } else {
            return;
        }
    };

    presenter.mouseUpHandler = function (event) {
        if (presenter.configuration.isErrorMode && presenter.configuration.shouldBlockInErrorMode) {
            return;
        }

        $(presenter.imageElement).removeClass(CLASSES_NAMES.ELEMENT_IMAGE.MOUSE_CLICK);

        var addonContainer = presenter.$view.find(CLASSES_NAMES.WRAPPER.SELECTOR);
        var imageElement = $(addonContainer.find(CLASSES_NAMES.ELEMENT_IMAGE.SELECTOR))[0];

        presenter.mouseData.isMouseDown = false;
        if (presenter.configuration.newStep !== presenter.configuration.currentStep) {
            presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

            presenter.configuration.currentStep = presenter.configuration.newStep;
            presenter.triggerOnStepChangeUserEvent();

            presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);
        }

        if (presenter.configuration.stepwise) {
            presenter.moveToStep(imageElement, presenter.configuration.currentStep, presenter.configuration);
        }
    };

    function touchEndCallback (event) {
        presenter.isTouched = false;
        event.preventDefault();
        event.stopPropagation();

        presenter.mouseUpEventDispatcher();
    }

    function mouseClickCallback (eventData) {

        eventData.stopPropagation();

        if (presenter.configuration.isErrorMode && presenter.configuration.shouldBlockInErrorMode) return;

        var addonContainer = presenter.$view.find(CLASSES_NAMES.WRAPPER.SELECTOR);
        var imageElement = $(addonContainer.find(CLASSES_NAMES.ELEMENT_IMAGE.SELECTOR))[0];

        $(presenter.imageElement).addClass(CLASSES_NAMES.ELEMENT_IMAGE.MOUSE_CLICK);
        $(presenter.imageElement).removeClass(CLASSES_NAMES.ELEMENT_IMAGE.MOUSE_HOVER);

        if (presenter.mouseData.isMouseDragged) {
            presenter.mouseData.isMouseDragged = false;
            return;
        }

        var mousePositions = getMousePositions(eventData);
        presenter.configuration.newStep = presenter.whichStepZone(mousePositions, presenter.configuration);

        if (presenter.configuration.newStep !== presenter.configuration.currentStep) {
            presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

            presenter.configuration.currentStep = presenter.configuration.newStep;
            presenter.triggerOnStepChangeUserEvent();

            presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);
        }

        presenter.moveToStep(imageElement, presenter.configuration.currentStep, presenter.configuration);
    }

    function mouseMoveCallback (eventData) {
        if (presenter.configuration.isErrorMode && presenter.configuration.shouldBlockInErrorMode) return;
        var addonContainer = presenter.$addonContainer;
        var imageElement = presenter.imageElement;

        if (presenter.mouseData.isMouseDown) {
            presenter.mouseData.isMouseDragged = true;
            var mousePositions = getMousePositions(eventData);
            var relativeDistance;

            if(presenter.isTouched) {
                var scale = playerController.getScaleInformation();
                if (scale.scaleX !== 1.0 || scale.scaleY !== 1.0) {
                    mousePositions.x = mousePositions.x / scale.scaleX;
                    mousePositions.y = mousePositions.y / scale.scaleY;
                }
            }

            if(presenter.continuousEvents && presenter.continuousEventsSteps == "Smooth"){
                presenter.configuration.newStep = presenter.whichStepZoneSmooth(mousePositions, presenter.configuration);
            }else{
                presenter.configuration.newStep = presenter.whichStepZone(mousePositions, presenter.configuration);
            }

            if ( presenter.configuration.orientation == presenter.ORIENTATION.LANDSCAPE ) {
                relativeDistance = presenter.calculateRelativeDistanceX(imageElement, addonContainer, eventData, presenter.mouseData, imageElementData);
                presenter.mouseData.oldPosition.x = eventData.pageX;

                var minimumXPosition = ($(imageElement).width() / 2);
                var maximumXPosition = imageElementData.maxLeft + ($(imageElement).width() / 2);

                mousePositions.x = mousePositions.x > minimumXPosition ? mousePositions.x : minimumXPosition;
                mousePositions.x = mousePositions.x < maximumXPosition? mousePositions.x : maximumXPosition;

                if(!presenter.continuousEvents || (presenter.continuousEvents && presenter.continuousEventsSteps == "Smooth")){
                    $(imageElement).css({
                        left: (mousePositions.x + relativeDistance.horizontal - ($(imageElement).width() / 2)) + 'px'
                    });
                }

                if (presenter.configuration.newStep !== presenter.configuration.currentStep && presenter.continuousEvents) {
                    presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

                    presenter.configuration.currentStep = presenter.configuration.newStep;
                    presenter.triggerOnStepChangeUserEvent();

                    presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);

                    if(presenter.continuousEventsSteps == "Stick" || presenter.continuousEventsSteps == undefined || presenter.continuousEventsSteps == ""){
                        presenter.moveToStep(imageElement, presenter.configuration.currentStep, presenter.configuration);
                    }
                }

            } else {
                relativeDistance = presenter.calculateRelativeDistanceY(imageElement, addonContainer, eventData, presenter.mouseData, imageElementData);
                var minimumYPosition = ($(imageElement).height() / 2);
                var maximumYPosition = imageElementData.maxTop + ($(imageElement).height() / 2);
                mousePositions.y = mousePositions.y > minimumYPosition ? mousePositions.y : minimumYPosition;
                mousePositions.y = mousePositions.y < maximumYPosition ? mousePositions.y : maximumYPosition;

                presenter.mouseData.oldPosition.y = eventData.pageY;

                if(!presenter.continuousEvents || (presenter.continuousEvents && presenter.continuousEventsSteps == "Smooth")){
                    $(imageElement).css({
                        top: (mousePositions.y + relativeDistance.vertical - ($(imageElement).height() / 2)) + 'px'
                    });
                }

                if (presenter.configuration.newStep !== presenter.configuration.currentStep && presenter.continuousEvents) {
                    presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

                    presenter.configuration.currentStep = presenter.configuration.newStep;
                    presenter.triggerOnStepChangeUserEvent();

                    presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);

                    if(presenter.continuousEventsSteps == "Stick" || presenter.continuousEventsSteps == undefined || presenter.continuousEventsSteps == ""){
                        presenter.moveToStep(imageElement, presenter.configuration.currentStep, presenter.configuration);
                    }
                }
            }
        }
        if (eventData.preventDefault && eventData.target && presenter.$view.find(eventData.target).length) {
            eventData.preventDefault();
        }
    }

    function touchMoveCallback (event) {
        event.stopPropagation();
        event.preventDefault();

        var touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];

        var touch = event.touches[0] || touchPoints[0];
        mouseMoveCallback(touch);
    }

    function handleMouseDrag(addonContainer) {
        const $icplayer = $('#_icplayer');
        presenter.isWindowsMobile = false;

        if (window.navigator.msPointerEnabled && MobileUtils.isMobileUserAgent(window.navigator.userAgent)) {
            presenter.isWindowsMobile = true;
        }

        var imageElement = $(addonContainer.find(CLASSES_NAMES.ELEMENT_IMAGE.SELECTOR))[0];

        $(imageElement).hover(
            function() {
                $(this).toggleClass(CLASSES_NAMES.ELEMENT_IMAGE.MOUSE_HOVER, !presenter.mouseData.isMouseDown);
            },
            function() {
                $(this).toggleClass(CLASSES_NAMES.ELEMENT_IMAGE.MOUSE_HOVER, presenter.mouseData.isMouseDown);
            }
        );

        if (presenter.isWindowsMobile) {
            imageElement.addEventListener('MSPointerDown', touchStartCallback, false);
            imageElement.addEventListener('MSPointerMove', touchMoveCallback, false);
        } else {
            imageElement.ontouchstart = touchStartCallback;
            imageElement.ontouchmove = touchMoveCallback;
        }

        $(imageElement).mousedown(mouseDownCallback);
        $icplayer.mousemove(mouseMoveCallback);
        $icplayer.mouseup(presenter.mouseUpEventDispatcher);
        $(document).mouseup(presenter.mouseUpEventDispatcher);
        imageElement.ontouchend = touchEndCallback;

        $(addonContainer).click(mouseClickCallback);


        $(imageElement).hover(function() {
            $(presenter.imageElement).addClass(CLASSES_NAMES.ELEMENT_IMAGE.MOUSE_HOVER);
        }, function() {
            $(presenter.imageElement).removeClass(CLASSES_NAMES.ELEMENT_IMAGE.MOUSE_HOVER);
        });
    }

    function getMousePositions(eventData) {
        var popupTop = 0,
            popupLeft = 0;

        var $popup = presenter.$view.parent('.ic_popup_page').offset();
        if ($popup !== null) {
            var popupTop = $popup.top;
            var popupLeft = $popup.left;
        }

        setAddonPosition();

        if (eventData.offsetX != null && eventData.offsetY != null) {
            position = {
                x:(eventData.offsetX + $(eventData.target).offset().left - presenter.configuration.offset.left) - popupLeft,
                y:(eventData.offsetY + $(eventData.target).offset().top - presenter.configuration.offset.top) - popupTop
            };
        } else {
            var scroll = getScroll();
            position = {
                x: (scroll.left + eventData.pageX - presenter.configuration.offset.left) - popupLeft,
                y: (scroll.top + eventData.pageY - presenter.configuration.offset.top) - popupTop
            }
        }

        return position;
    }

    function getScroll() {
        var top = $('body').scrollTop();
        var left = $('body').scrollLeft();
        return {top: top, left: left};
    }

    function setAddonPosition() {
        presenter.configuration.offset = {};
        presenter.configuration.offset.left = presenter.$addonContainer.offset().left;
        presenter.configuration.offset.top = presenter.$addonContainer.offset().top;
    }

    presenter.upgradeModel = function (model) {
        let upgradedModel = presenter.upgradeTTS(model);
        upgradedModel = presenter.upgradeStepwiseModeBarAlwaysVisible(upgradedModel);
        return upgradedModel;
    };

    presenter.upgradeTTS = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (upgradedModel['speechTexts'] === undefined) {
            upgradedModel['speechTexts'] = {
                Step: {Step: "Step"}
            };
        }

        if (upgradedModel['langAttribute'] === undefined) {
            upgradedModel['langAttribute'] = "";
        }

        if (upgradedModel['Alternative texts'] === undefined) {
            upgradedModel['Alternative texts'] = [
                {
                    "Alternative text": "",
                    "Step number": ""
                }
            ];
        }

        return upgradedModel;
    };

    presenter.upgradeStepwiseModeBarAlwaysVisible = function (model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel.hasOwnProperty("StepwiseModeBarAlwaysVisible")) {
            upgradedModel["StepwiseModeBarAlwaysVisible"] = "False";
        }

        return upgradedModel;
    };

    function presenterLogic(view, model, preview) {
        var upgradedModel = presenter.upgradeModel(model);

        presenter.imageLoadedDeferred = new jQuery.Deferred();
        presenter.imageLoaded = presenter.imageLoadedDeferred.promise();

        presenter.addonID = upgradedModel.ID;
        presenter.$view = $(view);
        presenter.view = view;
        onStepChangeEvent = upgradedModel.onStepChange;
        presenter.continuousEvents = ModelValidationUtils.validateBoolean(upgradedModel["Continuous events"]);
        presenter.continuousEventsSteps = upgradedModel["Continuous events steps"];

        presenter.$addonContainer = presenter.$view.find(CLASSES_NAMES.WRAPPER.SELECTOR);

        DOMOperationsUtils.setReducedSize(presenter.$view, presenter.$addonContainer);

        presenter.configuration = presenter.convertModel(upgradedModel);
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        setAddonPosition();

        presenter.configuration.currentStep = presenter.configuration.initialStep;
        presenter.configuration.newStep = presenter.configuration.initialStep;
        presenter.configuration.snapPoints = [];

        loadImageElement(preview);

        presenter.$view.disableSelection();
        MutationObserverService.createDestroyObserver(presenter.addonID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();
    }

    function drawBurret() {
        if (!presenter.configuration.stepwise) return;

        var xPosition = $(presenter.$view).width() / 2;
        var yPosition = $(presenter.$view).height() / 2;
        var verticalLineLength = $(presenter.$view).height() / 4;
        var horizontalLineLength = $(presenter.$view).width() / 4;

        var canvas = document.createElement('canvas');
        $(canvas).css({
            position : 'absolute',
            top : 0,
            left : 0
        });
        $(canvas).attr('width', $(presenter.$view).width());
        $(canvas).attr('height', $(presenter.$view).height());
        $(canvas).addClass('slider-stepwise-bar');
        $(presenter.$view).prepend(canvas);

        if (presenter.configuration.orientation === presenter.ORIENTATION.LANDSCAPE) {
            $(canvas).drawLine({
                strokeStyle:"#000",
                strokeWidth:2,
                strokeCap:"round",
                x1:presenter.configuration.snapPoints[0], y1:yPosition,
                x2:presenter.configuration.snapPoints[presenter.configuration.stepsCount - 1], y2:yPosition
            });
        } else {
            $(canvas).drawLine({
                strokeStyle:"#000",
                strokeWidth:2,
                strokeCap:"round",
                x1:xPosition, y1:presenter.configuration.snapPoints[0],
                x2:xPosition, y2:presenter.configuration.snapPoints[presenter.configuration.stepsCount - 1]
            });
        }

        for (var i = 0; i < presenter.configuration.stepsCount; i++) {
            if (presenter.configuration.orientation === presenter.ORIENTATION.LANDSCAPE) {
                $(canvas).drawLine({
                    strokeStyle:"#000",
                    strokeWidth:2,
                    strokeCap:"round",
                    x1:presenter.configuration.snapPoints[i], y1:yPosition - verticalLineLength / 2,
                    x2:presenter.configuration.snapPoints[i], y2:yPosition + verticalLineLength / 2
                });
            } else {
                $(canvas).drawLine({
                    strokeStyle:"#000",
                    strokeWidth:2,
                    strokeCap:"round",
                    x1:xPosition - horizontalLineLength / 2, y1:presenter.configuration.snapPoints[i],
                    x2:xPosition + horizontalLineLength / 2, y2:presenter.configuration.snapPoints[i]
                });
            }
        }
    }

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
    };

    presenter.triggerOnStepChangeUserEvent = function () {
        if (!onStepChangeEvent) return;

        playerController.getCommands().executeEventCode(onStepChangeEvent);
    };

    presenter.getContainerAndImageElements = function () {
        var addonContainer = presenter.$view.find(CLASSES_NAMES.WRAPPER.SELECTOR);
        var imageElement = addonContainer.find(CLASSES_NAMES.ELEMENT_IMAGE.SELECTOR)[0];

        return {
            addonContainer: addonContainer,
            imageElement: imageElement
        };
    };

    presenter.moveToInitialStepCommand = function (params) {
        var elements = this.getContainerAndImageElements();
        var triggerEvent = presenter.parseAdditionalTriggerEventParam(params, 0);

        if(presenter.configuration.currentStep !== presenter.configuration.initialStep) {
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

            presenter.configuration.currentStep = presenter.configuration.initialStep;
            presenter.moveToStep(elements.imageElement, presenter.configuration.currentStep, presenter.configuration);

            presenter.triggerOnStepChangeUserEvent();
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);
        }
    };

    presenter.moveToInitialStep = function (triggerEvent) {
        presenter.moveToInitialStepCommand([triggerEvent + '']);
    };

    presenter.moveToCommand = function (params) {
        var elements = this.getContainerAndImageElements();
        var step = parseInt(params[0], 10);
        var triggerEvent = presenter.parseAdditionalTriggerEventParam(params, 1);

        if (!isNaN(step) && step >= 1 && step <= presenter.configuration.stepsCount) {
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

            presenter.configuration.currentStep = step;
            presenter.moveToStep(elements.imageElement, presenter.configuration.currentStep, presenter.configuration);

            presenter.triggerOnStepChangeUserEvent();
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);
        }
    };

    presenter.moveTo = function (step, triggerEvent) {
        presenter.moveToCommand([step, triggerEvent + '']);
    };

    presenter.moveToLastCommand = function(params) {
        var elements = this.getContainerAndImageElements();
        var triggerEvent = presenter.parseAdditionalTriggerEventParam(params, 0);

        if (presenter.configuration.currentStep !== presenter.configuration.stepsCount) {
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

            presenter.configuration.currentStep = presenter.configuration.stepsCount;
            presenter.moveToStep(elements.imageElement, presenter.configuration.currentStep, presenter.configuration);

            presenter.triggerOnStepChangeUserEvent();
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);
        }
    };

    presenter.moveToLast = function(triggerEvent) {
        presenter.moveToLastCommand([triggerEvent + '']);
    };

    presenter.moveToFirstCommand = function (params) {
        var elements = this.getContainerAndImageElements();
        var triggerEvent = presenter.parseAdditionalTriggerEventParam(params, 0);

        if (presenter.configuration.currentStep !== 1) {
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

            presenter.configuration.currentStep = 1;
            presenter.moveToStep(elements.imageElement, presenter.configuration.currentStep, presenter.configuration);

            presenter.triggerOnStepChangeUserEvent();
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);
        }
    };

    presenter.moveToFirst = function (triggerEvent) {
        presenter.moveToFirstCommand([triggerEvent + '']);
    };

    presenter.nextStepCommand = function (params) {
        var elements = this.getContainerAndImageElements();
        var triggerEvent = presenter.parseAdditionalTriggerEventParam(params, 0);

        if (presenter.configuration.currentStep + 1 <= presenter.configuration.stepsCount) {
            if (triggerEvent)
                presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

            presenter.configuration.currentStep++;
            presenter.moveToStep(elements.imageElement, presenter.configuration.currentStep, presenter.configuration);

            presenter.triggerOnStepChangeUserEvent();
            if (triggerEvent)
                presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);
        }
    };

    presenter.nextStep = function (triggerEvent) {
        presenter.nextStepCommand([triggerEvent + '']);
    };

    presenter.previousStepCommand = function (params) {
        var elements = this.getContainerAndImageElements();
        var triggerEvent = presenter.parseAdditionalTriggerEventParam(params, 0);

        if (presenter.configuration.currentStep - 1 >= 1) {
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

            presenter.configuration.currentStep--;
            presenter.moveToStep(elements.imageElement, presenter.configuration.currentStep, presenter.configuration);

            presenter.triggerOnStepChangeUserEvent();
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);
        }
    };

    presenter.previousStep = function (triggerEvent) {
        presenter.previousStepCommand([triggerEvent + '']);
    };

    presenter.getCurrentStep = function () {
        return presenter.configuration.currentStep.toString();
    };

    presenter.parseAdditionalTriggerEventParam = function (params, numberOfDefaultParams) {
        if (!params[numberOfDefaultParams]) return true;

        return params[numberOfDefaultParams].toLowerCase() != 'false';
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.configuration.isErrorMode && presenter.configuration.shouldBlockInErrorMode) return;

        var commands = {
            'moveTo': presenter.moveToCommand,
            "moveToLast": presenter.moveToLastCommand,
            'moveToFirst': presenter.moveToFirst,
            'moveToInitialStep' : presenter.moveToInitialStepCommand,
            'nextStep': presenter.nextStep,
            'previousStep': presenter.previousStep,
            'getCurrentStep': presenter.getCurrentStep,
            'show': presenter.show,
            'hide': presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.convertStepsCount = function (stepsCount) {
        var convertedStepsCount = ModelValidationUtils.validatePositiveInteger(stepsCount);

        if (!convertedStepsCount.isValid) {
            return { isError: true, errorCode: 'SC_01' };
        }

        if (convertedStepsCount.value < 2) {
            return { isError: true, errorCode: 'SC_02' };
        }

        return { isError: false, stepsCount: convertedStepsCount.value };
    };

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();
        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    presenter.convertSpeechTexts = function(speechTextsModel) {
        var speechTexts = {
            step: getSpeechTextProperty(speechTextsModel["Step"]["Step"], "Step")
        };
        return speechTexts;
    };

    presenter.validateAlternativeTexts = function(altTextsModel, stepsCount) {
        var altTexts = [];
        for (var i = 0; i < stepsCount; i++) {
            altTexts.push('');
        }

        for (var i = 0; i < altTextsModel.length; i++) {
            var altText = altTextsModel[i];

            if (altText["Step number"].length == 0) continue;

            if (isNaN(altText["Step number"])) {
                return { isError : true, errorCode : 'AT_01' };
            }

            if (
                    (altText["Step number"].length > 0 && altText["Alternative text"].length == 0) ||
                    (altText["Step number"].length == 0 && altText["Alternative text"].length > 0)
            ) {
                return { isError : true, errorCode : 'AT_02' };
            }

            var stepNumber = Number(altText["Step number"]);
            if (stepNumber < 1 || stepNumber > stepsCount) {
                return { isError : true, errorCode : 'AT_01' };
            }
            if (altTexts[stepNumber - 1] != '') {
                return { isError : true, errorCode : 'AT_03' };
            }

            altTexts[stepNumber - 1] = altText['Alternative text'];
        }
        return { isError : false, value : altTexts };
    };

    presenter.convertModel = function(model) {
        var orientation = model.Orientation === 'Portrait' ? presenter.ORIENTATION.PORTRAIT : presenter.ORIENTATION.LANDSCAPE;
        var stepwise = ModelValidationUtils.validateBoolean(model.Stepwise);
        var stepsCount = 0;
        var initialStep = 1;

        if (ModelValidationUtils.isStringEmpty(model.ImageElement)) {
            return { isError : true, errorCode : 'ES_01' };
        }

        if (stepwise) {
            var convertedStepsCount = presenter.convertStepsCount(model.StepsCount);
            if (convertedStepsCount.isError) {
                return { isError: true, errorCode: convertedStepsCount.errorCode };
            }

            stepsCount = convertedStepsCount.stepsCount;

            if (ModelValidationUtils.isStringEmpty(model.InitialStep)) {
                initialStep = 1;
            } else {
                var convertedInitialStep = ModelValidationUtils.validateIntegerInRange(model.InitialStep, stepsCount, 1);
                if (!convertedInitialStep.isValid) {
                    return { isError: true, errorCode: 'IS_01' };
                }

                initialStep = convertedInitialStep.value;
            }
        }

        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        var speechTexts = presenter.convertSpeechTexts(model["speechTexts"]);

        var validatedAltTexts = presenter.validateAlternativeTexts(model['Alternative texts'], stepsCount);
        if (validatedAltTexts.isError) {
            return {isError: true, errorCode: validatedAltTexts.errorCode};
        }

        return {
            imageSrc : model.ImageElement,
            orientation : orientation,
            stepwise : stepwise,
            stepsCount : stepsCount,
            initialStep : initialStep,
            isVisibleByDefault: isVisible,
            isVisible: isVisible,
            isError : false,
            isErrorMode: false,
            shouldBlockInErrorMode: ModelValidationUtils.validateBoolean(model["Block in error checking mode"]),
            speechTexts: speechTexts,
            lang: model["langAttribute"],
            altTexts: validatedAltTexts.value,
            stepwiseModeBarAlwaysVisible: ModelValidationUtils.validateBoolean(model["StepwiseModeBarAlwaysVisible"])
        };
    };

    presenter.closestSmooth = 0;
    presenter.whichStepZoneSmooth = function (mousePositions, globalData) {
        var imageCenter = globalData.orientation === presenter.ORIENTATION.LANDSCAPE ? parseInt($(presenter.imageElement).css('left'), 10) +
                ($(presenter.imageElement).width()/2) : parseInt($(presenter.imageElement).css('top'), 10) + ($(presenter.imageElement).height()/2),
            margin = parseInt((globalData.snapPoints[1] - globalData.snapPoints[0]) / 5, 10);

        for (var j = 0; j < globalData.snapPoints.length; j++) {
            var pointBefore = parseInt(globalData.snapPoints[j] - margin, 10);
            var pointAfter = parseInt(globalData.snapPoints[j] + margin, 10);
            if(imageCenter > pointBefore && imageCenter < pointAfter){
                if(presenter.closestSmooth != j){
                    presenter.closestSmooth = j;
                }
            }
        }

        return presenter.closestSmooth + 1;
    };

    presenter.whichStepZone = function(mousePositions, globalData) {
        var snapPointDistance = [];

        var mousePosition = globalData.orientation === presenter.ORIENTATION.LANDSCAPE ? mousePositions.x : mousePositions.y;

        for (var i = 0; i < globalData.snapPoints.length; i++) {
            snapPointDistance.push({
                distance : Math.abs(mousePosition - globalData.snapPoints[i]),
                snapPoint : i
            });
        }

        var closest = 0;
        for (var j = 1; j < globalData.snapPoints.length; j++) {
            if (snapPointDistance[closest].distance > snapPointDistance[j].distance) {
                closest = j;
            }
        }

        return closest + 1;
    };

    presenter.calculateRelativeDistanceX = function(imageElement, container, eventData, pastEventData, imageElementData) {
        var left = parseInt($(imageElement).css('left'), 10);
        var horizontal = Math.round(eventData.pageX - pastEventData.oldPosition.x);

        var isIE = /*@cc_on!@*/false || !!document.documentMode;

        if(isIE){
            if(horizontal > 8 && window.screen.deviceXDPI>96){
                horizontal = horizontal/1.5;
            }
        }

        if (left + horizontal < 0 || left + horizontal > imageElementData.maxLeft) {
            horizontal = 0;
        }

        return { left: left, horizontal: horizontal };
    };

    presenter.calculateRelativeDistanceY = function(imageElement, container, eventData, pastEventData, imageElementData) {
        var top = parseInt($(imageElement).css('top'), 10);
        var vertical = eventData.pageY - pastEventData.oldPosition.y;

        if (top + vertical < 0 || top + vertical > imageElementData.maxTop) {
            vertical = 0;
        }

        return { top: top, vertical: vertical };
    };

    presenter.createEventData = function (step, moveIn) {
        return {
            source : presenter.addonID,
            item : "" + step,
            value : moveIn ? "1" : "0",
            score : ''
        };
    };

    presenter.triggerStepChangeEvent = function(step, moveIn) {
        var eventData = this.createEventData(step, moveIn);
        if (playerController != null) {
            playerController.getEventBus().sendEvent('ValueChanged', eventData);
        }
    };

    presenter.addDisabledClass = function () {
        presenter.getContainerAndImageElements().addonContainer.addClass('disabled');
    };

    presenter.removeDisabledClass = function () {
        presenter.getContainerAndImageElements().addonContainer.removeClass('disabled');
    };

    presenter.reset = function () {
        presenter.configuration.isErrorMode = false;
        presenter.removeDisabledClass();
        var elements = this.getContainerAndImageElements();
        presenter.configuration.currentStep = presenter.configuration.initialStep;
        presenter.moveToStep(elements.imageElement, presenter.configuration.currentStep, presenter.configuration);

        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.getState = function() {
        var state = {
            'currentStep' : presenter.configuration.currentStep,
            'isVisible' : presenter.configuration.isVisible
        };
        return JSON.stringify(state);
    };

    presenter.setState = function(stateString) {
        var state = JSON.parse(stateString);

        presenter.configuration.currentStep = state['currentStep'];
        presenter.configuration.isVisible = state['isVisible'];

        $.when(presenter.imageLoaded).then(presenter.loadImagesCallback);
    };

    presenter.loadImagesCallback = function() {
        var elements = presenter.getContainerAndImageElements();

        presenter.moveToStep(elements.imageElement, presenter.configuration.currentStep, presenter.configuration);
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {

        var keys = {
            ENTER: 13,
            ARROW_LEFT: 37,
            ARROW_UP: 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN: 40
        };

        function nextStep () {
            presenter.nextStep(event);
            presenter.readStep(presenter.configuration.currentStep);
        }

        function prevStep () {
            presenter.previousStep(event);
            presenter.readStep(presenter.configuration.currentStep);
        }

        function readCurrentStep () {
            presenter.readStep(presenter.configuration.currentStep);
        }

        var mapping = {};
        mapping[keys.ARROW_LEFT] = prevStep;
        mapping[keys.ARROW_UP] = prevStep;
        mapping[keys.ARROW_DOWN] = nextStep;
        mapping[keys.ARROW_RIGHT] = nextStep;
        mapping[keys.ENTER] = readCurrentStep;

        try {
            mapping[keycode]();
        } catch (er) {
        }

    };

    presenter.isEnterable = function() {
        return false;
    };

    presenter.readStep = function(index) {
        var voices = [];
        var altText = presenter.configuration.altTexts[index - 1];
        if (altText.length == 0) {
            voices.push(window.TTSUtils.getTextVoiceObject(presenter.configuration.speechTexts.step + ' ' + index));
        } else {
            voices.push(window.TTSUtils.getTextVoiceObject(presenter.configuration.speechTexts.step));
            voices.push(window.TTSUtils.getTextVoiceObject(altText, presenter.configuration.lang));
        }
        presenter.speak(voices);
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }
        return null;
    };

    presenter.setWCAGStatus = function (isOn) {
        presenter.isWCAGOn = isOn;
    };

    presenter.speak = function(data) {
        var tts = presenter.getTextToSpeechOrNull(playerController);

        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.setShowErrorsMode = function() {
        presenter.configuration.isErrorMode = true;

        if (presenter.configuration.shouldBlockInErrorMode) {
            presenter.addDisabledClass();
        }
    };

    presenter.setWorkMode = function() {
        presenter.configuration.isErrorMode = false;
        presenter.removeDisabledClass();
    };

    presenter.destroy = function (event) {
        if (event.target !== presenter.view) {
            return;
        }

        const $icplayer = $('#_icplayer');
        $icplayer.off("mousemove", mouseMoveCallback);
        $icplayer.off("mouseup", presenter.mouseUpEventDispatcher);
        $(document).off('mouseup', presenter.mouseUpEventDispatcher);
    };

    return presenter;
}