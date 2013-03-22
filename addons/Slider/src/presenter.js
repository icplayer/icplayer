function AddonSlider_create () {
    var presenter = function () {};

    presenter.$view = null;
    presenter.savedState = null;

    var playerController, onStepChangeEvent;

    presenter.ORIENTATION = {
        LANDSCAPE : 0, // Horizontal
        PORTRAIT : 1 // Vertical
    };

    presenter.ERROR_CODES = {
        'ES_01' : "Element source was not given!",
        'SC_01' : "Steps count incorrect!",
        'SC_02' : "Steps count cannot be less than 2!",
        'IS_01' : "Initial step incorrect! It must be a positive number between 1 and steps count!"
    };

    presenter.addonID = '';

    var mouseData = {
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

    function loadImageElement(addonContainer, model, isPreview) {
        var imageElement = document.createElement('img');
        $(imageElement).attr('src', presenter.configuration.imageElement);
        addonContainer.html(imageElement);

        $(imageElement).load(function() {
            imageElementData.width = $(this).width();
            imageElementData.height = $(this).height();
            imageElementData.maxLeft = $(addonContainer).width() - $(this).width();
            imageElementData.maxTop = $(addonContainer).height() - $(this).height();

            $(this).remove();

            var imageContainer = document.createElement('div');
            $(imageContainer).addClass(CLASSES_NAMES.ELEMENT_IMAGE.STANDARD_CLASS);
            $(imageContainer).css({
                backgroundImage: "url('" + presenter.configuration.imageElement + "')",
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

            presenter.moveToStep(imageContainer, addonContainer, presenter.configuration.initialStep, presenter.configuration);

            if (!isPreview) {
                handleMouseDrag(addonContainer);
            } else {
                drawBurret();
            }

            presenter.setVisibility(presenter.configuration.isVisibleByDefault);
            if(presenter.savedState){
                presenter.$view.trigger('loadImagesEndCallback');
            }
        });
    }

    presenter.moveToStep = function(element, elementContainer, step, configuration) {
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

        mouseData.isMouseDown = true;
        mouseData.oldPosition.x = eventData.pageX;
        mouseData.oldPosition.y = eventData.pageY;
    }

    function touchStartCallback (event) {
        event.preventDefault();

        var touch = event.touches[0] || event.changedTouches[0];
        mouseDownCallback(touch);
    }

    function mouseUpCallback () {
        if (presenter.configuration.isErrorMode && presenter.configuration.shouldBlockInErrorMode) return;

        var addonContainer = presenter.$view.find(CLASSES_NAMES.WRAPPER.SELECTOR);
        var imageElement = $(addonContainer.find(CLASSES_NAMES.ELEMENT_IMAGE.SELECTOR))[0];

        mouseData.isMouseDown = false;
        if (presenter.configuration.newStep !== presenter.configuration.currentStep) {
            presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

            presenter.configuration.currentStep = presenter.configuration.newStep;
            presenter.triggerOnStepChangeUserEvent();

            presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);
        }

        if (presenter.configuration.stepwise) {
            presenter.moveToStep(imageElement, addonContainer, presenter.configuration.currentStep, presenter.configuration);
        }
    }

    function touchEndCallback (event) {
        event.preventDefault();

        mouseUpCallback();
    }

    function mouseClickCallback (eventData) {
        if (presenter.configuration.isErrorMode && presenter.configuration.shouldBlockInErrorMode) return;

        var addonContainer = presenter.$view.find(CLASSES_NAMES.WRAPPER.SELECTOR);
        var imageElement = $(addonContainer.find(CLASSES_NAMES.ELEMENT_IMAGE.SELECTOR))[0];

        if (mouseData.isMouseDragged) {
            mouseData.isMouseDragged = false;
            return;
        }

        var mousePositions = getMousePositions(eventData, addonContainer);
        presenter.configuration.newStep = presenter.whichStepZone(mousePositions, presenter.configuration);

        if (presenter.configuration.newStep !== presenter.configuration.currentStep) {
            presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

            presenter.configuration.currentStep = presenter.configuration.newStep;
            presenter.triggerOnStepChangeUserEvent();

            presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);
        }

        presenter.moveToStep(imageElement, addonContainer, presenter.configuration.currentStep, presenter.configuration);
    }

    function mouseMoveCallback (eventData) {
        if (presenter.configuration.isErrorMode && presenter.configuration.shouldBlockInErrorMode) return;

        var addonContainer = presenter.$view.find(CLASSES_NAMES.WRAPPER.SELECTOR);
        var imageElement = $(addonContainer.find(CLASSES_NAMES.ELEMENT_IMAGE.SELECTOR))[0];

        $(this).toggleClass(CLASSES_NAMES.ELEMENT_IMAGE.MOUSE_HOVER, !mouseData.isMouseDown);
        $(this).toggleClass(CLASSES_NAMES.ELEMENT_IMAGE.MOUSE_CLICK, mouseData.isMouseDown);

        if (mouseData.isMouseDown === true) {
            mouseData.isMouseDragged = true;
            var relativeDistance = presenter.calculateRelativeDistance(imageElement, addonContainer, eventData, mouseData, presenter.configuration.orientation, imageElementData, false);
            var left = relativeDistance.left;
            var top = relativeDistance.top;
            var distance = relativeDistance.distance;

            var mousePositions = getMousePositions(eventData, addonContainer);

            presenter.configuration.newStep = presenter.whichStepZone(mousePositions, presenter.configuration);

            mouseData.oldPosition.x = eventData.pageX;
            mouseData.oldPosition.y = eventData.pageY;

            $(imageElement).css({
                top:(top + distance.vertical) + 'px',
                left:(left + distance.horizontal) + 'px'
            });
        }
    }

    function touchMoveCallback (event) {
        event.preventDefault();

        var touch = event.touches[0] || event.changedTouches[0];
        mouseMoveCallback(touch);
    }

    function handleMouseDrag(addonContainer) {
        var imageElement = $(addonContainer.find(CLASSES_NAMES.ELEMENT_IMAGE.SELECTOR))[0];

        $(imageElement).hover(
            function() {
                $(this).toggleClass(CLASSES_NAMES.ELEMENT_IMAGE.MOUSE_HOVER, !mouseData.isMouseDown);
            },
            function() {
                $(this).toggleClass(CLASSES_NAMES.ELEMENT_IMAGE.MOUSE_HOVER, mouseData.isMouseDown);
            }
        );

        $(imageElement).mousedown(mouseDownCallback);
        imageElement.ontouchstart = touchStartCallback;

        $(imageElement).mouseup(mouseUpCallback);
        imageElement.ontouchend = touchEndCallback;

        $(addonContainer).click(mouseClickCallback);

        $(imageElement).mousemove(mouseMoveCallback);
        imageElement.ontouchmove = touchMoveCallback;
    }

    function getMousePositions(eventData, addonContainer) {
        return {
            x:eventData.pageX - $(addonContainer).offset().left,
            y:eventData.pageY - $(addonContainer).offset().top
        };
    }

    function presenterLogic(view, model, preview) {
        presenter.addonID = model.ID;
        presenter.$view = $(view);
        onStepChangeEvent = model.onStepChange;

        var $addonContainer = presenter.$view.find(CLASSES_NAMES.WRAPPER.SELECTOR);
        DOMOperationsUtils.setReducedSize(presenter.$view, $addonContainer);

        presenter.configuration = presenter.convertModel(model);
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.configuration.currentStep = presenter.configuration.initialStep;
        presenter.configuration.newStep = presenter.configuration.initialStep;
        presenter.configuration.snapPoints = [];

        presenter.$view.bind('loadImagesEndCallback', presenter.loadImagesCallback);
        loadImageElement($addonContainer, model, preview);
    }

    function drawBurret() {
        if (!presenter.configuration.stepwise) return;

        var element = presenter.$view.find('.slider-element-image:first')[0];
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
        $(presenter.$view).append(canvas);

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
            presenter.moveToStep(elements.imageElement, elements.addonContainer, presenter.configuration.currentStep, presenter.configuration);

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
            presenter.moveToStep(elements.imageElement, elements.addonContainer, presenter.configuration.currentStep, presenter.configuration);

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
            presenter.moveToStep(elements.imageElement, elements.addonContainer, presenter.configuration.currentStep, presenter.configuration);

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
            presenter.moveToStep(elements.imageElement, elements.addonContainer, presenter.configuration.currentStep, presenter.configuration);

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
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, false);

            presenter.configuration.currentStep++;
            presenter.moveToStep(elements.imageElement, elements.addonContainer, presenter.configuration.currentStep, presenter.configuration);

            presenter.triggerOnStepChangeUserEvent();
            if (triggerEvent) presenter.triggerStepChangeEvent(presenter.configuration.currentStep, true);
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
            presenter.moveToStep(elements.imageElement, elements.addonContainer, presenter.configuration.currentStep, presenter.configuration);

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

        return {
            imageElement : model.ImageElement,
            orientation : orientation,
            stepwise : stepwise,
            stepsCount : stepsCount,
            initialStep : initialStep,
            isVisibleByDefault: isVisible,
            isVisible: isVisible,
            isError : false,
            isErrorMode: false,
            shouldBlockInErrorMode: ModelValidationUtils.validateBoolean(model["Block in error checking mode"])
        };
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

    presenter.calculateRelativeDistance = function(imageElement, container, eventData, pastEventData, orientation, imageElementData, isClick) {
        var left = parseInt($(imageElement).css('left'), 10);
        var top = parseInt($(imageElement).css('top'), 10);

        var distance = {
            horizontal: !isClick ? eventData.pageX - pastEventData.oldPosition.x : eventData.pageX - $(imageElement).offset().left - imageElementData.width / 2,
            vertical: !isClick ? eventData.pageY - pastEventData.oldPosition.y : eventData.pageY - $(imageElement).offset().top - imageElementData.height / 2
        };

        if (presenter.ORIENTATION.LANDSCAPE === orientation) {
            distance.vertical = 0;

            if (!isClick) {
                if (left + distance.horizontal < 0 || left + distance.horizontal > imageElementData.maxLeft) {
                    distance.horizontal = 0;
                }
            } else {
                if (eventData.pageX < $(container).offset().left + imageElementData.width / 2) {
                    distance.horizontal = -left;
                } else if (eventData.pageX > $(container).offset().left + $(container).width() - imageElementData.width / 2) {
                    distance.horizontal = $(container).width() - imageElementData.width - left;
                }
            }

        } else {
            distance.horizontal = 0;
            if (!isClick) {
                if (top + distance.vertical < 0 || top + distance.vertical > imageElementData.maxTop) {
                    distance.vertical = 0;
                }
            } else {
                if (eventData.pageY < $(container).offset().top + imageElementData.height / 2) {
                    distance.vertical = -top;
                } else if (eventData.pageY > $(container).offset().top + $(container).height() - imageElementData.height / 2) {
                    distance.vertical = $(container).height() - imageElementData.height - top;
                }
            }
        }

        return {left:left, top:top, distance:distance};
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

    presenter.reset = function () {
        presenter.configuration.isErrorMode = false;

        var elements = this.getContainerAndImageElements();
        presenter.configuration.currentStep = presenter.configuration.initialStep;
        presenter.moveToStep(elements.imageElement, elements.addonContainer, presenter.configuration.currentStep, presenter.configuration);

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
        this.savedState = JSON.parse(stateString);
    };

    presenter.loadImagesCallback = function() {
        var elements = presenter.getContainerAndImageElements();
        var state = presenter.savedState;

        presenter.configuration.currentStep = state['currentStep'];
        presenter.configuration.isVisible = state['isVisible'];

        presenter.moveToStep(elements.imageElement, elements.addonContainer, presenter.configuration.currentStep, presenter.configuration);
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.setShowErrorsMode = function() {
        presenter.configuration.isErrorMode = true;
    };

    presenter.setWorkMode = function() {
        presenter.configuration.isErrorMode = false;
    };

    return presenter;
}