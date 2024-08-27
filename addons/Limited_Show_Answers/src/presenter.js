function AddonLimited_Show_Answers_create() {
    var presenter = function () {
    };

    presenter.playerController = null;
    presenter.eventBus = null;
    var isWCAGOn = false;

    function getSpeechTextProperty(rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    function getTextVoiceObject(text, lang) {
        return {
            text: text,
            lang: lang
        };
    }

    presenter.EVENTS = {
        SHOW_ANSWERS: 'LimitedShowAnswers',
        HIDE_ANSWERS: 'LimitedHideAnswers'
    };

    presenter.EVENTS_MAP = {
        LimitedShowAnswers: "ShowAnswers",
        LimitedHideAnswers: "HideAnswers"
    };

    presenter.keyboardController = function (keycode) {
        if (keycode === 13) {
            presenter.$button.click();
            if (isWCAGOn) {
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

    presenter.sendEvent = function (eventName) {
        if(!presenter.eventBus) return;
        var eventData = {
            'value': eventName,
            'source': presenter.configuration.addonID,
            'item': JSON.stringify(presenter.configuration.worksWithModulesList)
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);

        if (eventName === "LimitedShowAnswers") {
            presenter.eventBus.sendEvent('LimitedShowAnswers', eventData);
        } else if (eventName === "LimitedHideAnswers") {
            presenter.eventBus.sendEvent('LimitedHideAnswers', eventData);
        }

        presenter.sendEventToWorksWithModules(eventName);
    };

    presenter.sendEventToWorksWithModules = function (eventName) {
        presenter.configuration.worksWithModulesList.forEach(function (moduleId) {
            var module = player.getPlayerServices().getModule(moduleId);
            if (module && module.onEventReceived) {
                try {
                    module.onEventReceived(presenter.EVENTS_MAP[eventName]);
                }catch (e) {
                    console.error(e);
                }
            }
        });
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.getWorksWithModulesList = function () {
        return presenter.configuration.worksWithModulesList.slice();
    };

    presenter.validateModel = function (model) {
        presenter.setSpeechTexts(model['speechTexts']);

        var modelValidator = new ModelValidator();
        var validatedModel = modelValidator.validate(model, [
            ModelValidators.utils.FieldRename("Is Visible", "isVisible", ModelValidators.Boolean("isVisible")),
            ModelValidators.utils.FieldRename("Text", "text", ModelValidators.String("text", {default: ""})),
            ModelValidators.utils.FieldRename("Text selected", "textSelected", ModelValidators.String("textSelected", {default: ""})),
            ModelValidators.utils.FieldRename("ID", "addonID", ModelValidators.DumbString("addonID")),
            ModelValidators.utils.FieldRename("Increment check counter", "enableCheckCounter", ModelValidators.Boolean("enableCheckCounter")),
            ModelValidators.utils.FieldRename("Increment mistake counter", "enableMistakeCounter", ModelValidators.Boolean("enableMistakeCounter")),
            ModelValidators.utils.FieldRename("Is Tabindex Enabled", "isTabindexEnabled", ModelValidators.Boolean("isTabindexEnabled")),
            ModelValidators.String("worksWith", {default: ""})
        ]);

        if (validatedModel.isValid) {
            validatedModel.value.isSelected = false;
            validatedModel.value.isEnabled = true;
            validatedModel.value.worksWithModulesList = validatedModel.value.worksWith.split("\n")
                .map(function (value) {
                    return value.trim();
                })
                .filter(function (value) {
                    return value !== "";
                })
                .filter(function (value, index, self) { //Unique elements
                    return self.indexOf(value) === index;
                });
        }

        return validatedModel;

    };

    presenter.setSpeechTexts = function (speechTexts) {
        presenter.speechTexts = {
            selected: 'Selected',
            editBlock: 'Exercise edition is blocked',
            noEditBlock: 'Exercise edition is not blocked'
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            selected: getSpeechTextProperty(speechTexts['Selected']['Selected'], presenter.speechTexts.selected),
            editBlock: getSpeechTextProperty(speechTexts['Block edit']['Block edit'], presenter.speechTexts.editBlock),
            noEditBlock: getSpeechTextProperty(speechTexts['No block edit']['No block edit'], presenter.speechTexts.noEditBlock)
        };
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
    };

    presenter.connectClickAction = function () {
        presenter.$button.on('click', function (eventData) {
            eventData.stopPropagation();
            if (presenter.configuration.isEnabled)
                presenter.handleClick();
        });
    };

    presenter.connectKeyDownAction = function () {
        presenter.$view.on('keydown', function (eventData) {
            if (eventData.which === 13) {
                eventData.stopPropagation();
                presenter.handleClick();
            }
        });
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model).value;
        presenter.$view = $(view);

        presenter.$button = presenter.$view.find('.limited-show-answers-button');
        presenter.$button.text(presenter.configuration.text);
        presenter.$wrapper = presenter.$view.find('.limited-show-answers-wrapper');

        if (presenter.configuration.isTabindexEnabled) {
            presenter.$wrapper.attr('tabindex', '0');
        }

        if (!isPreview) {
            presenter.setVisibility(presenter.configuration.isVisible);
            presenter.connectClickAction();
            presenter.connectKeyDownAction();
            presenter.eventBus.addEventListener('ShowAnswers', presenter);
            presenter.eventBus.addEventListener('HideAnswers', presenter);
            presenter.eventBus.addEventListener('LimitedHideAnswers', presenter);
        }
    };

    presenter.run = function (view, model) {
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

    presenter.isEventSourceLocal = function (eventData) {
        return eventData.source === presenter.configuration.addonID;
    }

    presenter.eventItemsContainAllWorksWithModules = function (eventDataItems) {
        const moduleList = presenter.configuration.worksWithModulesList;
        for (let i in moduleList) {
            if (!JSON.parse(eventDataItems).includes(moduleList[i])) {
                return false;
            }
        }
        return true;
    }

    presenter.handleLimitedHideAnswers = function (eventName, eventData) {
        if (presenter.isEventSourceLocal(eventData)) return;

        if (eventData.item) {
            if (eventData.item.includes(presenter.configuration.addonID)) {
                presenter.sendEvent(eventName);
                presenter.reset();
            } else if (presenter.eventItemsContainAllWorksWithModules(eventData.item)) {
                presenter.reset();
            }
        }

        for (let i in eventData) {
            if (eventData.hasOwnProperty(i)) {
                const eventModule = eventData[i];
                if (presenter.configuration.worksWithModulesList.includes(eventModule)) {
                    presenter.sendEvent(eventName);
                    presenter.reset();
                }
            }
        }
    }

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName === "LimitedHideAnswers") {
            presenter.handleLimitedHideAnswers(eventName, eventData);
        }
        if (eventName == "HideAnswers") {
            presenter.reset();
        }
        if (eventName == "ShowAnswers") {
            presenter.$button.text(presenter.configuration.textSelected);
            presenter.$wrapper.removeClass('disabled');
            presenter.$wrapper.addClass('selected');
            presenter.configuration.isSelected = true;
            presenter.configuration.isEnabled = false;
        }
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            "show": presenter.show,
            "hide": presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getState = function () {
        return JSON.stringify({
            'isVisible': presenter.configuration.isVisible
        });
    };

    presenter.setState = function (state) {
        presenter.setVisibility(JSON.parse(state).isVisible);
    };

    presenter.reset = function () {
        presenter.$button.text(presenter.configuration.text);
        presenter.$wrapper.removeClass('selected');
        presenter.$wrapper.removeClass("disabled");
        presenter.configuration.isEnabled = true;
        presenter.configuration.isSelected = false;
    };

    presenter.setShowErrorsMode = function () {
        presenter.reset();
        presenter.$wrapper.addClass("selected");
        presenter.$wrapper.addClass("disabled");
        presenter.configuration.isEnabled = false;
    };

    presenter.setWorkMode = function () {
        presenter.reset();
    };

    presenter.getTitlePostfix = function () {
        if (presenter.configuration.isSelected) {
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

    function speak(data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && isWCAGOn) {
            tts.speak(data);
        }
    }

    return presenter;
}
