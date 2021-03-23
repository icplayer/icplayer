function AddonGradual_Show_Answer_create() {
    var presenter = function () {
    };

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
    presenter.playerController = null;

    presenter.validateModel = function (model) {
        var modelValidator = new ModelValidator();

        return modelValidator.validate(model, [
            ModelValidators.utils.FieldRename("Is Visible", "isVisible", ModelValidators.Boolean('isVisible')),
            ModelValidators.utils.FieldRename("Is Disabled", "isDisabled", ModelValidators.Boolean('isDisabled')),
            ModelValidators.utils.FieldRename("Is hide answers", "isHideAnswers", ModelValidators.Boolean('isHideAnswers')),
            ModelValidators.DumbString('ID'),
        ]);
    };

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model, presenter.isPreview)
    };

    presenter.isDisabled = function () {
        return presenter.state.isDisabled;
    }

    presenter.clickHandler = function AddonGradualShowAnswer_clickHandler(event) {
        if (event !== undefined) {
            event.stopPropagation();
        }

        // if gradual show answers mode is on, this button must be clickable
        if (
            presenter.isDisabled() &&
            (!presenter.state.isGradualShowAnswers ||
            presenter.configuration.isHideAnswers)
        )
            return;
  
        var eventData = {
            'source': presenter.addonID,
            'value': presenter.configuration.isHideAnswers ? "HideAllAnswers" : "ShowNextAnswer",
        };
        presenter.sendEvent(eventData);
        presenter.triggerButtonClickedEvent();
    };

    presenter.sendEvent = function (eventData) {
        var eventBus = presenter.playerController.getEventBus();
        eventBus.sendEvent('ValueChanged', eventData);
    }

    presenter.triggerButtonClickedEvent = function () {
        if (presenter.playerController == null) return;
        if (presenter.configuration.isHideAnswers) {
            presenter.playerController.getCommands().hideGradualAnswers();
        } else {
            presenter.playerController.getCommands().showNextAnswer();
        }
    }

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.addonID = model.ID;
        presenter.view = view;

        var validatedModel = presenter.validateModel(model);

        if (!validatedModel.isValid) {
            console.log(validatedModel);
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
        presenter.viewElements.button.style.visibility = 'visible';
        presenter.state.isVisible = true;
    }

    presenter.hide = function () {
        presenter.viewElements.button.style.visibility = 'hidden';
        presenter.state.isVisible = false;
    }

    presenter.disable = function () {
        presenter.state.isDisabled = true;
    }

    presenter.enable = function () {
        presenter.state.isDisabled = false;
    }


    presenter.addHandleOfMouseActions = function () {
        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            presenter.viewElements.button.addEventListener("touch", presenter.clickHandler);
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
        presenter.viewElements.button.removeEventListener("touch", presenter.clickHandler);
    };

    return presenter;
}

AddonGradual_Show_Answer_create.__supported_player_options__ = {
    interfaceVersion: 2
};