function AddonLesson_Progress_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('ShowErrors', this);
    };

    presenter.onEventReceived = function(eventName, _) {
        if (eventName == 'ShowErrors') {
            presenter.setShowErrorsMode();
        }
    };

    presenter.ERROR_CODES = {
    };

    presenter.createPreview = function(view, model) {
        runLogic(view, model, true);
    };

    presenter.validateModel = function(model) {
        return {
            showProgressBar: ModelValidationUtils.validateBoolean(model['Show_Progress_Bar']),
            showChecks: ModelValidationUtils.validateBoolean(model['Show_Checks']),
            showErrors: ModelValidationUtils.validateBoolean(model['Show_Errors']),
            showMistakes: ModelValidationUtils.validateBoolean(model['Show_Mistakes']),
            showMaxScore: ModelValidationUtils.validateBoolean(model['Show_All_Answers']),
            showCorrectAnswers: ModelValidationUtils.validateBoolean(model['Show_Correct_Answers']),
            calculateScoreOnPageChange: ModelValidationUtils.validateBoolean(model['Calculate_Score_On_Page_Change'])
        }
    };

    function runLogic(view, model, isPreview) {
        presenter.$view = $(view);
        presenter.$progressBarContainer = presenter.$view.find('.progress-bar-container');
        presenter.$progressBar = presenter.$view.find('.progress-bar');
        presenter.$progressText = presenter.$view.find('.progress-text');
        presenter.$checks = presenter.$view.find('.checks');
        presenter.$errors = presenter.$view.find('.errors');
        presenter.$mistakes = presenter.$view.find('.mistakes');
        presenter.$maxScore = presenter.$view.find('.max-score');
        presenter.$correctAnswers = presenter.$view.find('.correct-answers');

        model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(model);

        removeHidden(presenter.configuration.showProgressBar, presenter.$progressBarContainer);
        removeHidden(presenter.configuration.showChecks, presenter.$checks);
        removeHidden(presenter.configuration.showErrors, presenter.$errors);
        removeHidden(presenter.configuration.showMistakes, presenter.$mistakes);
        removeHidden(presenter.configuration.showMaxScore, presenter.$maxScore);
        removeHidden(presenter.configuration.showCorrectAnswers, presenter.$correctAnswers);

        if (presenter.configuration.calculateScoreOnPageChange && !isPreview) {
            presenter.setShowErrorsMode();
        }
    }

    function removeHidden(shouldRemove, $element) {
        if (shouldRemove) {
            $element.removeClass('hidden');
        } else {
            $element.addClass('hidden');
        }
    }

    presenter.run = function(view, model){
        runLogic(view, model, false);
    };

    function getLessonScore() {
        var sumOfScore = 0.0, sumOfErrors = 0, sumOfChecks = 0,
            sumOfMaxScore = 0.0,
            sumOfScaledScore = 0.0,
            sumOfMistakes = 0,
            sumOfWeights = 0,
            pageScaledScore = 0,
            count = 0, i, page, score,
            paginatedResults = [];
        var presentation = presenter.playerController.getPresentation();
        var scoreService = presenter.playerController.getScore();

        for (var i = 0; i < presentation.getPageCount(); i++) {
            var page = presentation.getPage(i);

            if (page.isReportable()) {
                score = scoreService.getPageScoreById(page.getId());

                if (score['maxScore']) {
                    pageScaledScore = score['score'] / score['maxScore'];
                } else {
                    pageScaledScore = page.isVisited() ? 1 : 0;
                }

                var _weight = page.getPageWeight();
                var weight =  !_weight && _weight !== 0 ? 1 : _weight;
                sumOfScaledScore += pageScaledScore * weight;
                sumOfScore += score.score;
                sumOfErrors += score.errorCount;
                sumOfChecks += score.checkCount;
                sumOfMaxScore += score.maxScore;
                sumOfMistakes += score.mistakeCount;
                sumOfWeights += weight;
                count += 1;
            }
        }

        var scaledScore = 0;
        if (count > 0) {
            if (sumOfWeights) {
                scaledScore = Math.round((sumOfScaledScore / sumOfWeights) * 100);
            } else {
                scaledScore = 1;
            }
        }

        return {
           progress: parseInt(scaledScore, 10),
           sumOfMaxScore: scoreService.getMaxScore(),
           sumOfMistakes: sumOfMistakes,
           sumOfErrors: sumOfErrors,
           sumOfChecks: sumOfChecks,
           sumOfScores: sumOfScore
       };
    }

    presenter.setShowErrorsMode = function(){
        var lessonScore = getLessonScore();
        if (presenter.configuration.showProgressBar) {
            presenter.$progressBar.css('width', lessonScore.progress + '%');
            presenter.$progressText.html(lessonScore.progress + '%');
        }

        if (presenter.configuration.showChecks) {
            presenter.$checks.find('.value').html(lessonScore.sumOfChecks);
        }

        if (presenter.configuration.showMistakes) {
            presenter.$mistakes.find('.value').html(lessonScore.sumOfMistakes);
        }

        if (presenter.configuration.showErrors) {
            presenter.$errors.find('.value').html(lessonScore.sumOfErrors);
        }

        if (presenter.configuration.showMaxScore) {
            presenter.$maxScore.find('.value').html(lessonScore.sumOfMaxScore);
        }

        if (presenter.configuration.showCorrectAnswers) {
            presenter.$correctAnswers.find('.value').html(lessonScore.sumOfScores);
        }
    };

    presenter.setWorkMode = function(){
    };

    presenter.show = function() {
        presenter.$view.show();
    };

    presenter.hide = function() {
        presenter.$view.hide();
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show' : presenter.show,
            'hide' : presenter.hide,
            'getLessonProgress' : presenter.getLessonProgress,
            'getLessonScore' : presenter.getLessonScore,
            'getLessonMaxScore' : presenter.getLessonMaxScore,
            'getLessonMistakes' : presenter.getLessonMistakes,
            'getLessonChecks' : presenter.getLessonChecks,
            'getLessonErrors' : presenter.getLessonErrors
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getLessonProgress = function() {
        return getLessonScore().progress;
    };

    presenter.getLessonScore = function() {
        return getLessonScore().sumOfScores;
    };

    presenter.getLessonMaxScore = function() {
        return getLessonScore().sumOfMaxScore;
    };

    presenter.getLessonMistakes = function() {
        return getLessonScore().sumOfMistakes;
    };

    presenter.getLessonChecks = function() {
        return getLessonScore().sumOfChecks;
    };

    presenter.getLessonErrors = function() {
        return getLessonScore().sumOfErrors;
    };

    presenter.reset = function(){
    };

    presenter.getState = function(){
    };

    presenter.setState = function(state){
    };

    presenter.upgradeModel = function(model) {
        var upgradedModel = $.extend(true, upgradedModel, model);

        if (!upgradedModel['Calculate_Score_On_Page_Change']) {
            upgradedModel['Calculate_Score_On_Page_Change'] = 'False';
        }

        return upgradedModel;
    };

    return presenter;
}


