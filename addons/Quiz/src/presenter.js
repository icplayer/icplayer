function AddonQuiz_create() {
    var presenter = function () {
    };

    var playerController;
    var eventBus; // Modules communication

    var ERRORS = {
        'QUESTION_AND_CHOICES_REQUIRED': "At least 1 question and 2 choices are required."
    };

    presenter.activeElements = [];
    presenter.currentQuestion = 0;
    presenter.answersOrder = false;
    presenter.wasWrong = false;
    presenter.haveWon = false;
    presenter.fiftyFiftyUsed = false;
    presenter.hintUsed = null;

    presenter.isShowAnswersActive = false;
    presenter.isVisible = true;

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
            isActivity: ModelValidationUtils.validateBoolean(model['isActivity'])
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

    var cleanWorkspace = function () {
        unbindEvents();
        presenter.activeElements = [];
        var wrapper = presenter.$view.find('.question-wrapper');
        wrapper.children().remove();
    };

    var gameWonMessage = function () {
        cleanWorkspace();
        var wrapper = $('<div class="game-won-message-wrapper"></div>');
        var message = $('<div class="game-won-message"></div>');
        message.html(presenter.config.gameWonMessage);
        wrapper.append(message);
        presenter.$view.find('.question-wrapper').append(wrapper);
    };

    var gameLostMessage = function () {
        cleanWorkspace();
        var wrapper = $('<div class="game-lost-message-wrapper"></div>');
        var message = $('<div class="game-lost-message"></div>');
        message.html(presenter.config.gameLostMessage);
        wrapper.append(message);
        presenter.$view.find('.question-wrapper').append(wrapper);
    };

    var getSelectItemAction = function(isCorrect, $this){
        return function (e) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            var eventData = {
                'source': presenter.addonID,
                'item': presenter.currentQuestion,
                'value': '1',
                'score': '1'
            };
            if(isCorrect) {
                $this.addClass('correct');
                eventBus.sendEvent('ValueChanged', eventData);
                if (presenter.currentQuestion == presenter.config.questions.length){
                    presenter.haveWon = true;
                    gameWonMessage();
                    eventBus.sendEvent('ValueChanged', presenter.createAllOKEventData())
                } else {
                    presenter.answersOrder = false;
                    presenter.currentQuestion++;
                    showQuestion(getCurrentQuestion());
                    bindEvents();
                }
            } else {
                $this.addClass('wrong');
                eventData['score'] = '0';
                eventBus.sendEvent('ValueChanged', eventData);
                gameLostMessage();
                presenter.wasWrong = true;
            }
        }
    };

    var bindEvents = function() {
        for (var i=0; i<presenter.activeElements.length; i++) {
            var $el = presenter.activeElements[i];
            $el.click($el.clickAction);
        }
    };

    var unbindEvents = function () {
        for (var i=0; i<presenter.activeElements.length; i++) {
            var $el = presenter.activeElements[i];
            $el.click(function () {console.log("Locked")});
        }
    };

    function getCurrentQuestion(){
        return presenter.config.questions[presenter.currentQuestion-1];
    }

    var fiftyFiftyAction = function (e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (!presenter.fiftyFiftyUsed) {
            // clue:
            presenter.fiftyFiftyUsed = true;
            unbindEvents();
            var removedItems = 0,
                i = -1;
            while (removedItems < 2) {
                i++;
                if (i == presenter.answersOrder.length){
                    i = 0;
                }
                var item = presenter.answersOrder[i];
                if (item===0 || item == null){
                    continue;
                }
                var x = Math.round(Math.random());
                if (x) {
                    removedItems++;
                    presenter.answersOrder[i] = null;
                }
            }
            showQuestion(getCurrentQuestion());
            bindEvents();
        }
    };

    function showHint(){
        presenter.$view.find('.question-hint').html(getCurrentQuestion().Hint);
        presenter.$view.find('.hint-button').addClass('used');
    }

    var hintAction = function (e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (presenter.hintUsed === null) {
            presenter.hintUsed = presenter.currentQuestion;
            showHint();
        }
    };

    var showQuestion = function(q){
        var $q = presenter.$view.find('.question-wrapper');
        var $title = $('<div class="question-title"></div>');
        var $tips = $('<div class="question-tips"></div>');

        cleanWorkspace();

        $title.html(q.Question);

        var tempAnswers = [
            q.CorrectAnswer,
            q.WrongAnswer1,
            q.WrongAnswer2,
            q.WrongAnswer3,
        ];

        if (!presenter.answersOrder){
            presenter.answersOrder = [0, 1, 2, 3];
            shuffle(presenter.answersOrder);
        }

        var answers = [0, 1, 2, 3];
        for (var i=0; i<4; i++){
            var index = presenter.answersOrder[i];
            if (index === null){
                answers[i] = null;
            } else {
                answers[i] = tempAnswers[index];
            }
        }

        var labels = ['A: ', 'B: ', 'C: ', 'D: '];

        for (var i=0; i<answers.length; i++) {
            var $tip = $('<div class="question-tip"></div>');
            var answer = answers[i];
            var label = labels[i];
            $tip.text(label + (answer || ''));
            if (answer === null){
                $tip.addClass('removed');
            }
            $tips.append($tip);
            $tip.clickAction = getSelectItemAction(answer==q.CorrectAnswer, $tip);
            presenter.activeElements.push($tip);
        }

        $q.append($title);
        $q.append($tips);
        if (presenter.config.helpButtons){
            var $hint = $('<div class="question-hint"></div>');
            var $buttons = $('<div class="question-hint-buttons"></div>');
            var $fiftyFifty = $('<div class="fifty-fifty"></div>');
            var $hintButton = $('<div class="hint-button"></div>');
            $fiftyFifty.clickAction = fiftyFiftyAction;
            $hintButton.clickAction = hintAction;
            $buttons.append($fiftyFifty);
            $buttons.append($hintButton);
            presenter.activeElements.push($fiftyFifty);
            presenter.activeElements.push($hintButton);
            $q.append($buttons);
            $q.append($hint);
            $q.addClass('with-hint');
            if (presenter.fiftyFiftyUsed) {
                $fiftyFifty.addClass('used');
            }
            if (presenter.hintUsed) {
                $hintButton.addClass('used');
                if (presenter.hintUsed == presenter.currentQuestion){
                    showHint();
                }
            }
        } else {
            $q.addClass('without-hint');
        }
    };

    var makeView = function (view, model, preview) {
        presenter.$view = $(view);
        presenter.config = getConfig(model);
        showQuestion(presenter.config.questions[0]);
        presenter.currentQuestion = 1;

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
            currentQuestion: presenter.currentQuestion,
            answersOrder: presenter.answersOrder,
            isVisible: presenter.isVisible,
            wasWrong: presenter.wasWrong,
            haveWon: presenter.haveWon,
            fiftyFiftyUsed: presenter.fiftyFiftyUsed,
            hintUsed: presenter.hintUsed,
        });
    };

    presenter.setState = function (gotState) {
        if (!gotState) {
            return;
        }
        var state = JSON.parse(gotState);
        presenter.currentQuestion = state.currentQuestion;
        presenter.answersOrder = state.answersOrder;
        presenter.wasWrong = state.wasWrong;
        presenter.haveWon = state.haveWon;
        presenter.fiftyFiftyUsed = state.fiftyFiftyUsed;
        presenter.hintUsed = state.hintUsed;
        cleanWorkspace();
        if (presenter.wasWrong){
            gameLostMessage();
        } else if (presenter.haveWon){
            gameWonMessage();
        } else {
            showQuestion(getCurrentQuestion());
            bindEvents();
        }
        presenter.setVisibility(state.isVisible);
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
        if (!presenter.config.isActivity) return 0;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        return getErrorCount();
    };

    presenter.getMaxScore = function () {
        if (!presenter.config.isActivity) return 0;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        return getMaxScore();
    };

    presenter.getScore = function () {
        if (!presenter.config.isActivity) return 0;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        return getScore();
    };

    function getErrorCount() {
        return presenter.wasWrong ? 1:0;
    }

    function getMaxScore() {
        return presenter.config.questions.length;
    }

    function getScore() {
        if (presenter.haveWon) {
            return presenter.currentQuestion;
        } else {
            return presenter.currentQuestion -1;
        }
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
        return (presenter.currentQuestion > 1) || presenter.wasWrong;
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