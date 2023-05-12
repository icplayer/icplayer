function AddonPage_Score_Counter_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.printableController = null;
    presenter.eventBus = null;
    presenter.isVisible = true;
    presenter.isScoreVisible = false;
    presenter.currentScore = 0;
    presenter.maxScore = 0;
    presenter.printableState = null;
    presenter.printableStateMode = null;

    presenter.DISPLAY_MODE = {
        FRACTION: 1,
        SCORE: 2,
        MAX_SCORE: 3
    };

    presenter.PRINTABLE_STATE_MODE = {
        EMPTY: 0,
        SHOW_RESULTS: 1
    };

    presenter.CSS_CLASSES = {
        PRINTABLE_ADDON: "printable_addon_Page_Score_Counter",
        PRINTABLE_WRAPPER: "printable_page-score-counter-wrapper",
        PRINTABLE_FRACTION: "printable_fraction",
        PRINTABLE_SCORE: "printable_score",
        PRINTABLE_SEPARATOR: "printable_separator",
        PRINTABLE_MAX_SCORE: "printable_max-score"
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();

        var presentation = presenter.playerController.getPresentation();
        presenter.page = presentation.getPage(presenter.playerController.getCurrentPageIndex());
    };

    presenter.setPrintableController = function (controller) {
        presenter.printableController = controller;
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

    presenter.setPrintableState = function(state) {
        if (state === null || ModelValidationUtils.isStringEmpty(state))
            return;
        presenter.printableState = JSON.parse(state);
    };

    presenter.getPrintableHTML = function (model, showAnswers) {
        chosePrintableStateMode(showAnswers);
        const configuration = presenter.validateModel(model);

        const view = createPrintableBaseView(model);
        const wrapper = createPrintableWrapper();
        view.append(wrapper);

        switch (configuration.displayMode) {
            case presenter.DISPLAY_MODE.FRACTION:
                wrapper.append(createPrintableFraction());
                break;
            case presenter.DISPLAY_MODE.SCORE:
                wrapper.append(createPrintableScore());
                break;
            case presenter.DISPLAY_MODE.MAX_SCORE:
                wrapper.append(createPrintableMaxScore());
                break;
        }

        presenter.printableStateMode = null;
        return view.outerHTML;
    };

    function chosePrintableStateMode(showAnswers) {
        if (presenter.printableState && showAnswers) {
            presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.SHOW_RESULTS;
        } else {
            presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.EMPTY;
        }
    }

    function isInPrintableShowResultsStateMode() {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.SHOW_RESULTS;
    }

    function createPrintableBaseView(model) {
        const element = document.createElement("div");
        element.id = model.ID;
        element.classList.add(presenter.CSS_CLASSES.PRINTABLE_ADDON);
        return element;
    }

    function createPrintableWrapper() {
        const wrapper = document.createElement("div");
        wrapper.classList.add(presenter.CSS_CLASSES.PRINTABLE_WRAPPER);
        return wrapper;
    }

    function createPrintableFraction() {
        const element = document.createElement("div");
        element.classList.add(presenter.CSS_CLASSES.PRINTABLE_FRACTION);
        element.append(createPrintableScore());
        element.append(createPrintableSeparator());
        element.append(createPrintableMaxScore());
        return element;
    }

    function createPrintableScore() {
        const element = document.createElement("div");
        element.classList.add(presenter.CSS_CLASSES.PRINTABLE_SCORE);
        element.innerHTML = isInPrintableShowResultsStateMode()
            ? "" + presenter.printableState.score
            : "&nbsp;";
        return element;
    }

    function createPrintableSeparator() {
        const element = document.createElement("div");
        element.classList.add(presenter.CSS_CLASSES.PRINTABLE_SEPARATOR);
        element.innerText = "/";
        return element;
    }

    function createPrintableMaxScore() {
        const element = document.createElement("div");
        element.classList.add(presenter.CSS_CLASSES.PRINTABLE_MAX_SCORE);
        element.innerText = presenter.printableController.getPageMaxScore();
        return element;
    }

    return presenter;
}