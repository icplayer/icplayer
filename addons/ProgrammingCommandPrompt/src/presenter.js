function AddonProgrammingCommandPrompt_create () {
    var presenter = function () {};

    presenter.ERROR_MESSAGES = {
        TTC01: "You need to fill Scene Module ID.",
    };

    presenter.showErrorMessage = function (message, substitutions) {
        var errorContainer;
        if (typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            var messageSubst = message;
            for (var key in substitutions) {
                messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }
        presenter.$view.html(errorContainer);
    };

    presenter.run = function(view, model) {
        presenter.runLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.runLogic(view, model, true);
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this, true);
    };

    presenter.destroy = function (event) {
        if (event.target !== presenter.view) { return; }

        presenter.configuration.sceneModule = null;
        presenter.configuration = null;
        presenter.editor.destroy();
        presenter.editor.container.remove();
        presenter.editor = null;
    };

    presenter.runLogic = function (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.view = view;
        presenter.configuration = presenter.validateModel(model);

        if (!presenter.configuration.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[presenter.configuration.errorCode]);
            return;
        }

        var editor = presenter.$view.find(".editor");
        editor.css({
            width: presenter.$view.width(),
            height: presenter.$view.height()
        });
        presenter.editor = ace.edit(editor[0]);

        MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();

        presenter.setRunButton();

        if (!isPreview) {
            presenter.connectHandlers();
        }

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);
    };
    
    presenter.connectHandlers = function () {
        presenter.configuration.sceneModule = presenter.playerController.getModule(presenter.configuration.sceneID);
        presenter.$view.find(".run").click(function () {
            if (presenter.configuration.sceneModule !== null) {
                var code = presenter.getWorkspaceCode();
                presenter.configuration.sceneModule.executeCode(code);
            }
        });        
    };

    presenter.setCode = function Programming_Command_Prompt_set_code (code) {
        presenter.editor.setValue(code, code.length+1);
    };

    presenter.setRunButton = function () {
        if (presenter.configuration.hideRun) {
            presenter.$view.find(".run").css({
                "display": "none"
            });
        }
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'getWorkspaceCode' : presenter.getWorkspaceCode,
            'show': presenter.show,
            'hide': presenter.hide,
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getWorkspaceCode = function () {
        return presenter.editor.getValue();
    };

    presenter.validateModel = function (model) {
        var sceneID = model["sceneID"].trim();
        if (sceneID == "") {
            return {
                isValid: false,
                errorCode: "TTC01"
            };
        }

        return {
            addonID: model['ID'],
            isValid: true,
            sceneID: sceneID,
            sceneModule: null,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            defaultVisibility: ModelValidationUtils.validateBoolean(model['Is Visible']),
            hideRun: ModelValidationUtils.validateBoolean(model["hideRun"]),
        };
    };

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName == "PageLoaded") {
            if (presenter.configuration.sceneModule === null || presenter.configuration.sceneModule === undefined) {
                presenter.configuration.sceneModule = presenter.playerController.getModule(presenter.configuration.sceneID);
            }
        }
    };
    
    presenter.getState = function Programming_Command_Prompt_get_state () {
        return JSON.stringify({
            code: presenter.getWorkspaceCode(),
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function Programming_Command_Prompt_set_state (state) {
        var object = JSON.parse(state);
        presenter.setCode(object.code);
        presenter.setVisibility(object.isVisible);
    };

    presenter.reset = function () {
        presenter.setCode("");
        presenter.setVisibility(presenter.configuration.defaultVisibility);
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.configuration.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    return presenter;
}
