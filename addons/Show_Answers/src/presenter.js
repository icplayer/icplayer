function AddonShow_Answers_create(){
    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.EVENTS = {
        SHOW_ANSWERS: 'ShowAnswers',
        HIDE_ANSWERS: 'HideAnswers'
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

    presenter.sanitizeModel = function(model) {
        return {
            'text' : model.Text,
            'textSelected' : model['Text selected'],
            'isVisible' : ModelValidationUtils.validateBoolean(model["Is Visible"]),
            'addonID' : model.ID,
            'isSelected': false,
            'enableCheckCounter': ModelValidationUtils.validateBoolean(model["Increment check counter"])
        }
    };

    presenter.handleClickAction = function () {
        presenter.$button.click(function (eventData) {
            eventData.stopPropagation();

            var text, eventName;

            presenter.configuration.isSelected = !presenter.configuration.isSelected;

            if (presenter.configuration.isSelected) {
                text = presenter.configuration.textSelected;
                eventName = presenter.EVENTS.SHOW_ANSWERS;
                presenter.$wrapper.addClass('selected');
                if(presenter.configuration.enableCheckCounter){
                    presenter.playerController.getCommands().incrementCheckCounter();
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
        presenter.configuration = presenter.sanitizeModel(model);
        presenter.$view = $(view);

        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.$button = presenter.$view.find('.show-answers-button');
        presenter.$button.text(presenter.configuration.text);
        presenter.$wrapper = presenter.$view.find('.show-answers-wrapper');

        if (!isPreview) {
            presenter.handleClickAction();
            presenter.eventBus.addEventListener('HideAnswers', presenter);
        }
    }

    presenter.run = function(view, model) {
            presenterLogic(view, model, false);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.configuration.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "HideAnswers") {
            presenter.reset();
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