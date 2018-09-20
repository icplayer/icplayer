function AddonLesson_Error_Counter_create() {
    var presenter = function () { };

    presenter.playerController = null;

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.scoreService = controller.getScore();
    };

    presenter.countErrors = function () {
        var presentation = presenter.playerController.getPresentation(),
            errorCount = 0, pageScore;


        for(var i = 0; i < presentation.getPageCount(); i++){
            var page = presentation.getPage(i);

            if(page.isReportable() && page.isVisited()){
                pageScore = presenter.scoreService.getPageScoreById(page.getId());
                errorCount += pageScore.errorCount;
            }
        }

        presenter.$view.text(errorCount);
    };

    presenter.sanitizeModel = function (model) {
        var isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);

        return {
            isVisibleByDefault: isVisible,
            isVisible: isVisible
        };
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.configuration = presenter.sanitizeModel(model);

        presenter.setVisibility(presenter.configuration.isVisibleByDefault || isPreview);

        if (!isPreview) {
            presenter.countErrors();
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
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function (state) {
        if (!state) {
            return;
        }

        var parsedState = JSON.parse(state);

        presenter.configuration.isVisible = parsedState.isVisible;
        presenter.setVisibility(parsedState.isVisible);
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
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

    presenter.reset = function () {
        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    return presenter;
}