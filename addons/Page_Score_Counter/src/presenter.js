function AddonPage_Score_Counter_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.isVisible = true;
    presenter.isScoreVisible = false;
    presenter.currentScore = 0;
    presenter.maxScore = 0;

    presenter.DISPLAY_MODE = {
        FRACTION: 1,
        SCORE: 2,
        MAX_SCORE: 3
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();

        var presentation = presenter.playerController.getPresentation();
        presenter.page = presentation.getPage(presenter.playerController.getCurrentPageIndex());
    };

    presenter.createEventData = function (score) {
        return {
            'source': presenter.configuration.addonID,
            'item': 'pageScore',
            'value' : '',
            'score': score
        };
    };

    presenter.sendEvent = function(eventName, eventData) {
        presenter.eventBus.sendEvent(eventName, eventData);
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
        }
    }

    presenter.attachEventHandler = function () {
        if (presenter.page.isReportable()) {
            presenter.eventBus.addEventListener('ValueChanged', this);
            presenter.eventBus.addEventListener('PageLoaded', this);
        }
    };
    function runLogic(view, model, isPreview) {
        presenter.$view = $(view);
        presenter.configuration = presenter.validateModel(model);
        presenter.isPreview = isPreview;

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        presenter.$fractionWrapper = presenter.$view.find('.page-score-counter-wrapper > .fraction');
        presenter.$scoreWrapper = presenter.$view.find('.page-score-counter-wrapper > .score');
        presenter.$maxScoreWrapper = presenter.$view.find('.page-score-counter-wrapper > .max-score');

        if (!isPreview) {
            presenter.attachEventHandler();
        } else {
            toggleBoxesVisibility();
        }
    }

    function toggleBoxesVisibility() {
        if (presenter.configuration.displayMode == presenter.DISPLAY_MODE.FRACTION) {
            toggleBoxVisibility(presenter.$fractionWrapper);
        } else if (presenter.configuration.displayMode == presenter.DISPLAY_MODE.SCORE) {
            toggleBoxVisibility(presenter.$scoreWrapper);
        } else if (presenter.configuration.displayMode == presenter.DISPLAY_MODE.MAX_SCORE) {
            toggleBoxVisibility(presenter.$maxScoreWrapper);
        }
    }

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName == "ValueChanged" && eventData.source != presenter.configuration.addonID) {
            if(eventData.item != 'pageScore'){
                presenter.countScore();
                updateView();
                presenter.sendEvent('ValueChanged', presenter.createEventData(presenter.currentScore));
            }
        }
        if (eventName == 'PageLoaded') {
            presenter.countScore();
            updateView();
        }
    };

    presenter.countScore = function () {
        var scoreService = presenter.playerController.getScore(),
            pageScore = scoreService.getPageScoreById(presenter.page.getId());

        presenter.currentScore = pageScore.score;
        presenter.maxScore = pageScore.maxScore;
    };

    function updateView() {
        if (!presenter.isScoreVisible) {
            toggleBoxesVisibility();
            presenter.isScoreVisible = true;
        }

        presenter.$fractionWrapper.find('.score').html(presenter.currentScore);
        presenter.$fractionWrapper.find('.max-score').html(presenter.maxScore);
        presenter.$scoreWrapper.html(presenter.currentScore);
        presenter.$maxScoreWrapper.html(presenter.maxScore);
    }

    function toggleBoxVisibility($element) {
        presenter.$view.find('.page-score-counter-wrapper > div').addClass('hidden');
        $element.removeClass('hidden');
    }

    presenter.run = function(view, model) {
       runLogic(view, model, false);

        if(presenter.configuration.displayMode == presenter.DISPLAY_MODE.FRACTION){
            presenter.$fractionWrapper.find('.score').text('0');
            presenter.$fractionWrapper.find('.max-score').html('0');
        }
        if(presenter.configuration.displayMode == presenter.DISPLAY_MODE.SCORE){
            presenter.$scoreWrapper.text('0');
            presenter.$scoreWrapper.removeClass('hidden');
            presenter.$view.find('.separator').css('display', 'none');
        }
        if(presenter.configuration.displayMode == presenter.DISPLAY_MODE.MAX_SCORE){
            presenter.$maxScoreWrapper.text('0');
            presenter.$maxScoreWrapper.removeClass('hidden');
            presenter.$view.find('.separator').css('display', 'none');
        }
    };

    presenter.reset = function() {
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.currentScore = 0;
        updateView();
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

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getPageScore = function() {
        return presenter.currentScore;
    };

    presenter.getPageMaxScore = function() {
        return presenter.maxScore;
    };

    presenter.getState = function() {
        return JSON.stringify({
            'isVisible' : presenter.isVisible,
            'isScoreVisible': presenter.isScoreVisible,
            'score' : presenter.currentScore,
            'maxScore' : presenter.maxScore
        });
    };

    presenter.setState = function(state) {
        if (!state) {
            return;
        }

        var parsedState = JSON.parse(state);

        presenter.currentScore = parsedState.score;
        presenter.maxScore = parsedState.maxScore;

        if (parsedState.isScoreVisible) {
            updateView();
        }

        presenter.setVisibility(parsedState.isVisible);
    };

    return presenter;
}