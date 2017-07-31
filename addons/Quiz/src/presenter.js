function AddonQuiz_create() {
    var presenter = function () {
    };

    var playerController;
    var eventBus; // Modules communication

    var ERRORS = {
        'QUESTION_AND_CHOICES_REQUIRED': "At least 1 question and 2 choices are required."
    };


    presenter.createAllOKEventData = function () {
        return {
            'source': presenter.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };
    };

    var getConfig = function (model) {
        return {
            visibility: ModelValidationUtils.validateBoolean(model['Is Visible']),
            questions: model['Questions'],
            helpButtons: ModelValidationUtils.validateBoolean(model['ShowHelpButtons']),
            gameLostMessage: model['GameLostMessage'],
            gameWonMessage: model['GameWonMessage'],
            isActivity: model['isActivity']
        }
    };

    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    };

    var bindEvents = function() {

    };

    var showQuestion = function(q){
        var $q = $('<div class="question-wrapper"></div>');
        var $title = $('<div class="question-title"></div>');
        var $tips = $('<div class="question-tips"></div>');

        $title.html(q.Question);

        var answers = [
            q.CorrectAnswer,
            q.WrongAnswer1,
            q.WrongAnswer2,
            q.WrongAnswer3,
        ];
        shuffle(answers);

        var labels = ['A: ', 'B: ', 'C: ', 'D: '];

        for (var i=0; i<answers.length; i++) {
            var $tip = $('<div class="question-tip"></div>');
            $tip.text(labels[i] + answers[i]);
            $tips.append($tip)
        }

        $q.append($title);
        $q.append($tips);
        if (presenter.config.helpButtons){
            var $hint = $('<div class="question-hint"></div>');
            var $buttons = $('<div class="question-hint-buttons"></div>');
            var $fiftyFifty = $('<div class="fifty-fifty"></div>');
            var $hintButton = $('<div class="hint-button"></div>');
            $buttons.append($fiftyFifty);
            $buttons.append($hintButton);
            $q.append($buttons);
            $q.append($hint);
            $q.addClass('with-hint');
        } else {
            $q.addClass('without-hint');
        }
        presenter.$view.append($q);
    };

    var makeView = function (view, model, preview) {
        presenter.$view = $(view);
        presenter.config = getConfig(model);
        showQuestion(presenter.config.questions[0]);

        if (!preview){
            bindEvents();
        }
    };

    presenter.setPlayerController = function (controller) {
        playerController = controller;
    };

    presenter.setVisibility = function (isVisible) {
        presenter.isVisible = isVisible;
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.run = function (view, model) {
        eventBus = playerController.getEventBus();
        presenter.addonID = model.ID;
        makeView(view, model, false);

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function (view, model) {
        makeView(view, model, true);
    };

    presenter.getState = function () {
        if (presenter.isShowAnswersActive) {
            return presenter.currentState;
        }

        return JSON.stringify({
            // todo: implement
            isVisible: presenter.isVisible
        });
    };

    presenter.setState = function (state) {
        if (!state) {
            return;
        }
        // todo: implement
    };

    presenter.setShowErrorsMode = function () {
        if (isNotActivity) {
            return;
        }

        presenter.isErrorMode = true;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        showErrorsMode();
    };

    presenter.setWorkMode = function () {
        if (isNotActivity) {
            return;
        }

        presenter.isErrorMode = false;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        workMode(false);
    };

    function showErrorsMode(){
        // todo: implement
    };

    function workMode(){
        // todo: implement
    };

    presenter.reset = function () {
        presenter.isErrorMode = false;
        presenter.isShowAnswersActive = false;

        if (presenter.currentState) {
            delete presenter.currentState;
        }

        workMode();
        presenter.setVisibility(presenter.isVisibleByDefault);
    };

    presenter.getErrorCount = function () {
        if (!isActivity) return 0;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        return getErrorCount();
    };

    presenter.getMaxScore = function () {
        if (!isActivity) return 0;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        return getMaxScore();
    };

    presenter.getScore = function () {
        if (!isActivity) return 0;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        return getScore();
    };

    function getErrorCount() {
        //todo - implement getErrorCount()
    }

    function getMaxScore() {
        // todo - implement getMaxScore()
    }

    function getScore() {
        //todo - implement getscore()
    }

    presenter.executeCommand = function (name, params) {
        if (presenter.isErrorMode) {
            return;
        }

        var commands = {
            'isAllOK': presenter.isAllOK,
            'isAttempted' : presenter.isAttemptedCommand,
            'show': presenter.show,
            'hide': presenter.hide,
            'reset' : presenter.reset
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.isAttempted = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var isAttempted = false;

        // todo: implement isAttempted

        return isAttempted;
    };

    presenter.isAttemptedCommand = function () {
         return presenter.isAttempted();
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.showAnswers = function () {
        if (isNotActivity) {
            return;
        }
        presenter.isShowAnswersActive = true;
        presenter.currentState = getSelectedElements();
        // todo: show answers
    };

    presenter.hideAnswers = function () {
        if (isNotActivity) {
            return;
        }

        var state = JSON.stringify({
            "selectedElements": presenter.currentState,
            "isVisible": presenter.isVisible
        });

        presenter.setState(state);

        delete presenter.currentState;
        presenter.isShowAnswersActive = false;
    };

    return presenter;
}