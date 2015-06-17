function AddonSelectableAddonsBinder_create(){
    var presenter = function () {};
    presenter.configuration = {};
    function presenterLogic (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.model = model;
        presenter.addons = (model.Addons).split('\n');
        if (isPreview) return;
        presenter.$view.css('visible', 'hidden');
    };
    presenter.getModule = function (moduleID) {
        return presenter.playerController.getModule(moduleID);
    };
    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('ValueChanged', this);
    };
    presenter.onEventReceived = function (eventName, eventData) {
        var moduleID = eventData.source;
        var matchedModule = presenter.matchEvent(moduleID);
        if (!matchedModule || eventData.value != 1) return;
        for (var i = 0; i < presenter.addons.length; i++) {
            if (presenter.addons[i] != moduleID)
                if(presenter.getModule(presenter.addons[i]) != null && presenter.getModule(presenter.addons[i]).deselect != undefined)
                    presenter.getModule(presenter.addons[i]).deselect();
        }
    };
    presenter.matchEvent = function (moduleID) {
        for (var i = 0; i < presenter.addons.length; i++) {
            if (presenter.addons[i] == moduleID) return true;
        }
        return false;
    };
    presenter.getModule = function (moduleID) {
        return presenter.playerController.getModule(moduleID);
    };
    presenter.run = function (view, model) {
        presenterLogic(view, model, false);
    };
    presenter.createPreview = function (view, model) {
        presenterLogic(view, model, true);
    };
    presenter.getState = function () {
    };
    presenter.setState = function (stringifiedState) {
    };
    return presenter;
}