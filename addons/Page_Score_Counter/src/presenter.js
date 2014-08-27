function AddonPage_Score_Counter_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.isVisible = true;
    presenter.score = 0;
    presenter.maxScore = 0;

    presenter.DISPLAY_MODE = {
        FRACTION: 1,
        SCORE: 2,
        MAX_SCORE: 3
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.onEventReceived = function(eventName) {
    };

    presenter.createEventData = function (score) {
        return {
            'source': presenter.configuration.addonID,
            'item': '',
            'value' : '',
            'score': score
        };
    };

    presenter.sendEvent = function(eventName, eventData) {
        presenter.eventBus.sendEvent(eventName, eventData);
    };

    presenter.ERROR_CODES = {

    };

    presenter.createPreview = function(view, model) {
        runLogic(view, model, false);
    };

    presenter.validateModel = function(model) {
        return {
            'isVisible' : ModelValidationUtils.validateBoolean(model["Is Visible"]),
            'addonID' : model['ID'],
            'displayMode' : getDisplayMode(model['DisplayMode'])
        }
    };

    function getDisplayMode(rawDisplayMode) {
        if (rawDisplayMode == 'Fraction (Score/Max Score)' || rawDisplayMode == '') { // when dropdown hasn't been changed it gives you empty string
            return presenter.DISPLAY_MODE.FRACTION;
        } else if (rawDisplayMode == 'Score'){
            return presenter.DISPLAY_MODE.SCORE;
        } else if (rawDisplayMode == 'Max Score') {
            return presenter.DISPLAY_MODE.MAX_SCORE;
        }
    }

    function runLogic(view, model, isPreview) {

        presenter.configuration = presenter.validateModel(model);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.$view = $(view);
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.$fractionWrapper = presenter.$view.find('.page-score-counter-wrapper > .fraction');
        presenter.$scoreWrapper = presenter.$view.find('.page-score-counter-wrapper > .score');
        presenter.$maxScoreWrapper = presenter.$view.find('.page-score-counter-wrapper > .max-score');

        if (presenter.configuration.displayMode == presenter.DISPLAY_MODE.FRACTION) {
            toggleBoxVisibility(presenter.$fractionWrapper);
        } else if (presenter.configuration.displayMode == presenter.DISPLAY_MODE.SCORE) {
            toggleBoxVisibility(presenter.$scoreWrapper);
        } else if (presenter.configuration.displayMode == presenter.DISPLAY_MODE.MAX_SCORE) {
            toggleBoxVisibility(presenter.$maxScoreWrapper);
        }

        if (!isPreview) {
            updateValue();
        }
    }

    function updateValue(scoreValue, maxScoreValue) {
        if (presenter.playerController) {
        var score = scoreValue == undefined ? 0 : scoreValue,
            maxScore = maxScoreValue == undefined ? 0 : maxScoreValue;

        var model = presenter.playerController.getPresentation();
        var scoreService = presenter.playerController.getScore();
        var pageIndex = presenter.playerController.getCurrentPageIndex();
        var page = model.getPage(pageIndex);

        if(page.isReportable()){
            var pageScore = scoreService.getPageScoreById(page.getId()),
                score = pageScore.score,
                maxScore = pageScore.maxScore;

            if (maxScore == 0 && page.isVisited()) {
                score = 1;
                maxScore = 1;
            }

            presenter.$fractionWrapper.find('.score').html(score);
            presenter.$fractionWrapper.find('.max-score').html(maxScore);
            presenter.$scoreWrapper.html(score);
            presenter.$maxScoreWrapper.html(maxScore);
            presenter.score = score;
            presenter.maxScore = maxScore;
        }

        presenter.sendEvent('ValueChanged', presenter.createEventData(score));
        }
    }

    function toggleBoxVisibility($element) {
        presenter.$view.find('.page-score-counter-wrapper > div').addClass('hidden');
        $element.removeClass('hidden');
    }

    presenter.run = function(view, model) {
        runLogic(view, model, false);
    };

    presenter.setShowErrorsMode = function() {
        updateValue();
    };

    presenter.setWorkMode = function() {};

    presenter.reset = function() {
        presenter.setVisibility(presenter.configuration.isVisible);
        updateValue();
    };

    presenter.setVisibility = function (isVisible) {
        presenter.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.setVisibility(true);
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'getPageScore' : presenter.getPageScore,
            'getPageMaxScore' : presenter.getPageMaxScore
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getPageScore = function() {
        return presenter.score;
    };

    presenter.getPageMaxScore = function() {
        return presenter.maxScore;
    };

    presenter.getErrorCount = function() {
        return 0;
    };

    presenter.getMaxScore = function() {
        return 0;
    };

    presenter.getScore = function() {
        return 0;
    };

    presenter.getState = function() {
        return JSON.stringify({
            'isVisible' : presenter.isVisible,
            'score' : presenter.score,
            'maxScore' : presenter.maxScore
        });
    };

    presenter.setState = function(state) {
        var parsed = JSON.parse(state);
        presenter.isVisible = parsed.isVisible;

        updateValue(parsed.score, parsed.maxScore);

        presenter.setVisibility(presenter.isVisible);
    };

    return presenter;
}