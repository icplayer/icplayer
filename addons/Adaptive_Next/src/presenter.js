function AddonAdaptive_Next_create() {
    var presenter = function() {};

    presenter.isAdaptivePreviewMode = false;

    presenter.CONSTANTS = {
        NEXT_IMAGE: 'baseline-navigate_next-24px.svg',
        PREV_IMAGE: 'baseline-navigate_prev-24px.svg'
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

        presenter.triggerButtonClickedEvent();
    };

    function handleMouseActions() {
        var $element = presenter.$view.find('div[class*=adaptive-next-button-element]');
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
        $imageElement.addClass('adaptive-next-image');

        var resource = presenter.configuration.Direction ? presenter.CONSTANTS.NEXT_IMAGE : presenter.CONSTANTS.PREV_IMAGE;
        var source = getImageUrlFromResources(resource);

        if (presenter.configuration.Image) {
            source = presenter.configuration.Image;
        }

        $imageElement.attr('src', source);
        $(element).append($imageElement);
    }

    function createElements(wrapper) {
        var $element = $(document.createElement('div'));
        $element.addClass('adaptive-next-button-element');
        if (presenter.configuration.isTabindexEnabled) {$element.attr('tabindex', '0');}

        createImageElement($element);

        wrapper.append($element);

        return $element;
    }

    function presenterLogic(view, model, isPreview) {
        presenter.addonID = model.ID;
        presenter.$view = $(view);

        var validatedModel = presenter.validateModel(model);

        if (!validatedModel.isValid) {
            return;
        }

        presenter.configuration = validatedModel.value;

        var $wrapper = $(presenter.$view.find('.adaptive-next-wrapper')[0]);
        var $element = createElements($wrapper);

        setElementsDimensions(model, $wrapper, $element);
        presenter.toggleDisable(presenter.configuration.isDisabled);
        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        if (!isPreview) {
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


    presenter.validateString = function (imageSrc) {
        var isEmpty = ModelValidationUtils.isStringEmpty(imageSrc);

        return {
            isEmpty: isEmpty,
            value: isEmpty ? "" : imageSrc
        };
    };

    presenter.validateModel = function (model) {
        var modelValidator = new ModelValidator();

        var validatedModel = modelValidator.validate(model, [
            ModelValidators.utils.FieldRename("Is Visible", "isVisible", ModelValidators.Boolean('isVisible')),
            ModelValidators.Boolean('Direction'),
            ModelValidators.utils.FieldRename("Is disabled", "isDisabled", ModelValidators.Boolean('isDisabled')),
            ModelValidators.Integer('Width'),
            ModelValidators.Integer('Height'),
            ModelValidators.DumbString('ID'),
            ModelValidators.String('Image', {'default': null})
        ]);

        return validatedModel;
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

    presenter.triggerButtonClickedEvent = function() {
        if (presenter.playerController == null) return;
        presenter.isAdaptivePreviewMode = window.adaptivePreviewMode ? true : false;

        var adaptiveLearningService = presenter.playerController.getAdaptiveLearningService();

        if (!presenter.configuration.Direction) {
            adaptiveLearningService.moveToPrevPage();
            return;
        }

        var connections = adaptiveLearningService.getCurrentPageConnections();

        for (var i = 0; i < connections.length; i++) {
            var isMetCondition = presenter.evaluateCondition(connections[i].conditions);

            if (isMetCondition) {
                adaptiveLearningService.moveToNextPage(connections[i].target);
                return;
            }
        }
    };

    presenter.evaluateCondition = function(condition) {
        if (condition === '') {
            return true;
        }
        try {
            return eval(condition);
        } catch (e) {
            console.log(condition + ' error');
            return false;
        }
    };

    function expect(pageID) {
        if (presenter.isAdaptivePreviewMode) {
            return window.pagesScores[pageID];
        } else {
            var scoreService = presenter.playerController.getScore();

            return scoreService.getPageScoreById(pageID);
        }
    }


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
        event.preventDefault();
        if (keyCode == window.KeyboardControllerKeys.ENTER) {
            presenter.clickHandler();
        }
    };

    function getImageUrlFromResources (fileName) {
        if (!presenter.playerController) {
            return '';
        }
        return presenter.playerController.getStaticFilesPath() + 'addons/resources/' + fileName;
    }
    return presenter;
}