function AddonLesson_Score_Counter_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.isVisible = true;
    presenter.score = 0;
    presenter.maxScore = 0;

    presenter.DISPLAY_MODE = {
        FRACTION: 1,
        SCORE: 2,
        MAX_SCORE: 3,
        PERCENTAGE: 4
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.onEventReceived = function(eventName) {
    };

    presenter.createEventData = function (score) {
    };

    presenter.sendEvent = function(eventName, eventData) {
        presenter.eventBus.sendEvent(eventName, eventData);
    };

    presenter.ERROR_CODES = {

    };

    presenter.createPreview = function(view, model) {
        runLogic(view, model, true);
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
        } else if (rawDisplayMode == 'Percentage') {
            return presenter.DISPLAY_MODE.PERCENTAGE;
        }
    }

    function runLogic(view, model, isPreview) {

        presenter.configuration = presenter.validateModel(model);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.$view = $(view);
        presenter.setVisibility(presenter.configuration.isVisible || isPreview);
        presenter.$fractionWrapper = presenter.$view.find('.lesson-score-counter-wrapper > .fraction');
        presenter.$scoreWrapper = presenter.$view.find('.lesson-score-counter-wrapper > .score');
        presenter.$maxScoreWrapper = presenter.$view.find('.lesson-score-counter-wrapper > .max-score');
        presenter.$percentageWrapper = presenter.$view.find('.lesson-score-counter-wrapper > .percentage');

        if (presenter.configuration.displayMode == presenter.DISPLAY_MODE.FRACTION) {
            toggleBoxVisibility(presenter.$fractionWrapper);
        } else if (presenter.configuration.displayMode == presenter.DISPLAY_MODE.SCORE) {
            toggleBoxVisibility(presenter.$scoreWrapper);
        } else if (presenter.configuration.displayMode == presenter.DISPLAY_MODE.MAX_SCORE) {
            toggleBoxVisibility(presenter.$maxScoreWrapper);
        } else if (presenter.configuration.displayMode == presenter.DISPLAY_MODE.PERCENTAGE) {
            toggleBoxVisibility(presenter.$percentageWrapper);
        }

        if (!isPreview) {
            updateValue();
        }
    }

    function updateValue(scoreValue, maxScoreValue) {
        if (presenter.playerController) {
            var score = scoreValue == undefined ? 0 : scoreValue,
                maxScore = maxScoreValue == undefined ? 0 : maxScoreValue;

            var scoreService = presenter.playerController.getScore();

            var score = scoreService.getTotalScore(),
                maxScore = scoreService.getMaxScore();

            if (maxScore > 0) {
                presenter.$percentageWrapper.html(parseInt(((score/maxScore) * 100), 10) + '%');
            }
            presenter.$fractionWrapper.find('.score').html(score);
            presenter.$fractionWrapper.find('.max-score').html(maxScore);
            presenter.$scoreWrapper.html(score);
            presenter.$maxScoreWrapper.html(maxScore);
            presenter.score = score;
            presenter.maxScore = maxScore;
        }
    }

    function toggleBoxVisibility($element) {
        presenter.$view.find('.lesson-score-counter-wrapper > div').addClass('hidden');
        $element.removeClass('hidden');
    }

    presenter.run = function(view, model) {
        runLogic(view, model, false);
    };

    presenter.setShowErrorsMode = function() {
    };

    presenter.setWorkMode = function() {};

    presenter.reset = function() {
        presenter.setVisibility(presenter.configuration.isVisible);
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
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
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