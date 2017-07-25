function AddonShow_Answers_create(){
    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.HOVER_CLASSES = ["ShowAnswers-up", "ShowAnswers-up-hover", "ShowAnswers-down-hover", "ShowAnswers-down"];
    presenter.timerID = 0;
    presenter.classStage = 0;
    presenter.lastIsHover = false;

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
        presenter.$button.on('click', function (eventData) {
            eventData.stopPropagation();

            var text, eventName;

            presenter.configuration.isSelected = !presenter.configuration.isSelected;
            presenter.setHovering(presenter.lastIsHover);
            if (MobileUtils.isSafariMobile(window.navigator.userAgent)) {
                presenter.simulateHoverClasses();
            }


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

    presenter.simulateHoverTimeoutFunction = function () {
        presenter.$wrapper.removeClass(presenter.HOVER_CLASSES.join(" "));
        presenter.$wrapper.addClass(presenter.HOVER_CLASSES[presenter.classStage]);
        if (presenter.configuration.isSelected) {
            presenter.classStage += 1;
        } else {
            presenter.classStage -= 1;
        }

        if (presenter.classStage > 0 && presenter.classStage < 3) {
            presenter.timeoutID = setTimeout(presenter.simulateHoverTimeoutFunction, 200);
        }
    };

    presenter.simulateHoverClasses = function () {
        clearTimeout(presenter.timeoutID);

        presenter.timeoutID = setTimeout(presenter.simulateHoverTimeoutFunction, 200);

        if (presenter.configuration.isSelected) {
            presenter.classStage = 0;
        } else {
            presenter.classStage = 3;
        }

        presenter.simulateHoverTimeoutFunction();


    };

    presenter.setHovering = function (isHover) {
        if (window.MobileUtils.isSafariMobile(window.Navigator.userAgent)) {
            return;
        }

        presenter.lastIsHover = isHover;
        presenter.$wrapper.removeClass(presenter.HOVER_CLASSES.join(" "));
        if (isHover) {
            if (presenter.configuration.isSelected) {
                presenter.$wrapper.addClass(presenter.HOVER_CLASSES[2]);
            } else {
                presenter.$wrapper.addClass(presenter.HOVER_CLASSES[1]);
            }
        } else {
            if (presenter.configuration.isSelected) {
                presenter.$wrapper.addClass(presenter.HOVER_CLASSES[3]);
            } else {
                presenter.$wrapper.addClass(presenter.HOVER_CLASSES[0]);
            }
        }
    };

    presenter.handleHoverClasses = function () {
        presenter.$button.mouseout(presenter.setHovering.bind(null, false));
        presenter.$button.mouseover(presenter.setHovering.bind(null, true));
    };

    function presenterLogic(view, model, isPreview) {
        presenter.configuration = presenter.sanitizeModel(model);
        presenter.$view = $(view);

        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.$button = presenter.$view.find('.show-answers-button');
        presenter.$button.text(presenter.configuration.text);
        presenter.$wrapper = presenter.$view.find('.show-answers-wrapper');

        presenter.$wrapper.addClass(presenter.HOVER_CLASSES[0]);

        if (!isPreview) {
            presenter.handleClickAction();
            presenter.handleHoverClasses();
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
        clearTimeout(presenter.timeoutID);
        presenter.$wrapper.removeClass(presenter.HOVER_CLASSES.join(" "));
        presenter.$wrapper.addClass(presenter.HOVER_CLASSES[presenter.classStage]);
    };

    presenter.setShowErrorsMode = function () {
        presenter.reset();
    };

    presenter.setWorkMode = function () {
        presenter.reset();
    };

    return presenter;
}