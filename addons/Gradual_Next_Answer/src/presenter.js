function AddonGradual_Next_Answer_create() {
    var presenter = function () {
    };

    presenter.state = {
        isVisible: true,
        isDisabled: false,
        isErrorMode: false,
        isPreview: false
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

    presenter.clickHandler = function AddonGradualNextAnswer_clickHandler(event) {
        if (event !== undefined) {
            event.stopPropagation();
        }

        if (presenter.isDisabled()) return;

        presenter.triggerButtonClickedEvent();
    };

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
            button: presenter.view.getElementsByClassName("gradual-show-answers-button")[0]
        };

        presenter.configuration = validatedModel.value;

        if (!isPreview) {
            presenter.addHandleOfMouseActions();
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
            'disable': presenter.disable
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.show = function () {

    }

    presenter.hide = function () {

    }

    presenter.disable = function () {

    }

    presenter.addHandleOfMouseActions = function () {
        presenter.viewElements.button.addEventListener("click", presenter.clickHandler);
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    return presenter;
}