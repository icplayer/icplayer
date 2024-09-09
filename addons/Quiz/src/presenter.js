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

    var CSS_CLASSES = {
        QUESTION_TITLE: 'question-title',
        QUESTION_TIP: 'question-tip',
        FIFTY_FIFTY: 'fifty-fifty',
        HINT_BUTTON: 'hint-button',
        NEXT_QUESTION_BUTTON: 'next-question-button',
        QUESTION_HINT_WRAPPER: 'question-hint-wrapper',
        QUESTION_HINT: 'question-hint',
        GAME_WON_MESSAGE: 'game-won-message',
        GAME_LOST_MESSAGE: 'game-lost-message',
        ACTIVE: 'active',
        CORRECT: 'correct',
        WRONG: 'wrong',
        REMOVED: 'removed',
        OPTION: 'option',
    };

    var DEFAULT_TTS_PHRASES = {
        Question: 'Question',
        Answer: 'Answer',
        FiftyFiftyButton: 'Fifty-Fifty button',
        FiftyFiftyButtonWhenNotEnoughAnswers: 'Fifty-Fifty button is inactive because there are less than 4 answers',
        HintButton: 'Hint button',
        CommentField: 'Comment field',
        Hint: 'Hint',
        Summary: 'Summary',
        Selected: 'Selected',
        Correct: 'Correct',
        Wrong: 'Wrong',
        Inactive: 'Inactive',
        OutOf: 'Out of',
    };

    function ConfigurationError(label) {
        return {
            name: 'ConfigurationError',
            message: ERRORS[label] || label
        }
    }

    presenter.activeElements = [];
    presenter.isLoaded = false;
    presenter.isWCAGOn = false;
    presenter.keyboardControllerObject = null;

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

    function validateQuestions(questions, helpButtons, helpButtonsMode) {
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
            if (helpButtons && ModelValidationUtils.isHtmlEmpty(q.Hint) && helpButtonsMode !== '50/50') {
                throw ConfigurationError('MISSING_HINT');
            }
        }
        return questions;
    }

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            Question: DEFAULT_TTS_PHRASES.Question,
            Answer: DEFAULT_TTS_PHRASES.Answer,
            FiftyFiftyButton: DEFAULT_TTS_PHRASES.FiftyFiftyButton,
            FiftyFiftyButtonWhenNotEnoughAnswers: DEFAULT_TTS_PHRASES.FiftyFiftyButtonWhenNotEnoughAnswers,
            HintButton: DEFAULT_TTS_PHRASES.HintButton,
            CommentField: DEFAULT_TTS_PHRASES.CommentField,
            Hint: DEFAULT_TTS_PHRASES.Hint,
            Summary: DEFAULT_TTS_PHRASES.Summary,
            Selected: DEFAULT_TTS_PHRASES.Selected,
            Correct: DEFAULT_TTS_PHRASES.Correct,
            Wrong: DEFAULT_TTS_PHRASES.Wrong,
            Inactive: DEFAULT_TTS_PHRASES.Inactive,
            OutOf: DEFAULT_TTS_PHRASES.OutOf,
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            Question: getSpeechTextProperty(
                speechTexts.Question.Question,
                presenter.speechTexts.Question),
            Answer: getSpeechTextProperty(
                speechTexts.Answer.Answer,
                presenter.speechTexts.Answer),
            FiftyFiftyButton: getSpeechTextProperty(
                speechTexts.FiftyFiftyButton.FiftyFiftyButton,
                presenter.speechTexts.FiftyFiftyButton),
            FiftyFiftyButtonWhenNotEnoughAnswers: getSpeechTextProperty(
                speechTexts.FiftyFiftyButtonWhenNotEnoughAnswers.FiftyFiftyButtonWhenNotEnoughAnswers,
                presenter.speechTexts.FiftyFiftyButtonWhenNotEnoughAnswers),
            HintButton: getSpeechTextProperty(
                speechTexts.HintButton.HintButton,
                presenter.speechTexts.HintButton),
            CommentField: getSpeechTextProperty(
                speechTexts.CommentField.CommentField,
                presenter.speechTexts.CommentField),
            Hint: getSpeechTextProperty(
                speechTexts.Hint.Hint,
                presenter.speechTexts.Hint),
            Summary: getSpeechTextProperty(
                speechTexts.Summary.Summary,
                presenter.speechTexts.Summary),
            Selected: getSpeechTextProperty(
                speechTexts.Selected.Selected,
                presenter.speechTexts.Selected),
            Correct: getSpeechTextProperty(
                speechTexts.Correct.Correct,
                presenter.speechTexts.Correct),
            Wrong: getSpeechTextProperty(
                speechTexts.Wrong.Wrong,
                presenter.speechTexts.Wrong),
            Inactive: getSpeechTextProperty(
                speechTexts.Inactive.Inactive,
                presenter.speechTexts.Inactive),
            OutOf: getSpeechTextProperty(
                speechTexts.OutOf.OutOf,
                presenter.speechTexts.OutOf)
        };
    };

    presenter.setupConfig = function AddonQuiz_setupConfig(model) {
        var helpButtons = ModelValidationUtils.validateBoolean(model['ShowHelpButtons']);
        presenter.setSpeechTexts(model['speechTexts']);
        presenter.config = {
            visibility: ModelValidationUtils.validateBoolean(model['Is Visible']),
            questions: validateQuestions(model['Questions'], helpButtons, model["HelpButtonsMode"]),
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
            showSummary: ModelValidationUtils.validateBoolean(model['ShowSummary']),
            langTag: model["langAttribute"],
            helpButtonsMode: model["HelpButtonsMode"]
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
        var message = $(`<div class="${CSS_CLASSES.GAME_WON_MESSAGE}"></div>`);
        if(presenter.config.showSummary) {
            message.html(window.xssUtils.sanitize(
                parseAltText(presenter.config.gameWonMessage) +
                '<div>' + parseAltText(presenter.config.gameSummaryMessage) +
                '<div>' + parseAltText(presenter.config.correctGameMessage) + ': ' + getScore() +
                '</div><div>' + parseAltText(presenter.config.wrongGameMessage) + ': ' + (presenter.config.questions.length - getScore()) +
                '</div>' + '</div>'));
        } else {
            message.html(window.xssUtils.sanitize(parseAltText(presenter.config.gameWonMessage)));
        }
        wrapper.append(message);
        showInHintArea(wrapper);
    };

    function gameLostMessage() {
        var wrapper = $('<div class="game-lost-message-wrapper"></div>');
        var message = $(`<div class="${CSS_CLASSES.GAME_LOST_MESSAGE}"></div>`);
        if(presenter.config.showSummary) {
            message.html(window.xssUtils.sanitize(
                parseAltText(presenter.config.gameLostMessage) +
                '<div>' + parseAltText(presenter.config.gameSummaryMessage) +
                '<div>' + parseAltText(presenter.config.correctGameMessage) + ': ' + getScore() +
                '</div><div>' + parseAltText(presenter.config.wrongGameMessage) + ': ' + (presenter.config.questions.length - getScore()) +
                '</div>' + '</div>'));
        }else{
            message.html(window.xssUtils.sanitize(parseAltText(presenter.config.gameLostMessage)));
        }
        wrapper.append(message);
        showInHintArea(wrapper);
    };

    function parseAltText(text) {
        return presenter.preview ? window.TTSUtils.parsePreviewAltText(text) : presenter.textParser.parse(text);
    }

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
                    $this.addClass(CSS_CLASSES.CORRECT);
                    eventBus.sendEvent('ValueChanged', eventData);
                    if (isLastQuestion()) {
                        gameWonMessage();
                        eventBus.sendEvent('ValueChanged', presenter.createAllOKEventData());
                        unbindEvents();
                    } else {
                        presenter.nextButton.addClass(CSS_CLASSES.ACTIVE);
                        unbindEvents(presenter.nextButton);
                        if (presenter.config.nextAfterSelect 
                            && !presenter.isWCAGOn) {
                            unbindEvents();
                            setTimeout(function () {
                                nextAfterSelectCallback();
                            }, 500);
                        }
                    }
                } else {
                    state.score[state.currentQuestion - 1] = 0;
                    $this.addClass(CSS_CLASSES.WRONG);
                    eventData['score'] = '0';
                    eventBus.sendEvent('ValueChanged', eventData);
                    gameLostMessage();
                    state.wasWrong = true;
                    unbindEvents();
                }
            } else {
                $this.addClass(CSS_CLASSES.OPTION);

                if (isCorrect) {
                    state.score[state.currentQuestion - 1] = 1;
                } else {
                    state.score[state.currentQuestion - 1] = 0;
                    eventData['score'] = '0';
                }
                eventBus.sendEvent('ValueChanged', eventData);

                if (isLastQuestion()) {
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
                    presenter.nextButton.addClass(CSS_CLASSES.ACTIVE);
                    unbindEvents(presenter.nextButton);
                    if (presenter.config.nextAfterSelect 
                        && !presenter.isWCAGOn) {
                        unbindEvents();
                        setTimeout(function () {
                            nextAfterSelectCallback();
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

    function isLastQuestion() {
        return state.currentQuestion === presenter.config.questions.length;
    }

    function nextAfterSelectCallback() {
        nextButtonAction();
        bindEvents();
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
        var $hint = $(`<div class="${CSS_CLASSES.QUESTION_HINT}"></div>`);
        $hint.html(window.xssUtils.sanitize(parseAltText(getCurrentQuestion().Hint)));
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
            if (presenter.keyboardControllerObject.keyboardNavigationActive) {
                presenter.keyboardControllerObject.markCurrentElement(0);
                presenter.keyboardControllerObject.readCurrentElement();
            }
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
        var $title = $(`<div class="${CSS_CLASSES.QUESTION_TITLE}"></div>`);
        var $tips = $('<div class="question-tips"></div>');
        var $nextButton = $(`<div class="${CSS_CLASSES.NEXT_QUESTION_BUTTON}"></div>`);
        $nextButton.html(window.xssUtils.sanitize(parseAltText(presenter.config.nextLabel)));
        $nextButton.clickAction = nextButtonAction;

        cleanWorkspace();

        $title.html(window.xssUtils.sanitize(parseAltText(q.Question)));

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
            var $tip = $(`<div class="${CSS_CLASSES.QUESTION_TIP}"></div>`);
            var answer = answers[i];

            var headersOfAnswer = document.createElement('div');
            var $headersOfAnswer = $(headersOfAnswer);
            $headersOfAnswer.addClass("headers-of-answers");

            var divAnswers = document.createElement('div');
            var $divAnswers = $(divAnswers);
            $divAnswers.addClass('answers');

            var label = labels[i];
            $headersOfAnswer.text(label);
            $divAnswers.html(window.xssUtils.sanitize(parseAltText(answer || '')));
            if (answer === null) {
                $tip.addClass(CSS_CLASSES.REMOVED);
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
                        $nextButton.addClass(CSS_CLASSES.ACTIVE);
                    }
                }
            } else if (state.wasWrong && state.selectedAnswer == answer) {
                $tip.addClass(CSS_CLASSES.WRONG);
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
        presenter.hintWrapper = $(`<div class="${CSS_CLASSES.QUESTION_HINT_WRAPPER}"></div>`);
        $q.append(presenter.hintWrapper);

        presenter.displayHint($q, $buttons);

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
        if (presenter.keyboardControllerObject) {
            presenter.reloadKeyboardController();
        }
    }

    presenter.displayHint = function ($q, $buttons) {
        if (presenter.config.helpButtons) {
            var $fiftyFifty = $(`<div class="${CSS_CLASSES.FIFTY_FIFTY}"></div>`);
            var $hintButton = $(`<div class="${CSS_CLASSES.HINT_BUTTON}"></div>`);
            $fiftyFifty.clickAction = fiftyFiftyAction;
            $hintButton.clickAction = hintAction;

            if (presenter.config.helpButtonsMode === 'Hint') {
                $buttons.append($hintButton);
                presenter.activeElements.push($hintButton);
            } else if (presenter.config.helpButtonsMode === '50/50') {
                $buttons.append($fiftyFifty);
                presenter.activeElements.push($fiftyFifty);
            } else {
                $buttons.append($fiftyFifty);
                $buttons.append($hintButton);
                presenter.activeElements.push($fiftyFifty);
                presenter.activeElements.push($hintButton);
            }

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
    }

    function haveWon() {
        var q = getCurrentQuestion();
        return state.selectedAnswer == q.CorrectAnswer && state.currentQuestion == presenter.config.questions.length;
    }

    function initializeLogic(view, model, preview) {
        setupDefaults();
        presenter.$view = $(view);
        presenter.preview = preview;
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
        presenter.buildKeyboardController();
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

        presenter.textParser = new TextParserProxy(controller.getTextParser());
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
        presenter.view = view
        var upgradedModel = presenter.upgradeModel(model);
        initializeLogic(view, upgradedModel, false);
        presenter.setVisibility(presenter.config.isVisible);

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);

        MutationObserverService.createDestroyObserver(presenter.addonID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();

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

    presenter.destroy = function (event) {
        if (event.target !== presenter.view) { return; }

        unbindEvents();
        presenter.$view.off();
        presenter.eventBus = null;
        presenter.view = null;
    };

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradeAcceptWrongAnswers(model);
        upgradedModel = presenter.addLangTag(upgradedModel);
        upgradedModel = presenter.addSpeechTexts(upgradedModel);
        upgradedModel = presenter.addHelpButtonsMode(upgradedModel);

        return upgradedModel;
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

    presenter.addLangTag = function AddonTable_upgradeLangTag(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (upgradedModel['langAttribute'] === undefined) {
            upgradedModel['langAttribute'] =  '';
        }

        return upgradedModel;
    };

    presenter.addHelpButtonsMode = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel.hasOwnProperty('HelpButtonsMode')) {
            upgradedModel['HelpButtonsMode'] =  'Both';
        }

        return upgradedModel;
    }

    presenter.addSpeechTexts = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);
        if (!model['speechTexts']) {
            upgradedModel['speechTexts'] = {
                Question: {Question: ''},
                Answer: {Answer: ''},
                FiftyFiftyButton: {FiftyFiftyButton: ''},
                FiftyFiftyButtonWhenNotEnoughAnswers: {FiftyFiftyButtonWhenNotEnoughAnswers: ''},
                HintButton: {HintButton: ''},
                CommentField: {CommentField: ''},
                Hint: {Hint: ''},
                Summary: {Summary: ''},
                Selected: {Selected: ''},
                Correct: {Correct: ''},
                Wrong: {Wrong: ''},
                Inactive: {Inactive: ''},
                OutOf: {OutOf: ''},
            }
        }
        return upgradedModel;
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
        if (!presenter.config.isActivity || !presenter.isShowAnswersActive) {
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

    presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    presenter.getTextToSpeechOrNull = function AddonQuiz_getTextToSpeechOrNull(playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.speak = function (data) {
        var tts = presenter.getTextToSpeechOrNull(playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.speakWithCallback = function (data, callbackFunction) {
        var tts = presenter.getTextToSpeechOrNull(playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speakWithCallback(data, callbackFunction);
        }
    }

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject
            = new QuizKeyboardController(
                presenter.getElementsForKeyboardNavigation(), 1);
    };

    presenter.reloadKeyboardController = function () {
        presenter.keyboardControllerObject.reload(
            presenter.getElementsForKeyboardNavigation(), 1);
    };

    presenter.getElementsForKeyboardNavigation = function () {
        return presenter.$view.find(`
            .${CSS_CLASSES.QUESTION_TITLE},
            .${CSS_CLASSES.QUESTION_TIP},
            .${CSS_CLASSES.FIFTY_FIFTY},
            .${CSS_CLASSES.HINT_BUTTON},
            .${CSS_CLASSES.NEXT_QUESTION_BUTTON},
            .${CSS_CLASSES.QUESTION_HINT_WRAPPER}
        `);
    };

    presenter.getQuestionTipsElementsForKeyboardNavigation = function () {
        return presenter.$view.find(`.${CSS_CLASSES.QUESTION_TIP}`);
    };

    presenter.getCommendFieldElementForKeyboardNavigation = function () {
        return presenter.$view.find(`.${CSS_CLASSES.QUESTION_HINT_WRAPPER}`);
    };

    presenter.getGameMessageElementForKeyboardNavigationFromElement = function ($element) {
        return $element.find(`.${CSS_CLASSES.GAME_LOST_MESSAGE}, .${CSS_CLASSES.GAME_WON_MESSAGE}`);
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
    };

    function QuizKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    QuizKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    QuizKeyboardController.prototype.constructor = QuizKeyboardController;

    QuizKeyboardController.prototype.exitWCAGMode = function () {
        KeyboardController.prototype.exitWCAGMode.call(this);
        presenter.setWCAGStatus(false);
    };

    QuizKeyboardController.prototype.reload = function (elements, columnsCount) {
        this.isSelectEnabled = true;
        this.keyboardNavigationElements = elements;
        this.columnsCount = columnsCount;
        this.keyboardNavigationElementsLen = elements.length;
        if (this.keyboardNavigationActive) {
            this.refreshMarkOnCurrentElement();
            this.enter();
        }
    };

    QuizKeyboardController.prototype.switchElement = function (move) {
        KeyboardController.prototype.switchElement.call(this, move);
        this.readCurrentElement();
    };

    QuizKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return $(element);
    };

    QuizKeyboardController.prototype.readCurrentElement = function () {
        this.readElement(this.keyboardNavigationCurrentElement);
    };

    QuizKeyboardController.prototype.refreshMarkOnCurrentElement = function () {
        this.markCurrentElement(this.keyboardNavigationCurrentElementIndex);
    };

    QuizKeyboardController.prototype.readElement = function (element) {
        var $element = this.getTarget(element, false);

        if ($element.hasClass(CSS_CLASSES.QUESTION_TITLE))
            presenter.speak(getQuestionTitleTextVoiceObject($element))
        else if ($element.hasClass(CSS_CLASSES.QUESTION_TIP))
            presenter.speak(getQuestionTipTextVoiceObject($element))
        else if ($element.hasClass(CSS_CLASSES.FIFTY_FIFTY))
            presenter.speak(getFiftyFiftyButtonTextVoiceObject())
        else if ($element.hasClass(CSS_CLASSES.HINT_BUTTON))
            presenter.speak(getHintButtonTextVoiceObject())
        else if ($element.hasClass(CSS_CLASSES.NEXT_QUESTION_BUTTON))
            presenter.speak(getNextQuestionTextVoiceObject($element))
        else if ($element.hasClass(CSS_CLASSES.QUESTION_HINT_WRAPPER))
            presenter.speak(getCommentFieldTextVoiceObject($element))
    };

    function getQuestionTitleTextVoiceObject($element) {
        var voicesArray = [];

        const prefix = presenter.speechTexts.Question;

        var language = document.documentElement.lang;

        const currentQuestionAsText = window.TTSUtils.numberToOrdinalNumber(state.currentQuestion, language, window.TTSUtils.GENDER.NEUTER);
        const questionsLengthAsText = window.TTSUtils.numberToOrdinalNumber(presenter.config.questions.length, language, window.TTSUtils.GENDER.FEMININE);
        const questionInfo = `${currentQuestionAsText} ${presenter.speechTexts.OutOf} ${questionsLengthAsText}`;
        const texts = [prefix, questionInfo, ];
        pushMessagesToTextVoiceObject(voicesArray, texts);
        
        return createAndConcatElementWithTextVoiceObject(voicesArray, $element);
    }

    function getQuestionTipTextVoiceObject($element) {
        var voicesArray = [];

        const prefix = presenter.speechTexts.Answer;
        pushMessageToTextVoiceObject(voicesArray, prefix);


        voicesArray = createAndConcatElementsWithTextVoiceObject(voicesArray, $element.children());
        if ($element.hasClass(CSS_CLASSES.REMOVED))
            return updateQuestionTipTextVoiceObjectWithRemoved(voicesArray);
        else if (isQuestionTipSelected($element))
            return updateQuestionTipTextVoiceObjectWithSelected(voicesArray, $element);
        return voicesArray;
    }

    function isQuestionTipSelected($questionTip) {
        return ($questionTip.hasClass(CSS_CLASSES.CORRECT)
                || $questionTip.hasClass(CSS_CLASSES.WRONG)
                || $questionTip.hasClass(CSS_CLASSES.OPTION));
    }

    function updateQuestionTipTextVoiceObjectWithRemoved(textVoiceObject) {
        var voicesArray = [];
        const status = presenter.speechTexts.Inactive;
        pushMessageToTextVoiceObject(voicesArray, status);
        return textVoiceObject.concat(voicesArray);
    }

    function updateQuestionTipTextVoiceObjectWithSelected(textVoiceObject, $element) {
        var voicesArray = [];
        var texts = [presenter.speechTexts.Selected, ]
        if ($element.hasClass(CSS_CLASSES.CORRECT)) 
            texts.push(presenter.speechTexts.Correct);
        else if ($element.hasClass(CSS_CLASSES.WRONG))
            texts.push(presenter.speechTexts.Wrong);
        pushMessagesToTextVoiceObject(voicesArray, texts);
        return textVoiceObject.concat(voicesArray);
    }

    function getFiftyFiftyButtonTextVoiceObject() {
        var voicesArray = [];
        var texts = [presenter.speechTexts.FiftyFiftyButton, ];

        var isNotEnoughAnswers = isLessThenFourAnswers();

        if (state.fiftyFiftyUsed || isNotEnoughAnswers || isQuestionAnswered()) {
            texts.push(presenter.speechTexts.Inactive);
            
            if (isNotEnoughAnswers) {
                texts.push(presenter.speechTexts.FiftyFiftyButtonWhenNotEnoughAnswers);
            }
        }
        pushMessagesToTextVoiceObject(voicesArray, texts);
        return voicesArray;
    }

    function isLessThenFourAnswers() {
        return state.answersOrder && state.answersOrder.length < 4;
    }

    function getHintButtonTextVoiceObject() {
        var voicesArray = [];
        var texts = [presenter.speechTexts.HintButton, ];
        if (state.hintUsed || isQuestionAnswered()) {
            texts.push(presenter.speechTexts.Inactive);
        }
        pushMessagesToTextVoiceObject(voicesArray, texts);
        return voicesArray;
    }

    function getNextQuestionTextVoiceObject($element) {
        var voicesArray = [];

        const text = presenter.config.nextLabel;
        pushMessageToTextVoiceObject(voicesArray, text, true);

        if (!$element.hasClass(CSS_CLASSES.ACTIVE))
            pushMessageToTextVoiceObject(voicesArray, presenter.speechTexts.Inactive);

        return voicesArray;
    }
    
    function getCommentFieldTextVoiceObject($element) {
        var voicesArray = [];

        const commentField = presenter.speechTexts.CommentField;
        pushMessageToTextVoiceObject(voicesArray, commentField);

        if ($element.children().length === 0)
            return updateCommentFieldTextVoiceObjectWithInactive(voicesArray);

        const $gameMessage = $(presenter.getGameMessageElementForKeyboardNavigationFromElement($element));
        if ($gameMessage.length === 0)
            return updateCommentFieldTextVoiceObjectWithHint(voicesArray, $element);
        return updateCommentFieldTextVoiceObjectWithSummary(voicesArray, $gameMessage);
    }

    function updateCommentFieldTextVoiceObjectWithInactive(textVoiceObject) {
        var voicesArray = [];
        const inactiveMessage = presenter.speechTexts.Inactive;
        pushMessageToTextVoiceObject(voicesArray, inactiveMessage);
        return textVoiceObject.concat(voicesArray);
    }

    function updateCommentFieldTextVoiceObjectWithSummary(
            textVoiceObject, $gameMessageElement) {
        var voicesArray = [];
        const summaryMessage = presenter.speechTexts.Summary;
        pushMessageToTextVoiceObject(voicesArray, summaryMessage);

        const $gameMessageChildren = $gameMessageElement.children();
        
        var $gameMessageText = null;
        var gameSummaryChildID = 1;
        if ($gameMessageChildren.length === 2) {
            $gameMessageText = $($gameMessageChildren.get(0));
        } else {
            $gameMessageText = getTextNodeFromElement($gameMessageElement);
            gameSummaryChildID = 0;
        }
        voicesArray = createAndConcatElementWithTextVoiceObject(
            voicesArray, $gameMessageText);
        const $gameSummary = $($gameMessageChildren.get(gameSummaryChildID));
        
        const $gameSummaryText = getTextNodeFromElement($gameSummary);
        voicesArray = createAndConcatElementWithTextVoiceObject(
            voicesArray, $gameSummaryText);

        voicesArray = createAndConcatElementsWithTextVoiceObject(
            voicesArray, $gameSummary.children());

        return textVoiceObject.concat(voicesArray);
    }

    function updateCommentFieldTextVoiceObjectWithHint(
            textVoiceObject, $commendFieldElement) {
        var voicesArray = [];

        const hintMessage = presenter.speechTexts.Hint;
        pushMessageToTextVoiceObject(voicesArray, hintMessage);

        voicesArray = createAndConcatElementWithTextVoiceObject(
            voicesArray, $commendFieldElement);
        return textVoiceObject.concat(voicesArray);
    }

    QuizKeyboardController.prototype.enter = function (event) {
        KeyboardController.prototype.enter.call(this, event);
        this.readCurrentElement();
    };

    QuizKeyboardController.prototype.select = function (event) {
        var currentElement = this.keyboardNavigationCurrentElement;
        var $element = this.getTarget(currentElement, false);
        
        if ($element.hasClass(CSS_CLASSES.QUESTION_TIP))
            selectQuestionTip(event, $element);
        else if ($element.hasClass(CSS_CLASSES.FIFTY_FIFTY))
            selectFiftyFiftyButton(event);
        else if ($element.hasClass(CSS_CLASSES.HINT_BUTTON))
            selectHintButton(event);
        else KeyboardController.prototype.select.call(this, event);
    };

    function selectQuestionTip(event, $element) {
        const isQuestionAnsweredBefore = isQuestionAnswered(); 
        KeyboardController.prototype.select.call(presenter.keyboardControllerObject, event);
        const isQuestionAnsweredAfter = isQuestionAnswered();

        if (isQuestionAnsweredBefore !== isQuestionAnsweredAfter) {
            var voicesArray = updateQuestionTipTextVoiceObjectWithSelected([], $element);
            const $gameMessage = presenter.getGameMessageElementForKeyboardNavigationFromElement(presenter.$view);
            if ($gameMessage.length !== 0) {
                voicesArray = updateCommentFieldTextVoiceObjectWithSummary(voicesArray, $gameMessage);
            }
            
            if (!isLastQuestion() 
                && presenter.config.nextAfterSelect 
                && presenter.isWCAGOn) {
                presenter.speakWithCallback(
                    voicesArray, nextAfterSelectCallback);
            } else {
                presenter.speak(voicesArray);
            }
        }
    }

    function isQuestionAnswered() {
        return state.selectedAnswer !== null;
    }

    function selectFiftyFiftyButton(event) {
        const fiftyFiftyUsedBefore = state.fiftyFiftyUsed;
        KeyboardController.prototype.select.call(presenter.keyboardControllerObject, event);
        const fiftyFiftyUsedAfter = state.fiftyFiftyUsed;

        if (fiftyFiftyUsedBefore !== fiftyFiftyUsedAfter) {
            var voicesArray = [];
            const selectedMessage = presenter.speechTexts.Selected;
            pushMessageToTextVoiceObject(voicesArray, selectedMessage);
            const $questionTips = $(presenter.getQuestionTipsElementsForKeyboardNavigation());
            for (var i = 0; i < state.answersOrder.length; i++) {
                if (state.answersOrder[i] === null) {
                    const $questionTip = $($questionTips.get(i));
                    voicesArray = voicesArray.concat(getQuestionTipTextVoiceObject($questionTip));
                }
            }
            presenter.speak(voicesArray);
            presenter.keyboardControllerObject.refreshMarkOnCurrentElement();
        }
    }

    function selectHintButton(event) {
        const hintUsedBefore = state.hintUsed;
        KeyboardController.prototype.select.call(presenter.keyboardControllerObject, event);
        const hintUsedAfter = state.hintUsed;

        if (hintUsedBefore !== hintUsedAfter) {
            var voicesArray = [];
            const selectedMessage = presenter.speechTexts.Selected;
            pushMessageToTextVoiceObject(voicesArray, selectedMessage);

            const $commendFieldElement = $(presenter.getCommendFieldElementForKeyboardNavigation());
            voicesArray = updateCommentFieldTextVoiceObjectWithHint(voicesArray, $commendFieldElement);
            presenter.speak(voicesArray);
        }
    }

    function getTextNodeFromElement($element) {
        return $element.contents().filter(
            function () {
                return this.nodeType === 3;
            }
        )
    }

    function createAndConcatElementsWithTextVoiceObject(textVoiceObject, $elements, usePresenterLangTag = true) {
        $elements.each( function() { 
            textVoiceObject = createAndConcatElementWithTextVoiceObject(textVoiceObject, $(this), usePresenterLangTag);
        });
        return textVoiceObject;
    }

    function createAndConcatElementWithTextVoiceObject(textVoiceObject, $element, usePresenterLangTag = true) {
        var elementTextVoiceArray = null;
        if (usePresenterLangTag)
            elementTextVoiceArray = window.TTSUtils.getTextVoiceArrayFromElement($element, presenter.config.langTag)
        else
            elementTextVoiceArray = window.TTSUtils.getTextVoiceArrayFromElement($element)
        return textVoiceObject.concat(elementTextVoiceArray);
    }

    function pushMessagesToTextVoiceObject(textVoiceObject, messages, usePresenterLangTag = false) {
        for (var i = 0; i < messages.length; i++) {
            pushMessageToTextVoiceObject(textVoiceObject, messages[i], usePresenterLangTag);
        }
    }
    
    function pushMessageToTextVoiceObject(textVoiceObject, message, usePresenterLangTag = false) {
        if (usePresenterLangTag)
            textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message, presenter.config.langTag));
        else
            textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message));
    }

    return presenter;
}
