function AddonLimited_Show_Answers_create() {
    var presenter = function () {
    };

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.state = {
        isSelected: false,
        isEnabled: true,
        isVisible: true
    };

    presenter.EVENTS = {
        SHOW_ANSWERS: 'LimitedShowAnswers',
        HIDE_ANSWERS: 'LimitedHideAnswers'
    };

    presenter.EVENTS_MAP = {
        LimitedShowAnswers: "ShowAnswers",
        LimitedHideAnswers: "HideAnswers"
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.sendEvent = function (eventName) {
        var eventData = {
            'value': eventName,
            'source': presenter.configuration.addonID,
            'item': JSON.stringify(presenter.configuration.worksWithModulesList)
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);

        presenter.configuration.worksWithModulesList.forEach(function (moduleId) {
            var module = player.getPlayerServices().getModule(moduleId);
            if (module && module.onEventReceived) {
                module.onEventReceived(presenter.EVENTS_MAP[eventName]);
            }
        });

    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.validateModel = function (model) {
        presenter.setSpeechTexts(model['speechTexts']);

        var modelValidator = new ModelValidator();
        var validatedModel = modelValidator.validate(model, [
            ModelValidators.utils.FieldRename("Is Visible", "isVisible", ModelValidators.Boolean("isVisible")),
            ModelValidators.utils.FieldRename("Text", "text", ModelValidators.String("text", {default: ""})),
            ModelValidators.utils.FieldRename("Text selected", "textSelected", ModelValidators.String("textSelected", {default: ""})),
            ModelValidators.utils.FieldRename("ID", "addonID", ModelValidators.DumbString("addonID")),
            ModelValidators.utils.FieldRename("Is Tabindex Enabled", "isTabindexEnabled", ModelValidators.Boolean("isTabindexEnabled")),
            ModelValidators.String("worksWith", {default: ""})
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
        var text, eventName;

        presenter.state.isSelected = !presenter.state.isSelected;

        if (presenter.state.isSelected) {
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
            presenter.eventBus.addEventListener('ShowAnswers', presenter);
            presenter.eventBus.addEventListener('HideAnswers', presenter);
            presenter.eventBus.addEventListener('LimitedHideAnswers', presenter);
        }
    };

    presenter.run = function (view, model) {
        presenter.view = view;
        presenter.presenterLogic(view, model, false);

        presenter.view.addEventListener("DOMNodeRemoved", presenter.destroy);
    };

    presenter.destroy = function (event) {
        if (event.target !== presenter.view) {
            return;
        }

        presenter.view.removeEventListener("DOMNodeRemoved", presenter.destroy);
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

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName == "LimitedHideAnswers") {
            for (var i in eventData) {
                if (eventData.hasOwnProperty(i)) {
                    var eventModule = eventData[i];
                    if (presenter.configuration.worksWithModulesList.includes(eventModule))
                        presenter.reset();
                }
            }
        }
        if (eventName == "HideAnswers") {
            presenter.reset();
        }
        if (eventName == "ShowAnswers") {
            presenter.$button.text(presenter.configuration.textSelected);
            presenter.$wrapper.removeClass('disabled');
            presenter.$wrapper.addClass('selected');
            presenter.state.isSelected = true;
            presenter.state.isEnabled = false;
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

    return presenter;
}