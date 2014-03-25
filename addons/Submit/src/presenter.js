function AddonSubmit_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this);

        presenter.runEndedDeferred = new $.Deferred();
        presenter.runEnded = presenter.runEndedDeferred.promise();
    };

    presenter.onEventReceived = function(eventName) {
        if (eventName == 'PageLoaded') {
            presenter.pageLoadedDeferred.resolve();
        }
    };

    presenter.createEventData = function (additionalEventData) {
        var eventData = { 'source': presenter.configuration.addonID };
        for (var key in additionalEventData) {
            eventData[key] = additionalEventData[key];
        }
        return eventData;
    };

    presenter.sendEvent = function(eventName, eventData) {
        presenter.eventBus.sendEvent(eventName, eventData);
    };

    presenter.ERROR_CODES = {

    };

    presenter.createPreview = function(view, model) {
        runLogic(view, model, true);
    };

    presenter.validateModel = function(model, isPreview) {
        var buttonText = model['Text'],
            buttonTextSelected = model['TextSelected'];

        return {
            'buttonText' : buttonText,
            'buttonTextSelected' : buttonTextSelected,
            'addonID' : model['ID']
        }
    };

    function getAllOfTheModulesThatImplementIsAttempted() {
        var pageIndex = presenter.playerController.getCurrentPageIndex(),
            ids = presenter.playerController.getPresentation().getPage(pageIndex).getModules(),
            modules = [];

        $.each(ids, function() {
            var id = this.toString(),
                currentModule = presenter.playerController.getModule(id);

            if (currentModule && currentModule.isAttempted !== undefined) {
                modules.push(currentModule);
            }

        });

        return modules;
    }

    function areAllModulesAttempted() {
        var areAllAttempted = true;

        $.each(presenter.modulesOnPage, function() {
            if (!this.isAttempted()) {
                areAllAttempted = false;
                return false; // break;
            }
        });

        return areAllAttempted;
    }

    function runLogic(view, model, isPreview) {
        presenter.pageLoadedDeferred = new $.Deferred();
        presenter.pageLoaded = presenter.pageLoadedDeferred.promise();

        presenter.$view = $(view);

        presenter.pageLoaded.then(function() {
            presenter.configuration = presenter.validateModel(model, isPreview);

            if (presenter.configuration.isError) {
                DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
                return;
            }

            presenter.submitButton = presenter.$view.find('.submit-button');
            presenter.submitButton.html(presenter.configuration.buttonText);

            presenter.modulesOnPage = getAllOfTheModulesThatImplementIsAttempted();

            presenter.submitButton.click(function(e) {
                e.stopPropagation();

                var isSelected = $(this).hasClass('selected');

                if (isSelected) {
                    presenter.submitButton.removeClass('selected');
                    presenter.submitButton.html(presenter.configuration.buttonText);

                    presenter.playerController.getCommands().uncheckAnswers();
                    presenter.sendEvent('State', presenter.createEventData({ 'value' : 0 }));

                } else if (areAllModulesAttempted()) {
                    presenter.submitButton.addClass('selected');
                    presenter.submitButton.html(presenter.configuration.buttonTextSelected);

                    presenter.playerController.getCommands().checkAnswers();
                    presenter.sendEvent('Submitted', presenter.createEventData());
                    presenter.sendEvent('State', presenter.createEventData({ 'value' : 1 }));
                } else {
                    presenter.sendEvent('NotAllAttempted', presenter.createEventData());
                }

            });

            presenter.runEndedDeferred.resolve();
        });
    }

    presenter.run = function(view, model){
        runLogic(view, model, false);
    };

    presenter.setShowErrorsMode = function(){
    };

    presenter.setWorkMode = function(){
    };

    presenter.reset = function(){
        presenter.submitButton.removeClass('selected');
        presenter.submitButton.html(presenter.configuration.buttonText);
    };

    presenter.getErrorCount = function(){
        return 0;
    };

    presenter.getMaxScore = function(){
        return 0;
    };

    presenter.getScore = function(){
        return 0;
    };

    presenter.getState = function(){
        return JSON.stringify({
            'isSelected' : presenter.submitButton.hasClass('selected')
        });
    };

    presenter.setState = function(state){
        var parsed = JSON.parse(state);

        presenter.runEnded.then(function() {
            if (parsed.isSelected) {
                presenter.submitButton.html(presenter.configuration.buttonTextSelected);
                presenter.submitButton.addClass('selected');
            }
        });
    };

    return presenter;
}