function AddonShow_Answers_create(){
    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;
    var isWCAGOn = false;

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    function getTextVoiceObject (text, lang) {
        return {
            text: text,
            lang: lang
        };
    }

    presenter.EVENTS = {
        SHOW_ANSWERS: 'ShowAnswers',
        HIDE_ANSWERS: 'HideAnswers'
    };

    presenter.keyboardController = function(keycode, isShiftDown, event) {
        if (keycode == window.KeyboardControllerKeys.SPACE ||
            keycode == window.KeyboardControllerKeys.ARROW_UP ||
            keycode == window.KeyboardControllerKeys.ARROW_DOWN ||
            keycode == window.KeyboardControllerKeys.ESC)
        {
            event.preventDefault();
        }

        if (keycode === window.KeyboardControllerKeys.ENTER) {
            presenter.$button.click();
            if(isWCAGOn) {
                if (presenter.configuration.isSelected) {
                    speak([getTextVoiceObject(presenter.speechTexts.editBlock)]);
                } else {
                    speak([getTextVoiceObject(presenter.speechTexts.noEditBlock)]);
                }
            }
        }
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.sendEvent = function(eventName) {
        var source = presenter.configuration.addonID;
        if (eventName === presenter.EVENTS.SHOW_ANSWERS) {
            presenter.playerController.getCommands().showAnswers(source);
        } else if (eventName === presenter.EVENTS.HIDE_ANSWERS) {
            presenter.playerController.getCommands().hideAnswers(source);
        } else {
            var eventData = {
                'source': source
            };
            // fallback - but it should use commands for proper work with different modes
            presenter.eventBus.sendEvent(eventName, eventData);
        }

    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.validateModel = function(model) {
        presenter.setSpeechTexts(model['speechTexts']);
        return {
            'text' : model.Text,
            'textSelected' : model['Text selected'],
            'isVisible' : ModelValidationUtils.validateBoolean(model["Is Visible"]),
            'addonID' : model.ID,
            'isSelected': false,
            'enableCheckCounter': ModelValidationUtils.validateBoolean(model["Increment check counter"]),
            'enableMistakeCounter': ModelValidationUtils.validateBoolean(model["Increment mistake counter"]),
            'isTabindexEnabled': ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"])
        };
    };

    presenter.setSpeechTexts = function(speechTexts){
        presenter.speechTexts = {
            selected: 'Selected',
            editBlock: 'Page edition is blocked',
            noEditBlock: 'Page edition is not blocked'
        };

        if(!speechTexts){
            return;
        }

        presenter.speechTexts = {
            selected: getSpeechTextProperty(speechTexts['Selected']['Selected'], presenter.speechTexts.selected),
            editBlock: getSpeechTextProperty(speechTexts['Block edit']['Block edit'], presenter.speechTexts.editBlock),
            noEditBlock: getSpeechTextProperty(speechTexts['No block edit']['No block edit'], presenter.speechTexts.noEditBlock)
        };
    };

    presenter.upgradeModel = function (model) {
        if (model["Increment mistake counter"] === undefined) {
            model = presenter.upgradeIncrementMistakeCounter(model);
        }
        return model;
    };

     presenter.upgradeIncrementMistakeCounter = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (upgradedModel["Increment mistake counter"] === undefined) {
            upgradedModel["Increment mistake counter"] = "false";
        }

        return upgradedModel;
    };

    presenter.handleClick = function () {
        var text, eventName;

        presenter.configuration.isSelected = !presenter.configuration.isSelected;

        if (presenter.configuration.isSelected) {
            text = presenter.configuration.textSelected;
            eventName = presenter.EVENTS.SHOW_ANSWERS;
            presenter.$wrapper.addClass('selected');

            if (presenter.configuration.enableCheckCounter) {
                presenter.playerController.getCommands().incrementCheckCounter();
            }

            if (presenter.configuration.enableMistakeCounter) {
                presenter.playerController.getCommands().increaseMistakeCounter();
            }
        } else {
            text = presenter.configuration.text;
            eventName = presenter.EVENTS.HIDE_ANSWERS;
            presenter.$wrapper.removeClass('selected');
        }

        presenter.$button.text(text);
        presenter.sendEvent(eventName);
        presenter.onClick();
    };

    presenter.onClick = function () {
     };

    presenter.connectClickAction = function () {
        presenter.$button.on('click', function (eventData) {
            eventData.stopPropagation();
            presenter.handleClick();
        });
    };

    presenter.connectKeyDownAction = function () {
        presenter.$view.on('keydown', function (eventData) {
            if(eventData.which === 13) {
                eventData.stopPropagation();
                presenter.handleClick();
            }
        });
    };

    presenter.presenterLogic = function(view, model, isPreview) {
        var upgradedModel = presenter.upgradeModel(model);

        presenter.configuration = presenter.validateModel(upgradedModel);
        presenter.$view = $(view);

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        presenter.$button = presenter.$view.find('.show-answers-button');
        presenter.$button.text(presenter.configuration.text);
        presenter.$wrapper = presenter.$view.find('.show-answers-wrapper');

        if (presenter.configuration.isTabindexEnabled) {
            presenter.$wrapper.attr('tabindex', '0');
        }

        if (!isPreview) {
            presenter.connectClickAction();
            presenter.connectKeyDownAction();
            presenter.eventBus.addEventListener('ShowAnswers', presenter);
            presenter.eventBus.addEventListener('HideAnswers', presenter);
            presenter.eventBus.addEventListener('LimitedHideAnswers', presenter);
        }
    };

    presenter.run = function(view, model) {
        presenter.view = view;
        presenter.presenterLogic(view, model, false);

        MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();
    };

    presenter.destroy = function (event) {
        if (event.target !== presenter.view) {
            return;
        }

        presenter.$button.off();
        presenter.$view.off();

        presenter.$button = null;
        presenter.$wrapper = null;
        presenter.$view = null;
        presenter.view = null;
    };

    presenter.setVisibility = function (isVisible) {
        presenter.configuration.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "LimitedHideAnswers") {
            presenter.reset();
        }
        if (eventName == "HideAnswers") {
            presenter.reset();
        }
        if (eventName == "ShowAnswers") {
            presenter.$button.text(presenter.configuration.textSelected);
            presenter.$wrapper.addClass('selected');
            presenter.configuration.isSelected = true;
        }
    };

    presenter.show = function() {
        presenter.setVisibility(true);
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            "show": presenter.show,
            "hide": presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getState = function() {
        return JSON.stringify({
            'isVisible' : presenter.configuration.isVisible
        });
    };

    presenter.setState = function(state) {
        presenter.setVisibility(JSON.parse(state).isVisible);
    };

    presenter.reset = function () {
        presenter.$button.text(presenter.configuration.text);
        presenter.$wrapper.removeClass('selected');
        presenter.configuration.isSelected = false;
    };

    presenter.setShowErrorsMode = function () {
        presenter.reset();
    };

    presenter.setWorkMode = function () {
        presenter.reset();
    };

    presenter.getTitlePostfix = function () {
        if(presenter.configuration.isSelected) {
            return presenter.speechTexts.selected;
        } else {
            return ''
        }
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
    };

    function speak (data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts) {
            tts.speak(data);
        }
    }

    return presenter;
}