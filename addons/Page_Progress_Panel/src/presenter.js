function AddonPage_Progress_Panel_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

	presenter.configuration = {
		showProgressBar: false,
		showChecks: false,
		showErrors: false,
		showMistakes: false,
		showMaxScore: false,
		showCorrectAnswers: false,
		isVisible: true
	};

	presenter.state = {
		isVisible: true
	};

	presenter.lastScores = {
		progress: 0,
        sumOfMaxScore: 0,
		sumOfMistakes: 0,
		sumOfErrors: 0,
		sumOfChecks: 0,
		sumOfScores: 0
	};

    presenter.ERROR_CODES = {
    };

    presenter.createPreview = function(view, model) {
        runLogic(view, model, true);
    };

    presenter.validateModel = function(model) {
        return {
            addonID: model['ID'],
            showProgressBar: ModelValidationUtils.validateBoolean(model['Show_Progress_Bar']),
			progressBarText: model['Progress_Bar_text'],
            showChecks: ModelValidationUtils.validateBoolean(model['Show_Checks']),
			checksText: model['Checks_text'],
            showErrors: ModelValidationUtils.validateBoolean(model['Show_Errors']),
			errorsText: model['Errors_text'],
            showMistakes: ModelValidationUtils.validateBoolean(model['Show_Mistakes']),
			mistakesText: model['Mistakes_text'],
            showMaxScore: ModelValidationUtils.validateBoolean(model['Show_All_Answers']),
			maxScoreText: model['All_Answers_text'],
            showCorrectAnswers: ModelValidationUtils.validateBoolean(model['Show_Correct_Answers']),
			correctAnswersText: model['Correct_Answers_text'],
			isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"])
        }
    };

    function runLogic(view, model, isPreview) {
        presenter.$view = $(view);
		presenter.view = view;
        presenter.$progressBarContainer = presenter.$view.find('.progress-bar-container');
        presenter.$progressBar = presenter.$view.find('.progress-bar');
        presenter.$progressText = presenter.$view.find('.progress-text');
        presenter.$checks = presenter.$view.find('.checks');
        presenter.$errors = presenter.$view.find('.errors');
        presenter.$mistakes = presenter.$view.find('.mistakes');
        presenter.$maxScore = presenter.$view.find('.max-score');
        presenter.$correctAnswers = presenter.$view.find('.correct-answers');
        presenter.configuration = presenter.validateModel(model);
		presenter.displayText();
		presenter.state.isVisible = presenter.configuration.isVisible;

        removeHidden(presenter.configuration.showProgressBar, presenter.$progressBarContainer);
        removeHidden(presenter.configuration.showChecks, presenter.$checks);
        removeHidden(presenter.configuration.showErrors, presenter.$errors);
        removeHidden(presenter.configuration.showMistakes, presenter.$mistakes);
        removeHidden(presenter.configuration.showMaxScore, presenter.$maxScore);
        removeHidden(presenter.configuration.showCorrectAnswers, presenter.$correctAnswers);
		if (!isPreview) {
		    presenter.updateVisibility();
			var currentPageIndex = presenter.playerController.getCurrentPageIndex();
			var pageId = presenter.playerController.getPresentation().getPage(currentPageIndex).getId();
			var score = presenter.playerController.getScore().getPageScoreById(pageId);
			presenter.lastScores.sumOfMaxScore = score.maxScore;
			presenter.displayScores(presenter.lastScores);
			presenter.view.addEventListener('ShowAnswers', this);
		}

    };

	presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
			presenter.showAnswers();
		}
    };

	presenter.showAnswers = function() {
		var currentPageIndex = presenter.playerController.getCurrentPageIndex();
		var pageId = presenter.playerController.getPresentation().getPage(currentPageIndex).getId();
		var score = presenter.playerController.getScore().getPageScoreById(pageId);
		presenter.lastScores.sumOfMistakes = score.mistakeCount;
		presenter.lastScores.sumOfChecks = score.checkCount;
		presenter.displayScores(presenter.lastScores);
	};

    function removeHidden(shouldRemove, $element) {
        if (shouldRemove) {
            $element.removeClass('hidden');
        } else {
            $element.addClass('hidden');
        }
    };

    presenter.run = function(view, model){
        runLogic(view, model, false);
    };

    function getPageScore(){
        var currentPageIndex = presenter.playerController.getCurrentPageIndex();
		var page = presenter.playerController.getPresentation().getPage(currentPageIndex);
        var pageId = page.getId();
        var score = presenter.playerController.getScore().getPageScoreById(pageId);

		if (!page.isReportable()) {
			var percentageScore = 0;
		} else if (score.maxScore > 0) {
            var percentageScore = (score.score*100.0) / score.maxScore;
        }
        return {
            progress: Math.round(percentageScore),
            sumOfMaxScore: score.maxScore,
            sumOfMistakes: score.mistakeCount,
            sumOfErrors: score.errorCount,
            sumOfChecks: score.checkCount,
            sumOfScores: score.score
        };
    }

	presenter.displayText = function() {
		if (presenter.configuration.showProgressBar) {
            presenter.$progressBarContainer.find('.text').html(presenter.configuration.progressBarText);
        }

        if (presenter.configuration.showChecks) {
            presenter.$checks.find('.text').html(presenter.configuration.checksText);
        }

        if (presenter.configuration.showMistakes) {
            presenter.$mistakes.find('.text').html(presenter.configuration.mistakesText);
        }

        if (presenter.configuration.showErrors) {
            presenter.$errors.find('.text').html(presenter.configuration.errorsText);
        }

        if (presenter.configuration.showMaxScore) {
            presenter.$maxScore.find('.text').html(presenter.configuration.maxScoreText);
        }

        if (presenter.configuration.showCorrectAnswers) {
            presenter.$correctAnswers.find('.text').html(presenter.configuration.correctAnswersText);
        }
	};

	presenter.displayScores = function (pageScore) {
		if (presenter.configuration.showProgressBar) {
            presenter.$progressBar.css('width', pageScore.progress + '%');
            presenter.$progressText.html(pageScore.progress + '%');
        }

        if (presenter.configuration.showChecks) {
            presenter.$checks.find('.value').html(pageScore.sumOfChecks);
        }

        if (presenter.configuration.showMistakes) {
            presenter.$mistakes.find('.value').html(pageScore.sumOfMistakes);
        }

        if (presenter.configuration.showErrors) {
            presenter.$errors.find('.value').html(pageScore.sumOfErrors);
        }

        if (presenter.configuration.showMaxScore) {
            presenter.$maxScore.find('.value').html(pageScore.sumOfMaxScore);
        }

        if (presenter.configuration.showCorrectAnswers) {
            presenter.$correctAnswers.find('.value').html(pageScore.sumOfScores);
        }
	}
    presenter.setShowErrorsMode = function(){
        presenter.lastScores = getPageScore();
		presenter.displayScores(presenter.lastScores);
    };

    presenter.setWorkMode = function(){
    };

    presenter.show = function() {
        presenter.setVisibility(true);
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.state.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.updateVisibility = function() {
        (presenter.state.isVisible) ? presenter.show() : presenter.hide();
    };
	
    presenter.updateMistakes = function() {
	presenter.lastScores.sumOfMistakes = getPageScore().sumOfMistakes;
	if (presenter.configuration.showMistakes) {
		presenter.$mistakes.find('.value').html(presenter.lastScores.sumOfMistakes);
	}
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show' : presenter.show,
            'hide' : presenter.hide,
	    'updateMistakes' : presenter.updateMistakes,
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function(){
		var currentPageIndex = presenter.playerController.getCurrentPageIndex();
        var pageId = presenter.playerController.getPresentation().getPage(currentPageIndex).getId();
        var score = presenter.playerController.getScore().getPageScoreById(pageId);
		presenter.lastScores = {
			progress: 0,
            sumOfMaxScore: score.maxScore,
            sumOfMistakes: score.mistakeCount,
            sumOfErrors: 0,
            sumOfChecks: score.checkCount,
            sumOfScores: 0
		};
		presenter.displayScores(presenter.lastScores);
		presenter.state.isVisible = presenter.configuration.isVisible;
		presenter.updateVisibility();
    };

    presenter.getState = function(){
		return JSON.stringify({
            progress: presenter.lastScores.progress,
            sumOfMaxScore: presenter.lastScores.sumOfMaxScore,
            sumOfMistakes: presenter.lastScores.sumOfMistakes,
            sumOfErrors: presenter.lastScores.sumOfErrors,
            sumOfChecks: presenter.lastScores.sumOfChecks,
            sumOfScores: presenter.lastScores.sumOfScores,
			isVisible: presenter.state.isVisible
        });
    };
    presenter.setState = function(state){
		var parsedState = JSON.parse(state);
		presenter.lastScores = {
			progress: parsedState.progress,
			sumOfMaxScore: parsedState.sumOfMaxScore,
			sumOfMistakes: parsedState.sumOfMistakes,
			sumOfErrors: parsedState.sumOfErrors,
			sumOfChecks: parsedState.sumOfChecks,
			sumOfScores: parsedState.sumOfScores
		};
		presenter.state.isVisible = parsedState.isVisible;
		presenter.updateVisibility();
		presenter.displayScores(presenter.lastScores);
    };

    return presenter;
}
