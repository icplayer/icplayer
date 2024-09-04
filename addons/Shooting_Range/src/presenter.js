function AddonShooting_Range_create() {
    var presenter = function (){};

    presenter.state = {
        eventBus: null,
        playerController: null,
        view: null,
        $view: null,
        $questionDiv: null,
        $levelDiv: null,
        $answersWrapper: null,
        $playButton: null,
        levels: [],
        actualLevel: 0,
        destoyed: false,
        errorCount: 0,
        wholeErrorCount: 0,
        score: 0,
        isVisible: false,
        isShowingAnswers: false,
        showingErrors: false,
        isStarted: false,
        resultsList: []
    };

    presenter.configuration = {
        isValid: false,
        addonID: null,
        definitions: [{
            isValid: true,
            gameMode: 0,
            definition: "",
            answers: [""],
            correctAnswers: [0]
        }],
        gameMode: 0,
        initialTimeForAnswer: 0,
        timeForLastAnswer: 0
    };

    presenter.ERROR_CODES = {
        "IT01": "Initial timer for answer must be positive float",
        "LT01": "Time for last answer must be positive float",
        "WM01": "All or non definition in definition list must be provided",
        "EA01": "Answer can't be empty",
        "WA01": "Answer range must be in number-number format",
        "WA02": "First value in answer range must be integer in range <1;3>",
        "WA03": "Second value in answer range must be integer in range <1;3>",
        "WA04": "Correct answer must be integer in range <1;3>"
    };

    presenter.GAME_MODE = {
        UNDEFINED: -1,
        QUESTIONS: 0,
        SPEED_ATTACK: 1
    };

    presenter.originalDisplay = "block";

    presenter.setPlayerController = function (controller) {
        presenter.state.playerController = controller;
        presenter.state.eventBus = presenter.state.playerController.getEventBus();
        presenter.state.eventBus.addEventListener('ShowAnswers', this);
        presenter.state.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.run = function (view, model) {
        presenter.initialize(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.initialize = function  (view, model, isPreview)  {
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.state.$view = $(view);
        presenter.state.view = view;
        presenter.state.$questionDiv = $(view).find(".addon-Shooting_Range-wrapper-question");
        presenter.state.$levelDiv = $(view).find(".addon-Shooting_Range-wrapper-level");
        presenter.state.$answersWrapper = $(view).find(".addon-Shooting_Range-wrapper-answers-wrapper");
        presenter.state.$playButton = $(view).find(".addon-Shooting_Range-play-button-wrapper");

        if (!isPreview) {
           presenter.initializeGame();
           presenter.actualizeAnswersWrapperHeight();
           presenter.connectHandlers();
        }

        var display = presenter.state.$view.css('display');
        if (display != null && display.length > 0) {
            presenter.originalDisplay = display;
        }

        presenter.setVisibility(presenter.configuration.isVisibleByDefault || isPreview);

        MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.state.view);
        MutationObserverService.setObserver();
    };

    presenter.connectHandlers = function () {
        presenter.state.$playButton.click(function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (presenter.state.isShowingAnswers || presenter.state.showingErrors) {
                return;
            }

            presenter.startGame();
            presenter.state.$playButton.hide();
        });
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.isErrorCheckingMode) {
            return;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'isAllOK': presenter.isAllOK,
            'showAnswers' : presenter.showAnswers,
            'hideAnswers' : presenter.hideAnswers,
            'getResultsList': presenter.getResultsList,
            'restartGame': presenter.restartGame
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getResultsList = function () {
        return presenter.state.resultsList;
    };

    presenter.restartGame = function () {
        var levelsLength = presenter.state.levels.length;

        for (var i = 0; i < levelsLength; i++) {
            presenter.state.levels[i].destroy();
        }

        presenter.state.score = 0;
        presenter.state.errorCount = 0;
        presenter.state.wholeErrorCount = 0;
        presenter.state.$playButton.show();
        presenter.state.actualLevel = 0;
        presenter.actualizeAnswersWrapperHeight();
        presenter.state.isStarted = false;
        presenter.state.$questionDiv.html("&nbsp;");
        presenter.state.$levelDiv.html("&nbsp;");

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
        presenter.state.isShowingAnswers = true;

        if (!presenter.state.isStarted || presenter.state.$playButton.is(":visible")) {
            return;
        }

        if (presenter.state.showingErrors) {
            presenter.setWorkMode();
        }

        if (presenter.state.actualLevel < presenter.state.levels.length) {
            presenter.getActualLevel().showAnswers();
            presenter.getActualLevel().pause();
        }
    };

    presenter.hideAnswers = function () {
        presenter.state.isShowingAnswers = false;

        if (!presenter.state.isStarted || presenter.state.$playButton.is(":visible")) {
            return;
        }

        if (presenter.state.actualLevel < presenter.state.levels.length) {
            presenter.getActualLevel().hideAnswers();
            presenter.getActualLevel().resume();
        }
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore();
    };

    presenter.actualizeAnswersWrapperHeight = function () {
        presenter.state.$answersWrapper.css({
            'top': presenter.state.$questionDiv.height() + presenter.state.$levelDiv.height(),
            'height': presenter.state.$view.height() - presenter.state.$questionDiv.height()
        });
    };

    presenter.initializeGame = function () {
        var initialTimerForAnswer = presenter.configuration.initialTimeForAnswer;
        var timeForLastAnswer = presenter.configuration.timeForLastAnswer;
        if (timeForLastAnswer == -1) {
            timeForLastAnswer = initialTimerForAnswer;
        }

        var diffOnLevel = initialTimerForAnswer;
        if (presenter.configuration.definitions.length > 1) {
            diffOnLevel = (timeForLastAnswer - initialTimerForAnswer) / (presenter.configuration.definitions.length - 1);
        }


        for (var i = 0; i < presenter.configuration.definitions.length; i++) {
            var configuration = {
                definition: presenter.configuration.definitions[i],
                timeForAnswer: initialTimerForAnswer + (diffOnLevel * i),
                questionNumber: i,
                numberOfLevel: (i + 1) + "/" + presenter.configuration.definitions.length,
                $levelDiv: presenter.state.$levelDiv,
                $questionDiv: presenter.state.$questionDiv,
                $answersWrapper: presenter.state.$answersWrapper,
                onCorrectAnswerCallback: presenter.onCorrectAnswerCallback.bind(this),
                onWrongAnswerCallback: presenter.onWrongAnswerCallback.bind(this),
                onDroppedCorrectAnswerCallback: presenter.onDroppedCorrectAnswerCallback.bind(this),
                onEndLevelCallback: presenter.onEndLevelCallback.bind(this)
            };
            var level = new Level(configuration);
            presenter.state.levels.push(level);
        }
    };

    presenter.startGame = function () {
        if (presenter.state.isStarted) {
            if (presenter.state.actualLevel < presenter.state.levels.length) {
                presenter.getActualLevel().resume(true);
            }
        } else {
            presenter.getActualLevel().start();
            presenter.state.isStarted = true;
        }
        presenter.actualizeAnswersWrapperHeight();
        presenter.mainLoop();
    };

    presenter.mainLoop = function () {
        if (presenter.state.actualLevel < presenter.state.levels.length) {
            presenter.getActualLevel().actualize();
        }

        if (!presenter.state.destoyed) {
            requestAnimationFrame()(presenter.mainLoop);
        }
    };

    presenter.generateEventData = function (questionNumber, answerNumber, isCorrect, clicked) {
        var value = "0";
        if (clicked) {
            value = "1";
        }

        var score = "0";
        if (isCorrect) {
            score = "1";
        }

        return {
            source : presenter.configuration.addonID,
            item : questionNumber + "-" + answerNumber,
            value : value,
            score : score
        };
    };

    presenter.onCorrectAnswerCallback = function (questionNumber, answerNumber) {
        presenter.state.score += 1;
        presenter.sendValueChangedEvent(presenter.generateEventData(questionNumber, answerNumber, true, true));
    };

    presenter.onWrongAnswerCallback = function (questionNumber, answerNumber) {
        presenter.state.errorCount += 1;
        presenter.state.wholeErrorCount += 1;
        presenter.sendValueChangedEvent(presenter.generateEventData(questionNumber, answerNumber, false, true));
    };

    presenter.onDroppedCorrectAnswerCallback = function (questionNumber, answerNumber) {
        presenter.state.errorCount += 1;
        presenter.state.wholeErrorCount += 1;
        presenter.sendValueChangedEvent(presenter.generateEventData(questionNumber, answerNumber, false, false));
    };

    presenter.sendEndOfGameEvent = function () {
        presenter.sendValueChangedEvent({
            source : presenter.configuration.addonID,
            item : 'all',
            value : 'EOG',
            score : '1'
        });
    };

    presenter.sendValueChangedEvent = function (eventData) {
        presenter.state.eventBus.sendEvent('ValueChanged', eventData);
    };

    /**
     * If all elements dropped then call this function
     * @param {boolean} dontPushResults Don't push results to the resultsList. It is used while loading state
     */
    presenter.onEndLevelCallback = function (dontPushResults) {
        presenter.state.actualLevel++;
        if (presenter.state.actualLevel < presenter.state.levels.length) {
            presenter.getActualLevel().start();
            if (presenter.state.isShowingAnswers) {
                presenter.getActualLevel().showAnswers();
            }
            presenter.actualizeAnswersWrapperHeight();
        } else {
            if (!dontPushResults) {
                presenter.state.resultsList.push({
                    score: presenter.state.score,
                    errors: presenter.state.wholeErrorCount
                });
                presenter.sendEndOfGameEvent();
            }
        }
    };

    presenter.changeLevel = function (levelIndex) {
        presenter.getActualLevel().destroy();

        presenter.state.actualLevel = levelIndex;
        if (presenter.state.isShowingAnswers) {
            presenter.state.levels[levelIndex].showAnswers();
        }
        presenter.actualizeAnswersWrapperHeight();
    };

    presenter.destroy = function () {
        presenter.state.destoyed = true;

        for (var i = 0; i < presenter.state.levels.length; i++) {
            presenter.state.levels[i].destroy();
        }

        presenter.state.$playButton.off();
    };

    presenter.validateModel = function (model) {
        var validatedInitialTime = presenter.validateInitialTimeForAnswer(model);

        if (!validatedInitialTime.isValid) {
            return validatedInitialTime;
        }

        var validatedTimeForLastAnswer = presenter.validateTimeForLastAnswer(model);
        if (!validatedInitialTime.isValid) {
            return validatedTimeForLastAnswer;
        }

        var validatedDefinitions = presenter.validateDefinitions(model);
        if (!validatedDefinitions.isValid) {
            return validatedDefinitions;
        }

        return {
            isValid: true,
            initialTimeForAnswer: validatedInitialTime.initialTimeForAnswer,
            timeForLastAnswer: validatedTimeForLastAnswer.timeForLastAnswer,
            definitions: validatedDefinitions.definitions,
            gameMode: validatedDefinitions.gameMode,
            addonID: model['ID'],
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model['Is Visible'])
        };
    };

    presenter.validateDefinitions = function (model) {
        var definitionsUnvalidated = model['definitions'];
        var definitionsValidated = [];
        var gameMode = presenter.GAME_MODE.UNDEFINED;


        for (var i = 0; i < definitionsUnvalidated.length; i++) {
            var validatedDefinition = presenter.validateDefinition(definitionsUnvalidated[i]);
            if (!validatedDefinition.isValid) {
                return validatedDefinition;
            }

            var validatedGameMode = presenter.validateGameMode(gameMode, validatedDefinition.gameMode);
            if (!validatedGameMode.isValid) {
                return validatedGameMode;
            }
            gameMode = validatedGameMode.gameMode;

            definitionsValidated.push(validatedDefinition);
        }

        return {
            isValid: true,
            definitions: definitionsValidated,
            gameMode: gameMode
        };
    };

    presenter.validateDefinition = function (definitionUnvalidated) {
        var gameMode = presenter.GAME_MODE.UNDEFINED;

        if (htmlIsEmpty(definitionUnvalidated['definition'])) {
            definitionUnvalidated['definition'] = "";
            gameMode = presenter.GAME_MODE.SPEED_ATTACK;
        } else {
            gameMode = presenter.GAME_MODE.QUESTIONS;
        }

        var answer1 = definitionUnvalidated['answer1'];
        var answer2 = definitionUnvalidated['answer2'];
        var answer3 = definitionUnvalidated['answer3'];

        if (window.ModelValidationUtils.isStringEmpty(answer1)) {
            return generateValidationError("EA01");
        }

        if (window.ModelValidationUtils.isStringEmpty(answer2)) {
            return generateValidationError("EA01");
        }

        if (window.ModelValidationUtils.isStringEmpty(answer3)) {
            return generateValidationError("EA01");
        }

        var validatedCorrectAnswers = presenter.validateCorrectAnswers(definitionUnvalidated['correct_answers']);
        if (!validatedCorrectAnswers.isValid) {
            return validatedCorrectAnswers;
        }

        return {
            isValid: true,
            gameMode: gameMode,
            definition: definitionUnvalidated['definition'],
            answers: [answer1, answer2, answer3],
            correctAnswers: validatedCorrectAnswers.correctAnswers
        }
    };

    function htmlIsEmpty(htmlValue) {
        var $container = $("<div></div>");
        $container.html(htmlValue);
        var text = $container.text();
        return window.ModelValidationUtils.isStringEmpty(text);
    }

    presenter.validateCorrectAnswers = function (correctAnswerValue) {
        var correctAnswers = [];

        if (!window.ModelValidationUtils.isStringEmpty(correctAnswerValue)) {
            if (correctAnswerValue.indexOf("-") > -1) {
                var range = getCorrectAnswersFromRange(correctAnswerValue);
                if (!range.isValid) {
                    return range;
                }

                correctAnswers = range.correctAnswers;
            } else {
                var answers = getCorrectAnswersSeparatedByComma(correctAnswerValue);
                if (!answers.isValid) {
                    return answers;
                }

                correctAnswers = answers.correctAnswers;
            }
        }

        return {
            isValid: true,
            correctAnswers: correctAnswers
        };
    };

    function getCorrectAnswersSeparatedByComma(answers) {
        var correctAnswers = [];
        var splitAnswers = answers.split(",");

        for (var i = 0; i < splitAnswers.length; i++) {
            var validatedCorrectAnswer = window.ModelValidationUtils.validateIntegerInRange(splitAnswers[i], 3, 1);
            if (!validatedCorrectAnswer.isValid) {
                return generateValidationError("WA04");
            }

            correctAnswers.push(validatedCorrectAnswer.value - 1);
        }

        correctAnswers = window.ModelValidationUtils.removeDuplicatesFromArray(correctAnswers);
        correctAnswers = correctAnswers.sort();

        return {
            isValid: true,
            correctAnswers: correctAnswers
        };
    }

    function getCorrectAnswersFromRange(range) {
        var correctAnswers = [];
        var splitRange = range.split("-");

        if (splitRange.length !== 2) {
            return generateValidationError("WA01");
        }

        var start = window.ModelValidationUtils.validateIntegerInRange(splitRange[0], 3, 1);
        if (!start.isValid) {
            return generateValidationError("WA02");
        }

        var end = window.ModelValidationUtils.validateIntegerInRange(splitRange[1], 3, 1);
        if (!end.isValid) {
            return generateValidationError("WA03");
        }

        for (var i = Math.min(start.value, end.value) - 1; i <= Math.max(start.value, end.value) - 1; i++) {
            correctAnswers.push(i);
        }

        return {
            isValid: true,
            correctAnswers: correctAnswers
        }

    }

    presenter.validateGameMode = function (lastGameMode, newGameMode) {
        if (lastGameMode == presenter.GAME_MODE.UNDEFINED || lastGameMode == newGameMode) {
            return {
                isValid: true,
                gameMode: newGameMode
            };
        }

        if (lastGameMode !== newGameMode) {
            return generateValidationError("WM01");
        }
    };

    presenter.validateTimeForLastAnswer = function (model) {
        var timeForLastAnswerUnvalidated = model['time_for_last_answer'];

        if (window.ModelValidationUtils.isStringEmpty(timeForLastAnswerUnvalidated)) {
            return {
                isValid: true,
                timeForLastAnswer: -1
            };
        }

        var validatedFloat = window.ModelValidationUtils.validateFloatInRange(timeForLastAnswerUnvalidated, Number.MAX_VALUE, 0.01);
        if (!validatedFloat.isValid) {
            return generateValidationError("LT01")
        }

        return {
            isValid: true,
            timeForLastAnswer: validatedFloat.parsedValue
        };

    };

    presenter.validateInitialTimeForAnswer = function (model) {
        var initialTimeForAnswerUnvalidated = model['initial_time_for_answer'];
        var validatedFloat = window.ModelValidationUtils.validateFloatInRange(initialTimeForAnswerUnvalidated, Number.MAX_VALUE, 0.01);
        if (!validatedFloat.isValid) {
            return generateValidationError("IT01")
        }

        return {
            isValid: true,
            initialTimeForAnswer: validatedFloat.parsedValue
        }
    };

    presenter.setVisibility = function (isVisible) {
        presenter.state.$view.css('visibility', isVisible ? 'visible' : 'hidden');
        presenter.state.$view.css('display', isVisible ? presenter.originalDisplay : 'none');

        presenter.state.isVisible = isVisible;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.reset = function () {
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);

        presenter.setWorkMode();
        presenter.hideAnswers();
        presenter.state.resultsList = [];
        presenter.restartGame();
    };

    presenter.setShowErrorsMode = function() {
        presenter.state.showingErrors = true;

        if (presenter.state.$playButton.is(":visible")) {
            return;
        }
        if (presenter.state.isShowingAnswers) {
            presenter.hideAnswers();
        }

        if (presenter.state.actualLevel < presenter.state.levels.length) {
            presenter.getActualLevel().pause();
        }
    };

    presenter.setWorkMode = function () {
        presenter.state.showingErrors = false;

        if (!presenter.state.isStarted || presenter.state.$playButton.is(":visible")) {
            return;
        }

        if (presenter.state.actualLevel < presenter.state.levels.length) {
            presenter.getActualLevel().resume();
        }
    };

    presenter.setState = function (stateString) {
        var state = JSON.parse(stateString);

        if (state.isStarted) {
            presenter.changeLevel(state['actualLevel']);
            presenter.getActualLevel().start(state['actualLevelTimeElapsed'], state['clickedElements']);

            presenter.actualizeAnswersWrapperHeight();
            if (!state.isFinished) {
                presenter.getActualLevel().actualize();
                presenter.getActualLevel().pause(true);
            }
            presenter.state.isStarted = true;
        }
        presenter.state.errorCount = state.errorCount;
        presenter.state.wholeErrorCount = state.wholeErrorCount;
        presenter.state.score = state.score;
        presenter.state.resultsList = state.resultsList;

        if (state.isFinished) {
            presenter.getActualLevel().destroy();
            presenter.onEndLevelCallback(true);
        }

        presenter.setVisibility(state.isVisible);
    };

    presenter.getActualLevel = function () {
        return presenter.state.levels[presenter.state.actualLevel];
    };

    presenter.getState = function () {
        var actualLevelTimeElapsed = 1;
        var isFinished = true;
        var actualLevel = presenter.state.levels.length - 1;
        var clickedElements = [];
        var isStarted = presenter.state.isStarted;

        if (presenter.state.actualLevel < presenter.state.levels.length) {
            actualLevelTimeElapsed = presenter.getActualLevel().getElapsedTime();
            isFinished = false;
            actualLevel = presenter.state.actualLevel;
            clickedElements = presenter.getActualLevel().getClicked();
        }

        var state = {
            actualLevel: actualLevel,
            actualLevelTimeElapsed: actualLevelTimeElapsed,
            isFinished: isFinished,
            isVisible: presenter.state.isVisible,
            score: presenter.state.score,
            errorCount: presenter.state.errorCount,
            wholeErrorCount: presenter.state.wholeErrorCount,
            clickedElements: clickedElements,
            isStarted: isStarted,
            resultsList: presenter.state.resultsList
        };

        return JSON.stringify(state);
    };

    presenter.getScore = function () {
        return presenter.state.score;
    };

    presenter.getMaxScore = function () {
        var definitionsLength = presenter.configuration.definitions.length;
        var maxScore = 0;
        for (var i = 0; i < definitionsLength; i++) {
            maxScore += presenter.configuration.definitions[i].correctAnswers.length;
        }

        return maxScore;
    };

    presenter.getErrorCount = function () {
        var lastErrorCount = presenter.state.errorCount;

        return lastErrorCount;
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.isErrorCheckingMode) {
            return;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.createEventData = function () {
        return {
            source : presenter.configuration.addonID,
            item : "all",
            value : '',
            score : ''
        };

    };

    function generateValidationError(errorCode) {
        return {
            isValid: false,
            errorCode: errorCode
        };
    }

    presenter.__internalElements = {
        Level: Level
    };

    function Level (configuration) {
        this.definition = configuration.definition;
        this.questionNumber = configuration.questionNumber;
        this.$answersWrapper = configuration.$answersWrapper;
        this.$questionDiv = configuration.$questionDiv;
        this.$levelDiv = configuration.$levelDiv;
        this.numberOfLevel = configuration.numberOfLevel;
        this.timeForAnswer = configuration.timeForAnswer;
        this.callbacks = {
            onCorrectAnswerCallback: configuration.onCorrectAnswerCallback,
            onWrongAnswerCallback: configuration.onWrongAnswerCallback,
            onDroppedCorrectAnswerCallback: configuration.onDroppedCorrectAnswerCallback,
            onEndLevelCallback: configuration.onEndLevelCallback
        };

        this.initialElapsedTime = 0;
        this.startTime = 0;
        this.answers = [];
        this.levelWasEnded = false;
        this.destroyed = true;
        this.droppedElements = 0;
        this.clickedElements = 0;
        this.pauseTime = 0;
        this.isPaused = false;
    }

    Level.prototype = {
        start: function (elapsedTime, clickedElements) {
            this.clickedElements = 0;
            this.startTime = new Date().getTime() / 1000;
            this.generateAnswers();
            this.$questionDiv.html(this.definition["definition"]);
            this.$levelDiv.html(this.numberOfLevel);
            this.destroyed = false;
            this.initialElapsedTime = 0;
            this.pauseTime = 0;
            this.isPaused = false;
            this.levelWasEnded = false;
            this.droppedElements = 0;

            if (this.definition.gameMode == presenter.GAME_MODE.SPEED_ATTACK) {
                this.$questionDiv.hide();
            } else {
                this.$questionDiv.show();
            }

            if (elapsedTime) {
                this.setElapsedTime(elapsedTime);
            }

            if (clickedElements) {
                this.setClicked(clickedElements);
            }
        },

        destroy: function () {
            if (this.destroyed) {
                return;
            }
            this.destroyed = true;

            for (var i = 0; i < 3; i++) {
                this.answers[i].element.off();
                this.answers[i].element.remove();
            }
        },

        actualize: function () {
            if (this.destroyed || this.isPaused) {
                return;
            }

            this.speedForSecond = this.$answersWrapper.height() / this.timeForAnswer;

            var timeElapsed =(new Date().getTime() / 1000) - this.startTime + this.initialElapsedTime;
            var top = timeElapsed * this.speedForSecond;

            for (var i = 0; i < 3; i++) {
                this.answers[i].element.css({'top': top});
                if (top > this.$answersWrapper.height()) {
                    this.onDrop(this.questionNumber, i);
                }
            }
        },

        generateAnswers: function () {
            this.answers = [];
            for (var i = 0; i < 3; i++) {
                this.answers.push(this.generateAnswer(i));
            }
        },

        generateAnswer: function (index) {
            var wrapper = $("<div></div>");
            wrapper.addClass("addon-Shooting_Range-answer-wrapper addon-Shooting_Range-answer-" + index);

            var text = $("<div></div>");
            text.addClass("addon-Shooting_Range-answer-text");

            var layer = $("<div></div>");
            layer.addClass("addon-Shooting_Range-answer-layer");

            wrapper.append(text);
            wrapper.append(layer);

            var isCorrect = $.inArray(index, this.definition.correctAnswers) > -1;
            var functionOnClick = this.onClick.bind(this, this.questionNumber, isCorrect, index);

            layer.mousedown(functionOnClick);
            layer.on('touchstart', functionOnClick);
            text.html(this.definition.answers[index]);

            this.$answersWrapper.append(wrapper);

            return {
                element: wrapper,
                text: text,
                layer: layer,
                isClicked: false,
                isCorrect: isCorrect
            };
        },

        onClick: function (questionNumber, isCorrect, answerNumber, event) {
            event.stopPropagation();
            event.preventDefault();

            if(this.isPaused) {
                return;
            }

            if (this.answers[answerNumber].isClicked) {
                return;
            }

            if (isCorrect) {
                this.callbacks.onCorrectAnswerCallback(questionNumber, answerNumber);
                this.setCorrectAnswer(answerNumber);
            } else {
                this.callbacks.onWrongAnswerCallback(questionNumber, answerNumber);
                this.setWrongAnswer(answerNumber);
            }
            this.setClickedAnswer(answerNumber);
        },

        onDrop: function (questionNumber, answerNumber) {
            this.droppedElements++;

            if (!this.answers[answerNumber].isClicked) {
                var isCorrect = this.answers[answerNumber].isCorrect;
                if (isCorrect) {
                    this.callbacks.onDroppedCorrectAnswerCallback(questionNumber, answerNumber);
                }
            }

            if (this.droppedElements == 3) {
                this.endLevel();
            }
        },

        endLevel: function () {
            if (this.levelWasEnded) {
                return;
            }

            this.levelWasEnded = true;
            this.destroy();
            this.callbacks.onEndLevelCallback();
        },

        setElapsedTime: function (elapsed) {
            this.initialElapsedTime = elapsed;
        },

        getElapsedTime: function () {
            if (this.startTime == 0) {
                return 0;
            }

            var pausedTime = 0;

            if (this.isPaused) {
                pausedTime = this.pauseTime - new Date().getTime() / 1000
            }

            return (new Date().getTime() / 1000) - this.startTime + this.initialElapsedTime + pausedTime;
        },

        setWrongAnswer(answerNumber) {
            this.answers[answerNumber].element.addClass("wrong");
        },

        setCorrectAnswer(answerNumber) {
            this.answers[answerNumber].element.addClass("correct");
        },

        setClickedAnswer(answerNumber) {
            this.answers[answerNumber].isClicked = true;
            this.answers[answerNumber].element.addClass("clicked");
            this.clickedElements++;
        },


        setClicked: function (clickedArray) {
            for (var i = 0; i < clickedArray.length; i++) {
                this.setClickedAnswer(clickedArray[i]);
                if(this.answers[clickedArray[i]].isCorrect){
                    this.setCorrectAnswer(clickedArray[i]);
                }else{
                    this.setWrongAnswer(clickedArray[i]);
                }
            }
        },

        getClicked: function () {
            var clicked = [];

            if (this.destroyed) {
                return clicked;
            }

            for (var  i = 0; i < 3; i++) {
                if (this.answers[i].isClicked) {
                    clicked.push(i);
                }
            }

            return clicked;
        },

        showAnswers: function () {
            if (this.destroyed) {
                return;
            }
            for (var  i = 0; i < 3; i++) {
                if (this.answers[i].isCorrect) {
                    this.answers[i].element.addClass('correct');
                } else {
                    this.answers[i].element.addClass('wrong');
                }
            }
        },

        hideAnswers: function () {
            if (this.destroyed) {
                return;
            }
            for (var  i = 0; i < 3; i++) {
                this.answers[i].element.removeClass('correct');
                this.answers[i].element.removeClass('wrong');
            }
        },

        pause: function (hideElements) {
            if (this.isPaused) {
                return;
            }
            this.isPaused = true;
            this.pauseTime = new Date().getTime() / 1000;

            if (hideElements) {
                for (var i = 0; i < 3; i++) {
                    this.answers[i].element.addClass("isHidden");
                }
            }
        },

        resume: function (removeIsHidden) {
            if (!this.isPaused) {
                return;
            }
            this.isPaused = false;
            this.initialElapsedTime += this.pauseTime - new Date().getTime() / 1000;
            if (removeIsHidden) {
                for (var i = 0; i < 3; i++) {
                    this.answers[i].element.removeClass("isHidden");
                }
            }
        }
    };

    //https://stackoverflow.com/questions/5605588/how-to-use-requestanimationframe
    function requestAnimationFrame () {
        return window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback){
                window.setTimeout(callback, 1000 / 60);
            };
    }

    return presenter;
}