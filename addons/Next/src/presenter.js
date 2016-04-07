function AddonNext_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.wasSubmitted = false;

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this);
        presenter.eventBus.addEventListener('Submitted', this);
    };

    presenter.onEventReceived = function(eventName) {
        if (eventName == 'PageLoaded') {
            presenter.pageLoadedDeferred.resolve();
        } else if (eventName == 'Submitted') {
            presenter.pageSubmittedDeferred.resolve();
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
        var buttonText = model['Text'];

        return {
            'buttonText' : buttonText,
            'addonID' : model['ID']
        }
    };

    function getAllOfTheModulesThatImplementIsAttempted() {
        var pageIndex = presenter.playerController.getCurrentPageIndex(),
            ids = presenter.playerController.getPresentation().getPage(pageIndex).getModulesAsJS(),
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

    presenter.goToNextPage = function() {
        var pageIndex = presenter.playerController.getCurrentPageIndex();
        if (pageIndex + 1 < presenter.playerController.getPresentation().getPageCount()) {
            presenter.playerController.getCommands().gotoPageIndex(pageIndex + 1);
        }
    };

    function runLogic(view, model, isPreview) {
        presenter.pageLoadedDeferred = new $.Deferred();
        presenter.pageLoaded = presenter.pageLoadedDeferred.promise();
        presenter.pageSubmittedDeferred = new $.Deferred();
        presenter.pageSubmitted = presenter.pageSubmittedDeferred.promise();
        presenter.runEndedDeferred = new $.Deferred();
        presenter.runEnded = presenter.runEndedDeferred.promise();

        presenter.configuration = presenter.validateModel(model, isPreview);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.$view = $(view);
        presenter.submitButton = presenter.$view.find('.next-button');
        presenter.submitButton.html(presenter.configuration.buttonText);
        presenter.nextWrapper = presenter.$view.find('.next-wrapper');
        presenter.nextWrapper.addClass('disabled');

        presenter.pageSubmitted.then(function() {
            presenter.nextWrapper.removeClass('disabled');
        });

        presenter.pageLoaded.then(function() {

            presenter.modulesOnPage = getAllOfTheModulesThatImplementIsAttempted();

            presenter.submitButton.click(function(e) {
                e.stopPropagation();

                if (presenter.nextWrapper.hasClass('disabled')) {

                    if (areAllModulesAttempted()) {

                        presenter.sendEvent('AllAttempted', presenter.createEventData());

                    } else {

                        presenter.sendEvent('NotAllAttempted', presenter.createEventData());

                    }

                } else {

                    presenter.wasSubmitted = true;
                    presenter.goToNextPage();

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
            'wasSubmitted' : presenter.wasSubmitted
        });
    };

    presenter.setState = function(state){
        var parsed = JSON.parse(state);

        presenter.wasSubmitted = parsed.wasSubmitted;

        presenter.runEnded.then(function() {
            if (parsed.wasSubmitted) {
                presenter.nextWrapper.removeClass('disabled');
            }
        });
    };

    return presenter;
}