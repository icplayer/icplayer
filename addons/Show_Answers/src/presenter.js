function AddonShow_Answers_create(){
    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.EVENTS = {
        SHOW_ANSWERS: 'ShowAnswers',
        HIDE_ANSWERS: 'HideAnswers'
    };

    presenter.keyboardController = function(keycode) {
        if (keycode === 13) {
            presenter.$button.click();
        }
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.sendEvent = function(eventName) {
        var eventData = {
            'source': presenter.configuration.addonID
        };

        presenter.eventBus.sendEvent(eventName, eventData);
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.validateModel = function(model) {
        return {
            'text' : model.Text,
            'textSelected' : model['Text selected'],
            'isVisible' : ModelValidationUtils.validateBoolean(model["Is Visible"]),
            'addonID' : model.ID,
            'isSelected': false,
            'enableCheckCounter': ModelValidationUtils.validateBoolean(model["Increment check counter"]),
            'enableMistakeCounter': ModelValidationUtils.validateBoolean(model["Increment mistake counter"])
        }
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

        if (!upgradedModel["Increment mistake counter"]) {
            upgradedModel["Increment mistake counter"] = "false";
        }

        return upgradedModel;
    };

    presenter.handleClickAction = function () {
        presenter.$button.on('click', function (eventData) {
            eventData.stopPropagation();

            var text, eventName;

            presenter.configuration.isSelected = !presenter.configuration.isSelected;

            if (presenter.configuration.isSelected) {
                text = presenter.configuration.textSelected;
                eventName = presenter.EVENTS.SHOW_ANSWERS;
                presenter.$wrapper.addClass('selected');

                if (presenter.configuration.enableCheckCounter){
                    presenter.playerController.getCommands().incrementCheckCounter();
                }

                if (presenter.configuration.enableMistakeCounter){
                    presenter.playerController.getCommands().increaseMistakeCounter();
                }
            } else {
                text = presenter.configuration.text;
                eventName = presenter.EVENTS.HIDE_ANSWERS;
                presenter.$wrapper.removeClass('selected');
            }

            presenter.$button.text(text);
            presenter.sendEvent(eventName);
        });
    };

    function presenterLogic(view, model, isPreview) {
        var upgradedModel = presenter.upgradedModel(model);

        presenter.configuration = presenter.validateModel(upgradedModel);
        presenter.$view = $(view);

        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.$button = presenter.$view.find('.show-answers-button');
        presenter.$button.text(presenter.configuration.text);
        presenter.$wrapper = presenter.$view.find('.show-answers-wrapper');

        if (!isPreview) {
            presenter.handleClickAction();
            presenter.eventBus.addEventListener('ShowAnswers', presenter);
            presenter.eventBus.addEventListener('HideAnswers', presenter);
        }
    }

    presenter.run = function(view, model) {
        presenter.view = view;
        presenterLogic(view, model, false);

        presenter.view.addEventListener("DOMNodeRemoved", presenter.destroy);
    };

    presenter.destroy = function (event) {
        if (event.target !== presenter.view) {
            return;
        }

        presenter.view.removeEventListener("DOMNodeRemoved", presenter.destroy);
        presenter.$button.off();

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

    return presenter;
}