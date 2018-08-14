function AddonCompletion_Progress_create() {
    var presenter = function () { };

    var playerController;
    var eventBus;

    presenter.currentProgress = 0;
    presenter.modules = [];

    presenter.setPlayerController = function(controller) {
        playerController = controller;
        eventBus = controller.getEventBus();
        eventBus.addEventListener('PageLoaded', this);

        presenter.page = controller.getPresentation().getPage(controller.getCurrentPageIndex());
    };

    presenter.updateProgress = function () {
        if (presenter.modules.length == 0) {
            presenter.currentProgress = 0;
        } else {
            var attemptedCount = 0;

            for (var i = 0; i < presenter.modules.length; i++) {
                if (presenter.modules[i].isAttempted()) {
                    attemptedCount++;
                }
            }

            presenter.currentProgress = Math.floor((attemptedCount / presenter.modules.length) * 100);
        }

        presenter.updateProgressUI(presenter.currentProgress);
    };

    presenter.loadModules = function () {
        if (!presenter.page.isReportable()) {
            return;
        }

        var modules = presenter.page.getModulesAsJS(),
            module, loadedModules = [];

        for (var i = 0; i < modules.length; i++) {
            module = playerController.getModule(modules[i]);

            if (module && module.isAttempted !== undefined) {
                loadedModules.push(module);
            }
        }

        presenter.modules = loadedModules;
    };

    presenter.validateModel = function (model) {
        return {
            automaticCounting: !ModelValidationUtils.validateBoolean(model['Turn off automatic counting']),
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible'])
        };
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.pageLoadedDeferred = new $.Deferred();
        presenter.pageLoaded = presenter.pageLoadedDeferred.promise();

        presenter.$view = $(view);
        presenter.model = model;
        presenter.configuration = presenter.validateModel(model);

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        if (!isPreview && presenter.configuration.automaticCounting) {
            eventBus.addEventListener('ValueChanged', this);
            presenter.pageLoaded.then(function() {
                presenter.loadModules();
                presenter.updateProgress();
            });
        }
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ValueChanged") {
            presenter.updateProgress();
        }
        if (eventName == 'PageLoaded') {
            presenter.pageLoadedDeferred.resolve();
        }
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
    };
    
    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };


    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible,
            currentProgress: presenter.currentProgress
        });
    };

    presenter.setState = function (state) {
       if (!state) return;

        var parsedState = JSON.parse(state);

        presenter.configuration.isVisible = parsedState.isVisible;
        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.currentProgress = parsedState.currentProgress;
        presenter.updateProgressUI(presenter.currentProgress);
    };
    
    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'setProgress': presenter.setProgressCommand,
            'getProgress': presenter.getProgress
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
    };
    
    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.updateProgressUI = function (progress) {
        presenter.$view.find('.progress-bar').css('width', progress + '%');
        presenter.$view.find('.progress-text').text(progress + '%');
    };

    presenter.reset = function () {
        presenter.currentProgress = 0;

        presenter.updateProgressUI(0);
    };

    presenter.getProgress = function () {
        return presenter.currentProgress;
    };

    presenter.setProgress = function (progress) {
        var validatedProgress = ModelValidationUtils.validateIntegerInRange(progress, 100);

        if (!validatedProgress.isValid) {
            return;
        }

        presenter.currentProgress = validatedProgress.value;
        presenter.updateProgressUI(presenter.currentProgress);
    };

    presenter.setProgressCommand = function (params) {
        presenter.setProgress(params[0]);
    };

    return presenter;
}