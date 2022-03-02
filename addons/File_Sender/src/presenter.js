function AddonFile_Sender_create() {
    var presenter = function() {};



    function presenterLogic(view, model, isPreview) {
        presenter.addonID = model.ID;
        presenter.$view = $(view);

        console.log(model);
    }

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;

    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
    };

    presenter.executeCommand = function(name, params) {
        if (presenter.configuration.isErrorMode) return;

        console.log(name, params);
    };

    return presenter;
}