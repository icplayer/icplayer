function AddonTurtleTextCode_create () {
    var presenter = function () {};

    presenter.ERROR_MESSAGES = {
        TTC01: "You need to fill Turtle Graphic Module ID.",
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
    };

    presenter.destroy = function () {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.configuration.turtleModule = null;
        presenter.configuration.$inputArea = null;
        presenter.configuration = null;
        presenter.$view.find(".run").off();
    };

    presenter.runLogic = function (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.view = view;
        presenter.configuration = presenter.validateModel(model);

        if (!presenter.configuration.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[presenter.configuration.errorCode]);
            return;
        }

        if (isPreview) {
            return;
        }

        console.log(presenter.configuration.turtleGraphicID);
        presenter.configuration.turtleModule = presenter.playerController.getModule(presenter.configuration.turtleGraphicID);
        console.log(presenter.configuration.turtleModule);

        presenter.configuration.$inputArea = presenter.$view.find(".input_area");
        presenter.$view.find(".run").click(function () {
            if (presenter.configuration.turtleModule !== null) {
                var code = presenter.configuration.$inputArea.val();
                console.log("wysylam kod do addonu");
                console.log(presenter.configuration.turtleModule);
                console.log(code);
                presenter.configuration.turtleModule.execute(code);
            }
        });

        presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });
    };

    presenter.validateModel = function (model) {
        var turtleGraphicID = model["TurtleGraphicID"].trim();
        if (turtleGraphicID == "") {
            return {
                isValid: false,
                errorCode: "TTC01"
            };
        }

        return {
            isValid: true,
            turtleGraphicID: turtleGraphicID,
            turtleModule: null,
            inputArea: null
        };
    };
    
    
    return presenter;
}
