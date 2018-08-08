function AddonSingle_State_Button_create() {
    var presenter = function() {};

    presenter.DISPLAY_CONTENT_TYPE = {
        NONE: 0,
        TITLE: 1,
        IMAGE: 2,
        BOTH: 3
    };

    presenter.executeUserEventCode = function() {
        if (presenter.playerController == null) return;
        if (presenter.configuration.onClickEvent.isEmpty) return;

        presenter.playerController.getCommands().executeEventCode(presenter.configuration.onClickEvent.value);
    };

    presenter.clickHandler = function (event) {
        if (event !== undefined) {
            event.stopPropagation();
        }

        if (presenter.configuration.isDisabled) return;
        if (presenter.configuration.isErrorMode) return;

        presenter.executeUserEventCode();
        presenter.triggerButtonClickedEvent();
    };

    function handleMouseActions() {
        var $element = presenter.$view.find('div[class*=singlestate-button-element]:first');
        $element.click(presenter.clickHandler);
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
        var $imageElement = $(document.createElement('img'));
        $imageElement.addClass('singlestate-button-image');
        $imageElement.attr('src', presenter.configuration.image);
        $(element).append($imageElement);
    }

    function createTitleElement(element) {
        var $titleElement = $(document.createElement('span'));
        $titleElement.addClass('singlestate-button-title');
        $titleElement.html(presenter.configuration.title);
        $(element).append($titleElement);
    }

    function createElements(wrapper) {
        var $element = $(document.createElement('div'));
        $element.addClass('singlestate-button-element');
        if (presenter.configuration.isTabindexEnabled) {$element.attr('tabindex', '0');}

        switch (presenter.configuration.displayContent) {
            case presenter.DISPLAY_CONTENT_TYPE.TITLE:
                createTitleElement($element);

                break;
            case presenter.DISPLAY_CONTENT_TYPE.IMAGE:
                createImageElement($element);

                break;
            case presenter.DISPLAY_CONTENT_TYPE.BOTH:
                createImageElement($element);
                createTitleElement($element);

                break;
        }

        wrapper.append($element);

        return $element;
    }

    function presenterLogic(view, model, preview) {
        presenter.addonID = model.ID;
        presenter.$view = $(view);

        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);

        var $wrapper = $(presenter.$view.find('.singlestate-button-wrapper:first')[0]);
        var $element = createElements($wrapper);

        setElementsDimensions(upgradedModel, $wrapper, $element);
        presenter.toggleDisable(presenter.configuration.isDisabledByDefault);
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);

        if (!preview) {
            handleMouseActions();
        }
    }

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;

        var eventBus = presenter.playerController.getEventBus();

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
    };

    presenter.upgradeModel = function(model) {
        return presenter.upgradeDisable(model);
    };

    presenter.upgradeDisable = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel.Disable) {
            upgradedModel.Disable = "False";
        }

        return upgradedModel;
    };

    presenter.validateString = function (imageSrc) {
        var isEmpty = ModelValidationUtils.isStringEmpty(imageSrc);

        return {
            isEmpty: isEmpty,
            value: isEmpty ? "" : imageSrc
        };
    };

    presenter.determineDisplayContent = function(title, image) {
        var displayContent = presenter.DISPLAY_CONTENT_TYPE.NONE;

        if (!title.isEmpty && image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.TITLE;
        } else if (title.isEmpty && !image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.IMAGE;
        } else if (!title.isEmpty && !image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.BOTH;
        }

        return displayContent;
    };

    presenter.validateModel = function (model) {
        var title = presenter.validateString(model.Title);
        var image = presenter.validateString(model.Image);
        var onClickEvent = presenter.validateString(model.onClick);
        var isDisabled = ModelValidationUtils.validateBoolean(model.Disable);
        var isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        var isTabindexEnabled = ModelValidationUtils.validateBoolean(model['Is Tabindex Enabled']);

        return {
            displayContent: presenter.determineDisplayContent(title, image),
            title: title.value,
            image: image.value,
            onClickEvent: onClickEvent,
            isDisabled: isDisabled,
            isDisabledByDefault: isDisabled,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            isErrorMode: false,
            isTabindexEnabled: isTabindexEnabled
        };
    };

    presenter.executeCommand = function(name, params) {
        if (presenter.configuration.isErrorMode) return;

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'enable': presenter.enable,
            'disable': presenter.disable
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.createEventData = function() {
        return {
            source : presenter.addonID,
            item : '',
            value : '1',
            score : ''
        };
    };

    presenter.triggerButtonClickedEvent = function() {
        if (presenter.playerController == null) return;

        presenter.playerController.getEventBus().sendEvent('ValueChanged', this.createEventData());
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        this.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        this.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.reset = function() {
        presenter.configuration.isErrorMode = false;
        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        if (presenter.configuration.isVisible) {
            this.show();
        } else {
            this.hide();
        }
        presenter.toggleDisable(this.configuration.isDisabledByDefault);
    };

    presenter.enable = function() {
        this.toggleDisable(false);
    };

    presenter.disable = function() {
        this.toggleDisable(true);
    };

    presenter.toggleDisable = function(disable) {
        var element = presenter.$view.find('div[class*=singlestate-button-element]:first');
        if(disable) {
            element.addClass("disable");
        } else {
            element.removeClass("disable");
        }
        presenter.configuration.isDisabled = disable;
    };

    presenter.getState = function() {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible,
            isDisabled: presenter.configuration.isDisabled
        });
    };

    presenter.setState = function(stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return;

        var state = JSON.parse(stateString);
        presenter.configuration.isDisabled = state.isDisabled;
        presenter.configuration.isVisible = state.isVisible;

        if (presenter.configuration.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }

        presenter.toggleDisable(presenter.configuration.isDisabled);
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

    presenter.keyboardController = function(keyCode, isShiftDown, event) {
        event && event.preventDefault();
        if (keyCode == window.KeyboardControllerKeys.ENTER) {
            presenter.clickHandler();
        }
    };
    return presenter;
}