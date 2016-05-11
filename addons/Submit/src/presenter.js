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

    function getEventObject(item, value, score) {
        return {
            'source': presenter.configuration.addonID,
            'item': item != undefined ? item : "",
            'value': value != undefined ? value : "",
            'score': score != undefined ? score : ""
        };
    }

    presenter.sendEvent = function(eventName, eventData) {
        var eventObject = getEventObject(eventData.item, eventData.value, eventData.score);

        presenter.eventBus.sendEvent(eventName, eventObject);
    };

    presenter.ERROR_CODES = {

    };

    presenter.createPreview = function(view, model) {
        runLogic(view, model, true);
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.validateModel = function(model, isPreview) {
        var buttonText = model['Text'],
            buttonTextSelected = model['TextSelected'],
            isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);

        return {
            'buttonText' : buttonText,
            'buttonTextSelected' : buttonTextSelected,
            'addonID' : model['ID'],
            'isVisible' : isVisible,
            'isVisibleByDefault': isVisible
        }
    };

    function getAllOfTheModulesThatImplementIsAttempted() {
        var pageIndex = presenter.playerController.getCurrentPageIndex(),
            ids = presenter.playerController.getPresentation().getPage(pageIndex).getModulesAsJS(),
            modules = [];

        for(var i = 0; i < ids.length; i++){
            var currentModule = presenter.playerController.getModule(ids[i]);

            if (currentModule && currentModule.isAttempted !== undefined) {
                modules.push(currentModule);
            }
        }
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

        presenter.configuration = presenter.validateModel(model, isPreview);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.submitButton = presenter.$view.find('.submit-button');
        presenter.submitButton.html(presenter.configuration.buttonText);
        presenter.submitWrapper = presenter.$view.find('.submit-wrapper');

        presenter.pageLoaded.then(function() {

            presenter.modulesOnPage = getAllOfTheModulesThatImplementIsAttempted();

            presenter.submitButton.click(function(e) {
                e.stopPropagation();

                var isSelected = $(presenter.submitWrapper).hasClass('selected');

                if (isSelected) {
                    presenter.submitWrapper.removeClass('selected');
                    presenter.submitButton.html(presenter.configuration.buttonText);

                    presenter.playerController.getCommands().uncheckAnswers();
                    presenter.sendEvent('State', presenter.createEventData({ 'value' : 0 }));

                } else if (areAllModulesAttempted()) {
                    presenter.submitWrapper.addClass('selected');
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
        presenter.submitWrapper.removeClass('selected');
        presenter.submitButton.html(presenter.configuration.buttonText);
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
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
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function(rawState){
        var state = JSON.parse(rawState);

        presenter.setVisibility(state.isVisible);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        presenter.configuration.isVisible = isVisible;
    };

    presenter.show = function() {
        presenter.setVisibility(true);
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
    };

    return presenter;
}