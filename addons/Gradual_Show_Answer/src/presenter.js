function AddonGradual_Show_Answer_create() {
    var presenter = function () {};

    var classList = {
        HIDE_ANSWERS: "gradual-hide-answers-button",
        BUTTON: "gradual-show-answers-button",
        GRADUAL_ACTIVE: "gradual-show-answers-active"
    }

    presenter.state = {
        isVisible: true,
        isDisabled: false,
        isErrorMode: false,
        isGradualShowAnswers: false
    };

    presenter.isWCAGOn = false;
    presenter.playerController = null;
    presenter.keyboardControllerObject = null;

    presenter.DEFAULT_TTS_PHRASES = {
        ANSWER_HAS_BEEN_SHOWN: "One answer has been shown",
        ANSWERS_ARE_HIDDEN: "All answers are hidden",
        NO_NEW_ANSWER_TO_SHOW: "No new answer to show",
        EDITION_IS_BLOCKED: "Page edition is blocked",
        EDITION_IS_NOT_BLOCKED: "Page edition is not blocked",
        DISABLED: "Disabled",
    };

    presenter.validateModel = function (model) {
        var modelValidator = new ModelValidator();

        return modelValidator.validate(model, [
            ModelValidators.utils.FieldRename("Is Visible", "isVisible", ModelValidators.Boolean('isVisible')),
            ModelValidators.utils.FieldRename("Is Disabled", "isDisabled", ModelValidators.Boolean('isDisabled')),
            ModelValidators.utils.FieldRename("Is hide answers", "isHideAnswers", ModelValidators.Boolean('isHideAnswers')),
            ModelValidators.String("worksWith", {default: ""}),
            ModelValidators.DumbString('ID'),
        ]);
    };

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradeModelAddDefaultWorksWith(model);
        return presenter.upgradeModelAddSpeechTextsProperty(upgradedModel);
    }

    presenter.upgradeModelAddDefaultWorksWith = function(model){
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["worksWith"]) {
            upgradedModel["worksWith"] = '';
        }

        return upgradedModel;
    }

    presenter.upgradeModelAddSpeechTextsProperty = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {};
        }
        if (!upgradedModel["speechTexts"]["AnswerHasBeenShown"]) {
            upgradedModel["speechTexts"]["AnswerHasBeenShown"] = {AnswerHasBeenShown: ""};
        }
        if (!upgradedModel["speechTexts"]["AnswersAreHidden"]) {
            upgradedModel["speechTexts"]["AnswersAreHidden"] = {AnswersAreHidden: ""};
        }
        if (!upgradedModel["speechTexts"]["NoNewAnswerToShow"]) {
            upgradedModel["speechTexts"]["NoNewAnswerToShow"] = {NoNewAnswerToShow: ""};
        }
        if (!upgradedModel["speechTexts"]["EditionIsBlocked"]) {
            upgradedModel["speechTexts"]["EditionIsBlocked"] = {EditionIsBlocked: ""};
        }
        if (!upgradedModel["speechTexts"]["EditionIsNotBlocked"]) {
            upgradedModel["speechTexts"]["EditionIsNotBlocked"] = {EditionIsNotBlocked: ""};
        }
        if (!upgradedModel["speechTexts"]["Disabled"]) {
            upgradedModel["speechTexts"]["Disabled"] = {Disabled: ""};
        }

        return upgradedModel;
    }

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model, presenter.isPreview)
    };

    presenter.isDisabled = function () {
        return presenter.state.isDisabled;
    }

    /**
     Handle click event.

     @method clickHandler
     @return {boolean} - command associated with the click event was fully completed correctly
    */
    presenter.clickHandler = function AddonGradualShowAnswer_clickHandler(event) {
        if (event !== undefined) {
            event.stopPropagation();
        }

        if (!isClickable()) {
            return false;
        }
  
        var eventData = {
            'source': presenter.addonID,
            'value': presenter.configuration.isHideAnswers ? "HideAllAnswers" : "ShowNextAnswer",
        };
        presenter.sendEvent(eventData);
        return presenter.triggerButtonClickedEvent();
    };

    /**
     Check if button is clickable.

     @method isClickable
     @return {boolean} - true if button clickable, otherwise false
    */
    function isClickable() {
        return !(presenter.isDisabled()
            && (!presenter.state.isGradualShowAnswers
                || presenter.configuration.isHideAnswers));
    }

    presenter.sendEvent = function (eventData) {
        var eventBus = presenter.playerController.getEventBus();
        eventBus.sendEvent('ValueChanged', eventData);
    }

    /**
     Trigger button clicked event.

     @method triggerButtonClickedEvent
     @return {boolean} - command associated with the event was completed correctly
    */
    presenter.triggerButtonClickedEvent = function () {
        if (presenter.playerController == null) {
            return false;
        }
        if (presenter.configuration.isHideAnswers) {
            presenter.playerController.getCommands().hideGradualAnswers();
            return true;
        } else {
            return presenter.playerController.getCommands().showNextAnswer(presenter.configuration.worksWith);
        }
    }

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.addonID = model.ID;
        presenter.view = view;
        presenter.$view = $(view);

        const upgradedModel = presenter.upgradeModel(model);
        const validatedModel = presenter.validateModel(upgradedModel);

        if (!validatedModel.isValid) {
            return;
        }

        presenter.viewElements = {
            button: presenter.view.getElementsByClassName(classList.BUTTON)[0]
        };

        presenter.configuration = validatedModel.value;

        if (presenter.configuration.isHideAnswers) {
            presenter.viewElements.button.classList.add(classList.HIDE_ANSWERS);
        }

        if (presenter.configuration.isDisabled) {
            presenter.disable();
        }

        if (!isPreview) {
            presenter.addHandleOfMouseActions();
            presenter.addHandlingGradualShowAnswers();
        }

        presenter.setSpeechTexts(model["speechTexts"]);
        presenter.buildKeyboardController();
    }

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.isErrorCheckingMode) {
            return;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'disable': presenter.disable,
            'enable': presenter.enable,
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.state.isVisible,
            isDisabled: presenter.state.isDisabled
        })
    }

    presenter.setState = function (state) {
        var parsedState = JSON.parse(state);
        presenter.state.isVisible = parsedState.isVisible;
        presenter.state.isDisabled = parsedState.isDisabled;

        if (presenter.state.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
    }

    presenter.show = function () {
        presenter.setVisibility(true);
    }

    presenter.hide = function () {
        presenter.setVisibility(false);
    }

    presenter.setVisibility = function (isVisible) {
        presenter.configuration.isVisible = isVisible;
        presenter.state.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.disable = function () {
        presenter.state.isDisabled = true;
    }

    presenter.enable = function () {
        presenter.state.isDisabled = false;
    }

    presenter.addHandleOfMouseActions = function () {
        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            presenter.viewElements.button.addEventListener("touchend", presenter.clickHandler);
        } else {
            presenter.viewElements.button.addEventListener("click", presenter.clickHandler);
        }
    }

    presenter.addHandlingGradualShowAnswers = function () {
        var eventBus = presenter.playerController.getEventBus();
        eventBus.addEventListener("GradualShowAnswers", this);
        eventBus.addEventListener("GradualHideAnswers", this);
    }

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName === "GradualShowAnswers") {
            presenter.viewElements.button.classList.add(classList.GRADUAL_ACTIVE);
            presenter.state.isGradualShowAnswers = true;
        } else if (eventName === "GradualHideAnswers") {
            presenter.state.isGradualShowAnswers = false;
            presenter.viewElements.button.classList.remove(classList.GRADUAL_ACTIVE);
        }
    }

    presenter.isEnabledInGSAMode = function () {
        return true;
    }

    presenter.reset = function () {
        if (presenter.configuration.isDisabled) {
            presenter.disable();
        } else {
            presenter.enable();
        }
        if (presenter.configuration.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    presenter.destroy = function AddonGradual_Show_Answer__destroy() {
        presenter.playerController = null;
        presenter.viewElements.button.removeEventListener("click", presenter.clickHandler);
        presenter.viewElements.button.removeEventListener("touchend", presenter.clickHandler);
    };

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            AnswerHasBeenShown: presenter.DEFAULT_TTS_PHRASES.ANSWER_HAS_BEEN_SHOWN,
            AnswersAreHidden: presenter.DEFAULT_TTS_PHRASES.ANSWERS_ARE_HIDDEN,
            NoNewAnswerToShow: presenter.DEFAULT_TTS_PHRASES.NO_NEW_ANSWER_TO_SHOW,
            EditionIsBlocked: presenter.DEFAULT_TTS_PHRASES.EDITION_IS_BLOCKED,
            EditionIsNotBlocked: presenter.DEFAULT_TTS_PHRASES.EDITION_IS_NOT_BLOCKED,
            Disabled: presenter.DEFAULT_TTS_PHRASES.DISABLED,
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            AnswerHasBeenShown: TTSUtils.getSpeechTextProperty(
                speechTexts.AnswerHasBeenShown.AnswerHasBeenShown,
                presenter.speechTexts.AnswerHasBeenShown),
            AnswersAreHidden: TTSUtils.getSpeechTextProperty(
                speechTexts.AnswersAreHidden.AnswersAreHidden,
                presenter.speechTexts.AnswersAreHidden),
            NoNewAnswerToShow: TTSUtils.getSpeechTextProperty(
                speechTexts.NoNewAnswerToShow.NoNewAnswerToShow,
                presenter.speechTexts.NoNewAnswerToShow),
            EditionIsBlocked: TTSUtils.getSpeechTextProperty(
                speechTexts.EditionIsBlocked.EditionIsBlocked,
                presenter.speechTexts.EditionIsBlocked),
            EditionIsNotBlocked: TTSUtils.getSpeechTextProperty(
                speechTexts.EditionIsNotBlocked.EditionIsNotBlocked,
                presenter.speechTexts.EditionIsNotBlocked),
            Disabled: TTSUtils.getSpeechTextProperty(
                speechTexts.Disabled.Disabled,
                presenter.speechTexts.Disabled),
        };
    };

    presenter.keyboardController = function(keycode, isShiftDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftDown, event);
    };

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject
            = new GradualShowAnswerKeyboardController([], 1);
    };

    presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    function GradualShowAnswerKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
        this.updateMapping();
    }

    GradualShowAnswerKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    GradualShowAnswerKeyboardController.prototype.constructor = GradualShowAnswerKeyboardController;

    GradualShowAnswerKeyboardController.prototype.exitWCAGMode = function () {
        KeyboardController.prototype.exitWCAGMode.call(this);
        presenter.setWCAGStatus(false);
    };

    GradualShowAnswerKeyboardController.prototype.updateMapping = function () {
        this.mapping[window.KeyboardControllerKeys.ENTER] = this.select;
        this.mapping[window.KeyboardControllerKeys.ARROW_UP] = this.preventDefaultEvent;
        this.mapping[window.KeyboardControllerKeys.ARROW_DOWN] = this.preventDefaultEvent;
        this.mapping[window.KeyboardControllerKeys.ARROW_RIGHT] = this.preventDefaultEvent;
        this.mapping[window.KeyboardControllerKeys.ARROW_LEFT] = this.preventDefaultEvent;
        this.mapping[window.KeyboardControllerKeys.SPACE] = this.preventDefaultEvent;

        // Functionality of moving to previous/next element is handled by
        // changeCurrentModule method of KeyboardNavigationController KeyDownHandler
        this.mapping[window.KeyboardControllerKeys.TAB] = this.preventDefaultEvent;
        this.shiftKeysMapping[window.KeyboardControllerKeys.TAB] = this.preventDefaultEvent;
    };

    GradualShowAnswerKeyboardController.prototype.preventDefaultEvent = function (event) {
        if (event) {
            event.preventDefault();
        }
    };

    GradualShowAnswerKeyboardController.prototype.select = function (event) {
        if (event) {
            event.preventDefault();
        }
        if (!this.isSelectEnabled) {
            return;
        }
        const fullyCompletedClickEvent = presenter.clickHandler(event);
        this.readCurrentElement(fullyCompletedClickEvent);
    };

    GradualShowAnswerKeyboardController.prototype.readCurrentElement = function (fullyCompletedClickEvent = false) {
        var textVoices = [];

        if (isClickable()) {
            this.addSpeechTextVoicesOfClickableButton(textVoices, fullyCompletedClickEvent);
        } else {
            this.addSpeechTextVoicesOfNotClickableButton(textVoices, fullyCompletedClickEvent);
        }

        presenter.speak(textVoices);
    };

    GradualShowAnswerKeyboardController.prototype.addSpeechTextVoicesOfClickableButton = function (textVoices, fullyCompletedClickEvent = false) {
        if (presenter.configuration.isHideAnswers) {
            addSpeechTextToVoicesArray(textVoices, presenter.speechTexts.AnswersAreHidden);
            addSpeechTextToVoicesArray(textVoices, presenter.speechTexts.EditionIsNotBlocked);
        } else {
            if (fullyCompletedClickEvent) {
                addSpeechTextToVoicesArray(textVoices, presenter.speechTexts.AnswerHasBeenShown);
            } else {
                addSpeechTextToVoicesArray(textVoices, presenter.speechTexts.NoNewAnswerToShow);
            }
            addSpeechTextToVoicesArray(textVoices, presenter.speechTexts.EditionIsBlocked);
        }
    }

    GradualShowAnswerKeyboardController.prototype.addSpeechTextVoicesOfNotClickableButton = function (textVoices) {
        addSpeechTextToVoicesArray(textVoices, presenter.speechTexts.Disabled);
    }

    function addSpeechTextToVoicesArray(textVoices, message) {
        textVoices.push(window.TTSUtils.getTextVoiceObject(message));
    }

    presenter.speak = function (data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }
        return null;
    };

    return presenter;
}

AddonGradual_Show_Answer_create.__supported_player_options__ = {
    interfaceVersion: 2
};