function AddonDouble_State_Button_create(){
    var presenter = function() {};

    var playerController;
    var isMouseDown = false;
    var isTouchDown = false;
    var isMouseBlocked = false;

    presenter.lastEvent = null;

    var CSS_CLASSES = {
        ELEMENT : "doublestate-button-element",
        MOUSE_HOVER : "doublestate-button-element-mouse-hover",
        MOUSE_CLICK : "doublestate-button-element-mouse-click",
        SELECTED : "doublestate-button-element-selected",
        SELECTED_MOUSE_HOVER : "doublestate-button-element-selected-mouse-hover",
        SELECTED_MOUSE_CLICK : "doublestate-button-element-selected-mouse-click"
    };

    function CSS_CLASSESToString() {
        return CSS_CLASSES.ELEMENT + " " + CSS_CLASSES.MOUSE_HOVER + " " + CSS_CLASSES.MOUSE_CLICK + " " +
            CSS_CLASSES.SELECTED + " " + CSS_CLASSES.SELECTED_MOUSE_HOVER + " " + CSS_CLASSES.SELECTED_MOUSE_CLICK;
    }

    presenter.DISPLAY_CONTENT_TYPE = {
        NONE: 0,
        TEXT: 1,
        IMAGE: 2,
        BOTH: 3
    };

    presenter.upgradeModel = function(model) {
        return presenter.upgradeDisable(model);
    };

    presenter.upgradeDisable = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["Disable"]) {
            upgradedModel["Disable"] = "False";
        }

        return upgradedModel;
    };

    presenter.executeUserEventCode = function (eventCode) {
        playerController.getCommands().executeEventCode(eventCode);
    };

    presenter.clickHandler = function(event) {
        if (event !== undefined) {
            event.stopPropagation();
        }

        if (presenter.configuration.isErrorMode && !presenter.configuration.enableCheckMode) {
            return;
        }

        var eventCode;

        if(!presenter.configuration.isDisabled) {
            presenter.configuration.isSelected = !presenter.configuration.isSelected;
            eventCode = presenter.isSelected() ? presenter.configuration.selected.event : presenter.configuration.deselected.event;
            presenter.executeUserEventCode(eventCode);
            presenter.setElementSelection();
            presenter.updateLaTeX();
            presenter.sendEventData();
        }
    };

    function handleTouchActions() {
        var element = presenter.$view.find('div[class*=doublestate-button-element]:first');

        element.on('touchstart', function (e) {
            isMouseBlocked = true;
            e.preventDefault();
            e.stopPropagation();
            presenter.lastEvent = e;
            isTouchDown = true;
        });

        element.on('touchend', function (e) {
            e.preventDefault();
            if (isTouchDown) {
                if ( presenter.lastEvent.type != e.type ) {
                    presenter.clickHandler(e);
                }
                isTouchDown = false;
            }
        });
    }

    function handleMouseActions() {
        var element = presenter.$view.find('div[class*=doublestate-button-element]:first');
		        
        element.on('mousedown', function(e) {
            if (!isMouseBlocked) {
                e.preventDefault();
                e.stopPropagation();
                presenter.lastEvent = e;
                isMouseDown = true;
            }
		});

        element.on('click', function(e){
            e.stopPropagation();
        });

		element.on('mouseup', function(e) {
            if (!isMouseBlocked) {
                e.preventDefault();
                e.stopPropagation();
                if (isMouseDown) {
                    if (presenter.lastEvent.type != e.type) {
                        presenter.clickHandler(e);
                    }
                    isMouseDown = false;
                }
            }
		});

        element.hover(
            function() {
                $(this).removeClass(CSS_CLASSESToString());
                $(this).addClass(presenter.isSelected() ? CSS_CLASSES.SELECTED_MOUSE_HOVER : CSS_CLASSES.MOUSE_HOVER);
            },
            function() {
                $(this).removeClass(CSS_CLASSESToString());
                $(this).addClass(presenter.isSelected() ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);
            }
        );
    }

    function setElementsDimensions(model, wrapper, element) {
        var viewDimensions = DOMOperationsUtils.getOuterDimensions(presenter.$view);
        var viewDistances = DOMOperationsUtils.calculateOuterDistances(viewDimensions);
        presenter.$view.css({
            width:(model.Width - viewDistances.horizontal) + 'px',
            height:(model.Height - viewDistances.vertical) + 'px'
        });

        DOMOperationsUtils.setReducedSize(presenter.$view, wrapper);
        DOMOperationsUtils.setReducedSize(wrapper, element);
    }

    function createImageElement(element) {
        var imageElement = document.createElement('img');
        $(imageElement).addClass('doublestate-button-image');
        $(imageElement).attr('src', presenter.isSelected() ? presenter.configuration.selected.image : presenter.configuration.deselected.image);
        $(element).append(imageElement);
    }

    function createTextElement(element) {
        var textElement = document.createElement('span');
        $(textElement).addClass('doublestate-button-text');
        $(textElement).html(presenter.isSelected() ? presenter.configuration.selected.text : presenter.configuration.deselected.text);
        $(element).append(textElement);
    }

    function createElements(wrapper) {
        var element = document.createElement('div');
        $(element).addClass(presenter.isSelected() ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);

        createImageElement(element);
        createTextElement(element);

        wrapper.append(element);

        return element;
    }

    function presenterLogic(view, model, preview) {
        presenter.$view = $(view);
        presenter.configuration = presenter.validateModel(model);

        var wrapper = $(presenter.$view.find('.doublestate-button-wrapper:first')[0]);
        var element = createElements(wrapper);

        setElementsDimensions(model, wrapper, element);
        presenter.setElementSelection();
        presenter.toggleDisable(presenter.configuration.isDisabled);
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.setTabindex(wrapper, presenter.configuration.isTabindexEnabled);

        if (!preview) {
            handleTouchActions();
            handleMouseActions();
        }
    }

    function applySelectionStyle(className) {
        var element = presenter.$view.find('div[class*=doublestate-button-element]:first');

        $(element).removeClass(CSS_CLASSESToString());
        $(element).addClass(className);
    }

    presenter.setElementSelection = function() {
        var element = presenter.$view.find('div[class*=doublestate-button-element]:first');
        var displayContent = presenter.isSelected() ? presenter.configuration.selected.displayContent : presenter.configuration.deselected.displayContent;

        var textElement = $(element).find('.doublestate-button-text');
        textElement.html(presenter.isSelected() ? presenter.configuration.selected.text : presenter.configuration.deselected.text);

        var imageElement = $(element).find('.doublestate-button-image');
        imageElement.attr('src', presenter.isSelected() ? presenter.configuration.selected.image : presenter.configuration.deselected.image);

        switch (displayContent) {
            case presenter.DISPLAY_CONTENT_TYPE.NONE:
                $(textElement).hide();
                $(imageElement).hide();
                break;
            case presenter.DISPLAY_CONTENT_TYPE.TEXT:
                $(textElement).show();
                $(imageElement).hide();
                break;
            case presenter.DISPLAY_CONTENT_TYPE.IMAGE:
                $(imageElement).show();
                $(textElement).hide();
                break;
            case presenter.DISPLAY_CONTENT_TYPE.BOTH:
                $(imageElement).show();
                $(textElement).show();
                break;
        }

        applySelectionStyle(presenter.isSelected() ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);

    };

    presenter.updateLaTeX = function () {
        var textElement = presenter.$view.find('.doublestate-button-text')[0];
        presenter.mathJaxProcessEnded.then(function () {
                MathJax.CallBack.Queue().Push(function () {MathJax.Hub.Typeset(textElement)});
        });
    };

    presenter.select = function () {
        if(!presenter.configuration.isSelected){
            presenter.configuration.isSelected = true;
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.deselect = function () {
        if(presenter.configuration.isSelected){
            presenter.configuration.isSelected = false;
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.isSelected = function () {
        return presenter.configuration.isSelected;
    };

    presenter.executeCommand = function(name) {
        if (presenter.configuration.isErrorMode) return;

        var commands = {
            'select': presenter.select,
            'deselect': presenter.deselect,
            'show': presenter.show,
            'hide': presenter.hide,
            'enable': presenter.enable,
            'disable': presenter.disable,
            'isSelected': presenter.isSelected
        };

        Commands.dispatch(commands, name, [], presenter);
    };

    presenter.isIE9 = function (userAgent) {
        userAgent = userAgent.toLowerCase();

        if (userAgent.indexOf('msie') != -1) {
            return parseInt(userAgent.split('msie')[1], 10) == 9;
        }

        return false;
    };

    presenter.setVisibility = function(isVisible) {
        if(presenter.isIE9(navigator.userAgent)) {
            presenter.$view.css('display', isVisible ? 'block' : "none");
        }

        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
        var eventBus = playerController.getEventBus();

        var mathJaxDeferred = new jQuery.Deferred();
        presenter.mathJaxProcessEndedDeferred = mathJaxDeferred;
        presenter.mathJaxProcessEnded = mathJaxDeferred.promise();

        MathJax.Hub.Register.MessageHook("End Process", function (message) {
            if ($(message[1]).hasClass('ic_page')) {
                if(presenter.mathJaxProcessEndedDeferred.state() != 'resolved'){
                    presenter.mathJaxProcessEndedDeferred.resolve();
                }
            }
        });

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
    };

    presenter.show = function() {
        if (!presenter.configuration.isVisible) {
            presenter.setVisibility(true);
            presenter.configuration.isVisible = true;
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.hide = function() {
        if (presenter.configuration.isVisible) {
            presenter.setVisibility(false);
            presenter.configuration.isVisible = false;
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.enable = function() {
        if (presenter.configuration.isDisabled) {
            presenter.toggleDisable(false);
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.disable = function() {
        if (!presenter.configuration.isDisabled) {
            presenter.toggleDisable(true);
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.toggleDisable = function(disable) {
        var element = presenter.$view.find('div[class*=doublestate-button-element]:first');

        if(disable) {
            element.addClass("disable");
        } else {
            element.removeClass("disable");
        }

        presenter.configuration.isDisabled = disable;
    };

    presenter.reset = function() {
        presenter.configuration.isSelected = presenter.configuration.isSelectedByDefault;
        presenter.configuration.isErrorMode = false;

        presenter.setElementSelection();

        if (presenter.configuration.isVisibleByDefault) {
            presenter.show();
        } else {
            presenter.hide();
        }

        presenter.toggleDisable(presenter.configuration.isDisabledByDefault);
        presenter.updateLaTeX();
    };

    presenter.getState = function() {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible,
            isSelected: presenter.configuration.isSelected,
            isDisabled: presenter.configuration.isDisabled
        });
    };

    presenter.setState = function(state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsedState = JSON.parse(state);

        if (parsedState.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }

        presenter.toggleDisable(parsedState.isDisabled);

        presenter.configuration.isSelected = parsedState.isSelected;
        presenter.setElementSelection();
    };

    presenter.validateString = function (imageSrc) {
        var isEmpty = ModelValidationUtils.isStringEmpty(imageSrc);

        return {
            isEmpty: isEmpty,
            value: isEmpty ? "" : imageSrc
        };
    };

    presenter.determineDisplayContent = function(text, image) {
        var displayContent = presenter.DISPLAY_CONTENT_TYPE.NONE;
        if (!text.isEmpty && image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.TEXT;
        } else if (text.isEmpty && !image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.IMAGE;
        } else if (!text.isEmpty && !image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.BOTH;
        }

        return displayContent;
    };

    presenter.validateModel = function (model) {
        var text = presenter.validateString(model.Text);
        var image = presenter.validateString(model.Image);
        var selectedText = presenter.validateString(model["Text selected"]);
        var selectedImage = presenter.validateString(model["Image selected"]);

        var isDisabled = ModelValidationUtils.validateBoolean(model.Disable);
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        var isSelected = ModelValidationUtils.validateBoolean(model.isSelected);
        var isTabindexEnabled = ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"]);
        var enableCheckMode = ModelValidationUtils.validateBoolean(model["Do not block in check mode"]);

        return {
            addonID: model.ID,
            selected: {
                text: selectedText.value,
                image: selectedImage.value,
                event: model.onSelected,
                displayContent: presenter.determineDisplayContent(selectedText, selectedImage)
            },
            deselected: {
                text: text.value,
                image: image.value,
                event: model.onDeselected,
                displayContent: presenter.determineDisplayContent(text, image)
            },
            isSelected: isSelected,
            isSelectedByDefault: isSelected,
            isDisabled: isDisabled,
            isDisabledByDefault: isDisabled,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            isErrorMode: false,
            isTabindexEnabled: isTabindexEnabled,
            enableCheckMode: enableCheckMode
        };
    };

    presenter.createEventData = function() {
        return {
            source : presenter.configuration.addonID,
            item : '',
            value : presenter.isSelected() ? '1' : '0',
            score : ''
        };
    };

    presenter.sendEventData = function () {
        var eventData = presenter.createEventData();
        if (playerController !== null) {
            playerController.getEventBus().sendEvent('ValueChanged', eventData);
        }
    };

    presenter.setShowErrorsMode = function () {
        presenter.configuration.isErrorMode = true;
    };

    presenter.setWorkMode = function () {
        presenter.configuration.isErrorMode = false;
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.configuration.isErrorMode = true;
        }

        if (eventName == "HideAnswers") {
            presenter.configuration.isErrorMode = false;
        }
    };

    presenter.keyboardController = function(keyCode, isShift) {
        if (keyCode == 13 || keyCode == 32) {
            presenter.clickHandler();
        }
    };

    presenter.setTabindex = function (element, isTabindexEnabled) {
        var tabindexValue = isTabindexEnabled ? "0" : "-1";
        element.attr("tabindex", tabindexValue);
    };

    return presenter;
}