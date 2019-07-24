function AddonQuiz_create() {
    /*
    *  KNOWN ISSUES:
    *
    *  The first time the addon is loaded, mathjax is rendered.
    *  Each reload content requires mathjax reload.
    *  When addon is loaded first time you shouldn't manually reload mathjax.
    *
    */

    var presenter = function () {
    };

    var playerController;
    var eventBus; // Modules communication
    var state;

    var ERRORS = {
        'QUESTION_REQUIRED': "At least 1 question is required.",
        'EMPTY_QUESTION': "At least one question is not specified",
        'MISSING_CORRECT_ANSWER': "At least one question doesn't have specified correct answer",
        'MISSING_WRONG_ANSWER': "At least one question doesn't have specified wrong answer",
        'MISSING_HINT': "At least one question doesn't have specified hint",
    };

    function ConfigurationError(label) {
        return {
            name: 'ConfigurationError',
            message: ERRORS[label] || label
        }
    }

    presenter.activeElements = [];
    presenter.isLoaded = false;

    function setupDefaults() {
        state = {
            currentQuestion: 1,
            answersOrder: false,
            wasWrong: false,
            haveWon: false,
            fiftyFiftyUsed: false,
            hintUsed: null,
            selectedAnswer: null,
            isVisible: true,
            score: []
        };
        // addon's modes
        presenter.isErrorMode = false;
        presenter.isShowAnswersActive = false;
    }

    presenter.createAllOKEventData = function AddonQuiz_createAllOKEventData() {
        return {
            'source': presenter.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };
    };

    function validateQuestions(questions, helpButtons) {
        if (questions.length < 1) {
            throw ConfigurationError('QUESTION_REQUIRED');
        }
        for (var i = 0; i < questions.length; i++) {
            var q = questions[i];
            if (ModelValidationUtils.isHtmlEmpty(q.Question)) {
                throw ConfigurationError('EMPTY_QUESTION');
            }
            if (ModelValidationUtils.isStringEmpty(q.CorrectAnswer)) {
                throw ConfigurationError('MISSING_CORRECT_ANSWER');
            }
            if (ModelValidationUtils.isStringEmpty(q.WrongAnswer1) && ModelValidationUtils.isStringEmpty(q.WrongAnswer2) && ModelValidationUtils.isStringEmpty(q.WrongAnswer3)
            ) {
                throw ConfigurationError('MISSING_WRONG_ANSWER');
            }
            if (helpButtons && ModelValidationUtils.isHtmlEmpty(q.Hint)) {
                throw ConfigurationError('MISSING_HINT');
            }
        }
        return questions;
    }

    presenter.setupConfig = function AddonQuiz_setupConfig(model) {
        var helpButtons = ModelValidationUtils.validateBoolean(model['ShowHelpButtons']);
        presenter.config = {
            visibility: ModelValidationUtils.validateBoolean(model['Is Visible']),
            questions: validateQuestions(model['Questions'], helpButtons),
            helpButtons: helpButtons,
            nextLabel: model['NextLabel'] || '',
            gameLostMessage: model['GameLostMessage'],
            gameWonMessage: model['GameWonMessage'],
            gameSummaryMessage: model['GameSummaryMessage'],
            correctGameMessage: model['CorrectGameMessage'],
            wrongGameMessage: model['WrongGameMessage'],
            centerVertically: ModelValidationUtils.validateBoolean(model['Center vertically']),
            isActivity: ModelValidationUtils.validateBoolean(model['isActivity']),
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            nextAfterSelect: ModelValidationUtils.validateBoolean(model['NextAfterSelect']),
            testMode: ModelValidationUtils.validateBoolean(model['TestMode']),
            showSummary: ModelValidationUtils.validateBoolean(model['ShowSummary'])
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

    function cleanWorkspace() {
        unbindEvents();
        presenter.activeElements = [];
        var wrapper = presenter.$view.find('.question-wrapper');
        wrapper.children().remove();
    };

    function showInHintArea($element) {
        presenter.hintWrapper.children().remove();
        presenter.hintWrapper.append($element);
    };

    function gameWonMessage() {
        var wrapper = $('<div class="game-won-message-wrapper"></div>');
        var message = $('<div class="game-won-message"></div>');
        if(presenter.config.showSummary) {
            message.html(presenter.config.gameWonMessage +
                '<div>' + presenter.config.gameSummaryMessage + '<div>' + presenter.config.correctGameMessage + ': ' + getScore() + '</div><div>' + presenter.config.wrongGameMessage + ': ' + (presenter.config.questions.length - getScore()) + '</div>' + '</div>');
        }else{
            message.html(presenter.config.gameWonMessage);
        }
        wrapper.append(message);
        showInHintArea(wrapper);
    };

    function gameLostMessage() {
        var wrapper = $('<div class="game-lost-message-wrapper"></div>');
        var message = $('<div class="game-lost-message"></div>');
        if(presenter.config.showSummary) {
            message.html(presenter.config.gameLostMessage +
                '<div>' + presenter.config.gameSummaryMessage + '<div>' + presenter.config.correctGameMessage + ': ' + getScore() + '</div><div>' + presenter.config.wrongGameMessage + ': ' + (presenter.config.questions.length - getScore()) + '</div>' + '</div>');
        }else{
            message.html(presenter.config.gameLostMessage);
        }
        wrapper.append(message);
        showInHintArea(wrapper);
    };

    function gameSummary() {
        var wrapper = $('<div class="game-summary-message-wrapper"></div>');
        var message = $('<div class="game-summary-message"></div>');
        message.html(presenter.config.gameSummaryMessage + '<div>' + presenter.config.correctGameMessage + ': ' + getScore() + '</div><div>' + presenter.config.wrongGameMessage + ': ' + (presenter.config.questions.length - getScore()) + '</div>');
        wrapper.append(message);
        showInHintArea(wrapper);
    };

    function getSelectItemAction(answer, $this) {
        var isCorrect = answer == getCurrentQuestion().CorrectAnswer;
        return function selectItemAction(e) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            var eventData = {
                'source': presenter.addonID,
                'item': state.currentQuestion,
                'value': '1',
                'score': '1'
            };
            state.selectedAnswer = answer;
            if (!presenter.config.testMode) {
                if (isCorrect) {
                    state.score[state.currentQuestion - 1] = 1;
                    $this.addClass('correct');
                    eventBus.sendEvent('ValueChanged', eventData);
                    if (state.currentQuestion == presenter.config.questions.length) {
                        gameWonMessage();
                        eventBus.sendEvent('ValueChanged', presenter.createAllOKEventData());
                        unbindEvents();
                    } else {
                        presenter.nextButton.addClass('active');
                        unbindEvents(presenter.nextButton);
                        if (presenter.config.nextAfterSelect) {
                            unbindEvents();
                            setTimeout(function () {
                                nextButtonAction();
                                bindEvents();
                            }, 500);
                        }
                    }
                } else {
                    state.score[state.currentQuestion - 1] = 0;
                    $this.addClass('wrong');
                    eventData['score'] = '0';
                    eventBus.sendEvent('ValueChanged', eventData);
                    gameLostMessage();
                    state.wasWrong = true;
                    unbindEvents();
                }
            } else {
                $this.addClass('option');

                if (isCorrect) {
                    state.score[state.currentQuestion - 1] = 1;
                } else {
                    state.score[state.currentQuestion - 1] = 0;
                    eventData['score'] = '0';
                }
                eventBus.sendEvent('ValueChanged', eventData);

                if (state.currentQuestion === presenter.config.questions.length) {
                    if (getScore() >= presenter.config.questions.length) {
                        gameWonMessage();
                        state.wasWrong = false;
                        eventBus.sendEvent('ValueChanged', presenter.createAllOKEventData());
                    }else{
                        gameLostMessage();
                        state.wasWrong = true;
                    }
                    unbindEvents();
                } else {
                    presenter.nextButton.addClass('active');
                    unbindEvents(presenter.nextButton);
                    if (presenter.config.nextAfterSelect) {
                        unbindEvents();
                        setTimeout(function () {
                            nextButtonAction();
                            bindEvents();
                        }, 500);
                    }
                }

            }
        }
    }

    function bindEvents() {
        var elements;
        if (arguments.length > 0) {
            elements = Array.prototype.slice.call(arguments);
        } else {
            elements = presenter.activeElements;
        }
        unbindEvents();
        for (var i = 0; i < elements.length; i++) {
            var $el = elements[i];
            $el.bind('click', $el.clickAction);
        }
    };

    function unbindEvents() {
        var args = Array.prototype.slice.call(arguments);
        for (var i = 0; i < presenter.activeElements.length; i++) {
            var $el = presenter.activeElements[i];
            if (args.indexOf($el) > -1) {
                continue;
            }
            $el.unbind('click', $el.clickAction);
        }
    };

    function getCurrentQuestion() {
        return presenter.config.questions[state.currentQuestion - 1];
    }

    function fiftyFiftyAction(e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (state.answersOrder.length >= 4 && !state.fiftyFiftyUsed) {
            // clue:
            state.fiftyFiftyUsed = true;
            unbindEvents();
            var removedItems = 0,
                i = -1;
            while (removedItems < 2) {
                i++;
                if (i == state.answersOrder.length) {
                    i = 0;
                }
                var item = state.answersOrder[i];
                if (item === 0 || item == null) {
                    continue;
                }
                var x = Math.round(Math.random());
                if (x) {
                    removedItems++;
                    state.answersOrder[i] = null;
                }
            }
            presenter.showCurrentQuestion();
            bindEvents();
        }
    };

    function showHint() {
        var $hint = $('<div class="question-hint"></div>').html(getCurrentQuestion().Hint);
        showInHintArea($hint);
        presenter.$view.find('.hint-button').addClass('used');
    }

    function nextButtonAction(e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if ((!state.wasWrong) && (state.selectedAnswer !== null) && state.currentQuestion < presenter.config.questions.length) {
            state.selectedAnswer = null;
            state.answersOrder = false;
            state.currentQuestion++;
            presenter.showCurrentQuestion();
            bindEvents();
        }
    }

    function hintAction(e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (state.hintUsed === null) {
            state.hintUsed = state.currentQuestion;
            showHint();
        }
    };

    function addProgressBar(wrapper) {
        var progress = $('<div class="quiz-progress"></div>'),
            current = state.currentQuestion,
            len = presenter.config.questions.length,
            info = '<span class="current-question-number">' + current + '</span>' +
                '<span class="divider">/</span>' +
                '<span class="questions-number">' + len + '</span>';
        progress.html(info);
        wrapper.append(progress);
    };

    function showQuestion(q, showAnswer) {
        var $q = presenter.$view.find('.question-wrapper');
        var $title = $('<div class="question-title"></div>');
        var $tips = $('<div class="question-tips"></div>');
        var $nextButton = $('<div class="next-question-button"></div>');
        $nextButton.text(presenter.config.nextLabel);
        $nextButton.clickAction = nextButtonAction;


        cleanWorkspace();

        $title.html(q.Question);

        var tempAnswers = [q.CorrectAnswer];
        [q.WrongAnswer1, q.WrongAnswer2, q.WrongAnswer3].forEach(function (wrongAnswer) {
            if (wrongAnswer && wrongAnswer.length > 0) {
                tempAnswers.push(wrongAnswer);
            }
        });

        if (!state.answersOrder) {
            state.answersOrder = $.map(tempAnswers, function (element, index) {
                return index;
            });
            shuffle(state.answersOrder);
        }

        var answers = $.map(tempAnswers, function (element, index) {
            return index;
        });
        for (var i = 0; i < answers.length; i++) {
            var index = state.answersOrder[i];
            if (index === null) {
                answers[i] = null;
            } else {
                answers[i] = tempAnswers[index];
            }
        }

        var labels = ['A: ', 'B: ', 'C: ', 'D: '];

        for (var i = 0; i < answers.length; i++) {
            var $tip = $('<div class="question-tip"></div>');
            var answer = answers[i];

            var headersOfAnswer = document.createElement('div');
            var $headersOfAnswer = $(headersOfAnswer);
            $headersOfAnswer.addClass("headers-of-answers");

            var divAnswers = document.createElement('div');
            var $divAnswers = $(divAnswers);
            $divAnswers.addClass('answers');

            var label = labels[i];
            $headersOfAnswer.text(label);
            $divAnswers.text(answer || '');
            if (answer === null) {
                $tip.addClass('removed');
                $tip.clickAction = function () {
                };
            } else {
                $tip.clickAction = getSelectItemAction(answer, $tip);
            }

            if (answer == q.CorrectAnswer) {
                if (showAnswer) {
                    $tip.addClass('correct-answer');
                } else if (state.selectedAnswer == answer) {
                    $tip.addClass('correct-answer');
                    if (state.currentQuestion < presenter.config.questions.length) {
                        $nextButton.addClass('active');
                    }
                }
            } else if (state.wasWrong && state.selectedAnswer == answer) {
                $tip.addClass('wrong');
            }
            $tips.append($tip);
            $tip.append($headersOfAnswer);
            $tip.append($divAnswers);
            presenter.activeElements.push($tip)

            if (presenter.config.centerVertically) {
                $headersOfAnswer.addClass('center-vertically');
                $divAnswers.addClass('center-vertically');
            }
        }

        $q.append($title);
        $q.append($tips);
        var $buttons = $('<div class="question-hint-buttons"></div>');
        addProgressBar($buttons);
        $q.append($buttons);
        presenter.hintWrapper = $('<div class="question-hint-wrapper"></div>');
        $q.append(presenter.hintWrapper);
        if (presenter.config.helpButtons) {
            var $fiftyFifty = $('<div class="fifty-fifty"></div>');
            var $hintButton = $('<div class="hint-button"></div>');
            $fiftyFifty.clickAction = fiftyFiftyAction;
            $hintButton.clickAction = hintAction;
            $buttons.append($fiftyFifty);
            $buttons.append($hintButton);
            presenter.activeElements.push($fiftyFifty);
            presenter.activeElements.push($hintButton);
            $q.addClass('with-hint');
            if (state.fiftyFiftyUsed) {
                $fiftyFifty.addClass('used');
            }
            if (state.hintUsed) {
                $hintButton.addClass('used');
                if (state.hintUsed == state.currentQuestion) {
                    showHint();
                }
            }
        } else {
            $q.addClass('without-hint');
        }
        presenter.activeElements.push($nextButton);
        presenter.nextButton = $nextButton;
        if (!presenter.config.nextAfterSelect) {
            $buttons.append($nextButton);
        }
        if (state.wasWrong) {
            gameLostMessage();
        } else if (haveWon()) {
            gameWonMessage();
        } else if (state.selectedAnswer) {
            bindEvents(presenter.nextButton);
        } else if (!showAnswer) {
            bindEvents();
        }
    };

    function haveWon() {
        var q = getCurrentQuestion();
        return state.selectedAnswer == q.CorrectAnswer && state.currentQuestion == presenter.config.questions.length;
    }

    function initializeLogic(view, model, preview) {
        setupDefaults();
        presenter.$view = $(view);
        try {
            presenter.setupConfig(model);
            presenter.showCurrentQuestion();
            presenter.config.questions.forEach(function () {
                state.score.push(0);
            });
        } catch (error) {
            var $error = $('<div class="quiz-error-layer"></div>');
            var text = "<strong>" + error.name + "</strong>: " + error.message;
            $error.html(text);
            presenter.$view.find('.question-wrapper').append($error);
            presenter.config = {};
        }

        if (!preview) {
            bindEvents();
        }
    };

    presenter.showCurrentQuestion = function AddonQuiz_showCurrentQuestion() {
        showQuestion(getCurrentQuestion(), false);
        renderMathJax();
    };

    function renderMathJax() {
        if (presenter.isLoaded) {
            reloadMathJax();
        }
    }

    function reloadMathJax() {
        window.MathJax.Callback.Queue().Push(function () {
            window.MathJax.Hub.Typeset(presenter.$view[0]);
        });
    }

    presenter.setPlayerController = function AddonQuiz_setPlayerController(controller) {
        playerController = controller;
    };

    presenter.setVisibility = function AddonQuiz_setVisibility(isVisible) {
        state.isVisible = isVisible;
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
    };

    presenter.hide = function AddonQuiz_hide() {
        presenter.setVisibility(false);
    };

    presenter.show = function AddonQuiz_show() {
        presenter.setVisibility(true);
    };

    presenter.run = function AddonQuiz_run(view, model) {
        eventBus = playerController.getEventBus();
        presenter.addonID = model.ID;
        initializeLogic(view, model, false);
        presenter.setVisibility(presenter.config.isVisible);

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);

        presenter.$view[0].addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });

        presenter.isLoaded = true;
    };

    presenter.createPreview = function AddonQuiz_createPreview(view, model) {

        var upgradedModel = presenter.upgradeModel(model);
        initializeLogic(view, upgradedModel, true);
    };

    presenter.getState = function AddonQuiz_getState() {
        if ("{}" === JSON.stringify(presenter.config)) {
            return "";
        }
        return JSON.stringify(state);
    };

    presenter.setState = function AddonQuiz_setState(gotState) {
        if (!gotState) {
            return;
        }
        state = JSON.parse(gotState);
        presenter.showCurrentQuestion();
        presenter.setVisibility(state.isVisible);
    };

    presenter.setShowErrorsMode = function AddonQuiz_setShowErrorsMode() {
        if (!presenter.config.isActivity || presenter.isErrorMode) {
            return;
        }

        presenter.isErrorMode = true;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        showErrorsMode();
    };

    presenter.setWorkMode = function AddonQuiz_setWorkMode() {
        if (!presenter.config.isActivity || !presenter.isErrorMode) {
            return;
        }

        presenter.isErrorMode = false;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        workMode();
    };

    function showErrorsMode() {
        presenter.disable();
    };

    function workMode() {
        presenter.enable();
    };

    presenter.reset = function AddonQuiz_reset() {
        presenter.setWorkMode();
        setupDefaults();
        presenter.showCurrentQuestion();
        bindEvents();
        presenter.setVisibility(presenter.config.isVisible);
    };

    presenter.getErrorCount = function AddonQuiz_getErrorCount() {
        if (!presenter.config.isActivity) return 0;
        return getErrorCount();
    };

    presenter.getMaxScore = function AddonQuiz_getMaxScore() {
        if (!presenter.config.isActivity) return 0;
        return getMaxScore();
    };

    presenter.getScore = function AddonQuiz_getScore() {
        if (!presenter.config.isActivity) return 0;
        return getScore();
    };

    function getErrorCount() {
        if (!presenter.config.testMode) {
            return state.wasWrong ? 1 : 0;
        } else {
            var errors = 0;
            state.score.forEach(function (e) {
                if (e == 0) {
                    errors = errors + 1;
                }
            });
            return errors;
        }
    }

    function getMaxScore() {
        return presenter.config.questions.length;
    }

    function getScore() {
        var score = 0;
        state.score.forEach(function (e) {
            if (e > 0) {
                score = score + e;
            }
        });
        return score;
    }

    presenter.executeCommand = function AddonQuiz_executeCommand(name, params) {
        if (presenter.isErrorMode) {
            return;
        }

        var commands = {
            'isAllOK': presenter.isAllOK,
            'isAttempted': presenter.isAttempted,
            'show': presenter.show,
            'hide': presenter.hide,
            'disable': presenter.disable,
            'enable': presenter.enable,
            'reset': presenter.reset
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.isAllOK = function AddonQuiz_isAllOK() {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.isAttempted = function AddonQuiz_isAttempted() {
        return (state.currentQuestion > 1) || state.wasWrong || (state.selectedAnswer !== null);
    };

    presenter.disable = function AddonQuiz_disable() {
        presenter.$view.find('.question-wrapper').addClass('disabled');
        unbindEvents();
    };

    presenter.enable = function AddonQuiz_enable() {
        presenter.$view.find('.question-wrapper').removeClass('disabled');
        bindEvents();
    };

    presenter.destroy = function () {
        presenter.$view[0].removeEventListener('DOMNodeRemoved', presenter.destroy);
        unbindEvents();
        presenter.$view.off();
        presenter.eventBus = null;
        presenter.view = null;
    };

    presenter.upgradeModel = function (model) {
        return presenter.upgradeAcceptWrongAnswers(model);
    };

    presenter.upgradeAcceptWrongAnswers = function (model) {
        if (!model['GameSummaryMessage']) {
            model['GameSummaryMessage'] = 'Score';
        }
        if (!model['CorrectGameMessage']) {
            model['CorrectGameMessage'] = 'Correct';
        }
        if (!model['WrongGameMessage']) {
            model['WrongGameMessage'] = 'Wrong';
        }
        return model;
    };

    presenter.onEventReceived = function AddonQuiz_onEventReceived(eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.showAnswers = function AddonQuiz_showAnswers() {
        if (!presenter.config.isActivity) {
            return;
        }
        presenter.isShowAnswersActive = true;
        showAnswers();
    };

    presenter.hideAnswers = function AddonQuiz_hideAnswers() {
        if (!presenter.config.isActivity) {
            return;
        }
        presenter.isShowAnswersActive = false;
        hideAnswers();
    };

    function showAnswers() {
        showQuestion(getCurrentQuestion(), true);
        reloadMathJax();
    }

    function hideAnswers() {
        presenter.showCurrentQuestion();
    }

    return presenter;
}