function AddonLimited_Submit_create() {
    var presenter = function () {
    };

    var isWCAGOn = false;

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.EVENTS_NAMES = {
        SELECTED: "selected",
        DESELECTED: "deselected",
        TRIED_SELECT: "canceled"
    };

    presenter.state = {
        isSelected: false,
        isEnabled: true,
        isVisible: true
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.sendEvent = function (eventValue) {
        var eventData = {
            'value': eventValue,
            'source': presenter.configuration.addonID
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.getWorksWithModulesList = function () {
        return presenter.configuration.worksWithModulesList.slice();    // Make a copy of this list
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.validateModel = function (model) {
        var modelValidator = new ModelValidator();

        var speechToTextListModelValidator = {
            'blockEdit': [ModelValidators.String('textToSpeechText', {default: 'Exercise edition is blocked'})],
            'noBlockEdit': [ModelValidators.String('textToSpeechText', {default: 'Exercise edition is not blocked'})],
            'notAllAttempted': [ModelValidators.String('textToSpeechText', {default: 'Not all attempted'})],
            'selected': [ModelValidators.String('textToSpeechText', {default: 'Selected'})]
        };

        var validatedModel = modelValidator.validate(model, [
            ModelValidators.utils.FieldRename("Is Visible", "isVisible", ModelValidators.Boolean("isVisible")),
            ModelValidators.utils.FieldRename("Text", "text", ModelValidators.String("text", {default: ""})),
            ModelValidators.utils.FieldRename("Text selected", "textSelected", ModelValidators.String("textSelected", {default: ""})),
            ModelValidators.utils.FieldRename("ID", "addonID", ModelValidators.DumbString("addonID")),
            ModelValidators.utils.FieldRename("Is Tabindex Enabled", "isTabindexEnabled", ModelValidators.Boolean("isTabindexEnabled")),
            ModelValidators.String("worksWith", {default: ""}),
            ModelValidators.StaticList('speechTexts', speechToTextListModelValidator)
        ]);

        if (validatedModel.isValid) {
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

    presenter.handleClick = function () {
        if (presenter.state.isSelected) {
            presenter.onButtonDeselect();
        } else {
            presenter.onButtonSelect();
        }
    };

    presenter.onButtonDeselect = function () {
        var text = presenter.configuration.text;

        presenter.state.isSelected = false;
        presenter.$wrapper.removeClass('selected');

        presenter.sendEvent(presenter.EVENTS_NAMES.DESELECTED);

        presenter.executeUnCheckForAllModules();
        presenter.$button.text(text);
    };

    presenter.onButtonSelect = function () {
        if (presenter.allModulesAttempted()) {
            var text = presenter.configuration.textSelected;

            presenter.$wrapper.addClass('selected');
            presenter.state.isSelected = true;

            presenter.sendEvent(presenter.EVENTS_NAMES.SELECTED);

            presenter.executeCheckForAllModules();
            presenter.$button.text(text);
        } else {
            presenter.sendEvent(presenter.EVENTS_NAMES.TRIED_SELECT);
        }
    };


    presenter.executeCheckForAllModules = function () {
        presenter.configuration.worksWithModulesList.forEach(function (moduleId) {
            var module = presenter.playerController.getModule(moduleId);
            if (module && module.setShowErrorsMode) {
                module.setShowErrorsMode();
            }
        });
    };

    presenter.executeUnCheckForAllModules = function () {
        presenter.configuration.worksWithModulesList.forEach(function (moduleId) {
            var module = presenter.playerController.getModule(moduleId);
            if (module && module.setWorkMode) {
                module.setWorkMode();
            }
        });
    };

    presenter.allModulesAttempted = function () {
        var i = 0;
        var worksWithModulesList = presenter.configuration.worksWithModulesList;

        for (; i < worksWithModulesList.length; i++) {
            var moduleId = worksWithModulesList[i];
            var module = presenter.playerController.getModule(moduleId);

            if (module && module.isAttempted && !module.isAttempted()) {
                return false;
            }
        }

        return true;
    };

    presenter.connectClickAction = function () {
        presenter.$button.on('click', function (eventData) {
            eventData.stopPropagation();
            if (presenter.state.isEnabled)
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

        presenter.$button = presenter.$view.find('.limited-submit-button');
        presenter.$button.text(presenter.configuration.text);
        presenter.$wrapper = presenter.$view.find('.limited-submit-wrapper');

        if (presenter.configuration.isTabindexEnabled) {
            presenter.$wrapper.attr('tabindex', '0');
        }

        if (!isPreview) {
            presenter.setVisibility(presenter.configuration.isVisible);
            presenter.connectClickAction();
            presenter.connectKeyDownAction();
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
        presenter.state.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
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
            'isVisible': presenter.state.isVisible
        });
    };

    presenter.setState = function (state) {
        presenter.setVisibility(JSON.parse(state).isVisible);
    };

    presenter.reset = function () {
        presenter.resetSelection();
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.resetSelection = function () {
        presenter.$button.text(presenter.configuration.text);
        presenter.$wrapper.removeClass('selected');
        presenter.$wrapper.removeClass("disabled");
        presenter.state.isEnabled = true;
        presenter.state.isSelected = false;
    };

    presenter.setShowErrorsMode = function () {
        presenter.reset();
        presenter.$wrapper.addClass("selected");
        presenter.$wrapper.addClass("disabled");
        presenter.state.isEnabled = false;
    };

    presenter.setWorkMode = function () {
        presenter.reset();
    };

    function speak(data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && isWCAGOn) {
            tts.speak(data);
        }
    }

    function getTextVoiceObject(text, lang) {
        return {
            text: text,
            lang: lang
        };
    }

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
    };

    presenter.getTitlePostfix = function () {
        if(presenter.state.isSelected) {
            return presenter.configuration.speechTexts.selected.textToSpeechText;
        } else {
            return ''
        }
    };

    presenter.keyboardController = function (keycode) {
        if (keycode === 13) {
            var wasSelected = presenter.state.isSelected;
            presenter.$button.click();
            if (isWCAGOn) {
                if (presenter.state.isSelected) {
                    speak([getTextVoiceObject(presenter.configuration.speechTexts.blockEdit.textToSpeechText)]);
                } else if (wasSelected && !presenter.state.isSelected) {
                    speak([getTextVoiceObject(presenter.configuration.speechTexts.noBlockEdit.textToSpeechText)]);
                } else {
                    speak([getTextVoiceObject(presenter.configuration.speechTexts.notAllAttempted.textToSpeechText)]);
                }
            }
        }
    };

    return presenter;
}