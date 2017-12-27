function AddonMaze_create () {
    var presenter = function () {};

    presenter.ERROR_MESSAGES = {
        'WW01': 'Width must be positive integer',
        'WW02': 'Width must be bigger than 5',
        'WH01': 'Height must be positive integer',
        'WH02': 'Height must be bigger than 5',
        'WC01': 'Number of mazes must be positive integer',
        'WN01': 'Labyrinth number must be positive integer'
    };

    presenter.state = {
        games: [],
        actualGameIndex: 0,
        mistakes: 0,
        errorCount: 0,
        applyButtonClickCallback: function () {},

        elements: {
            questionContainer: null,
            questionBackground: null,
            gameContainer: null,
            upButton: null,
            leftButton: null,
            rightButton: null,
            downButton: null,
            applyButton: null,
            questionText: null,
            answerInput: null,
            endGame: null,
            menu: null,
            lettersAnswerBackground: null,
            lettersAnswerContainer: null,
            lettersAnswerButton: null,
            lettersContainer: null
        },

        isDisabled: false,
        nextMazeButtonCallback: function () {},
        isShowingAnswers: false,
        isShowingErrors: false

    };

    presenter.GAME_TYPES = {
        'DIAMOND': 1,
        'LETTERS': 2
    };

    presenter.showErrorMessage = function (message, substitutions) {
        var errorContainer,
            key;
        if (typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            var messageSubst = message;
            for (key in substitutions) {
                messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }
        presenter.$view.html(errorContainer);
    };

    presenter.run = function(view, model) {
        presenter.runLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.runLogic(view, model, true);
    };

    presenter.getScore = function () {
        return presenter.state.actualGameIndex;
    };

    presenter.getMaxScore = function () {
        return presenter.configuration.numberOfMazes;
    };

    presenter.getErrorCount = function () {
        var lastErrorCount = presenter.state.errorCount;
        presenter.state.errorCount = 0;

        return lastErrorCount;
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.destroy = function () {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.getActualGame().destroy();
        presenter.disconnectHandlers();
    };

    /**
     * Set in state expected elements like DOM elements
     */
    presenter.completeState = function () {
        var expectedElements = {
                questionContainer: 'Maze_game_question_container',
                questionBackground: 'Maze_game_question_background',
                gameContainer: 'Maze-wrapper-game-container',
                upButton: 'Maze-wrapper-menu-controls-up',
                leftButton: 'Maze-wrapper-menu-controls-left',
                rightButton: 'Maze-wrapper-menu-controls-right',
                downButton: 'Maze-wrapper-menu-controls-down',
                applyButton: 'Maze_game_question_container_question_apply',
                questionText: 'Maze_game_question_container_question_text',
                answerInput: 'Maze_game_question_container_question_input',
                endGame: 'Maze_game_end',
                menu: 'Maze-wrapper-menu',
                lettersAnswerBackground: 'Maze_letters_end_level_background',
                lettersAnswerContainer: 'Maze_letters_end_level_answer_wrapper',
                lettersAnswerButton: 'Maze_letters_end_level_next_maze_button',
                lettersContainer: 'Maze_letters_end_level_answer_letters_container'
            },
            i;

        for (i in expectedElements) {
            if (expectedElements.hasOwnProperty(i)) {
                presenter.state.elements[i] = presenter.view.getElementsByClassName(expectedElements[i])[0];
            }
        }

        presenter.state.isDisabled = presenter.configuration.isDisabled;
    };

    function rotateElement (element, rotation) {
        element.style.webkitTransform = 'rotate(' + rotation + 'deg)';
        element.style.mozTransform    = 'rotate(' + rotation + 'deg)';
        element.style.msTransform     = 'rotate(' + rotation + 'deg)';
        element.style.oTransform      = 'rotate(' + rotation + 'deg)';
        element.style.transform       = 'rotate(' + rotation + 'deg)';
    }

    /**
     * @param  {HTMLDivElement} view
     * @param  {Object} model
     * @param  {Boolean} isPreview
     */
    presenter.runLogic = function (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.view = view;
        presenter.configuration = presenter.validateModel(model);

        if (!presenter.configuration.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[presenter.configuration.errorCode]);
            return;
        }

        presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });

        if (!isPreview) {
            presenter.completeState();

            if (presenter.configuration.hideControlPanel) {
                presenter.state.elements.menu.style.display = 'none';
                presenter.state.elements.gameContainer.style.width = '100%';
            }

            presenter.connectHandlers();
            presenter.initializeMaze();

        }

        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.initializeMaze = function () {
            var gameContainer = presenter.state.elements.gameContainer,
                i,
                minSize = Math.min(gameContainer.offsetWidth, gameContainer.offsetHeight),
                game;


            if (presenter.configuration.hideControlPanel) {
                minSize = Math.min(presenter.configuration.addonSize.width, presenter.configuration.addonSize.height);
            }

            presenter.state.actualGameIndex = 0;
            presenter.state.games = [];

            for (i = 0; i < presenter.configuration.numberOfMazes; i += 1) {
                if (presenter.configuration.gameType === presenter.GAME_TYPES.DIAMOND) {
                    game = new DiamondGame(presenter.configuration.labyrinthSize, minSize, presenter.configuration.questions[i] || []);
                    presenter.state.games.push(game);
                } else  {
                    game = new LetterGame(presenter.configuration.labyrinthSize, minSize, presenter.configuration.questions[i] || []);
                    presenter.state.games.push(game);
                }
            }

            presenter.getActualGame().start(gameContainer);
    };

    /**@returns {Game}
     */
    presenter.getActualGame = function () {
        return presenter.state.games[presenter.state.actualGameIndex];
    };

    presenter.moveUp = function () {
        if (presenter.state.isDisabled) {
            return;
        }

        if (presenter.state.isShowingErrors || presenter.state.isShowingAnswers) {
            return;
        }

        presenter.getActualGame().goUp();
    };

    presenter.moveDown = function () {
        if (presenter.state.isDisabled) {
            return;
        }

        if (presenter.state.isShowingErrors || presenter.state.isShowingAnswers) {
            return;
        }

        presenter.getActualGame().goDown();
    };

    presenter.moveLeft = function () {
        if (presenter.state.isDisabled) {
            return;
        }

        if (presenter.state.isShowingErrors || presenter.state.isShowingAnswers) {
            return;
        }

        presenter.getActualGame().goLeft();
    };

    presenter.moveRight = function () {
        if (presenter.state.isDisabled) {
            return;
        }

        if (presenter.state.isShowingErrors || presenter.state.isShowingAnswers) {
            return;
        }

        presenter.getActualGame().goRight();
    };

    presenter.onQuestionApplyButtonClick = function () {
        presenter.state.applyButtonClickCallback(presenter.state.elements.answerInput.value);
        presenter.state.elements.answerInput.value = '';
        presenter.state.applyButtonClickCallback = function () {};
    };

    presenter.setOnQuestionApplyCallback = function (fn) {
        presenter.state.applyButtonClickCallback = fn;
    };

    presenter.setQuestionHTML = function (html) {
        presenter.state.elements.questionText.innerHTML = html;
    };

    presenter.showQuestionModal = function () {
        presenter.state.elements.questionContainer.style.display = 'block';
        presenter.state.elements.questionBackground.style.display = 'block';
    };

    presenter.hideQuestionModal = function () {
        presenter.state.elements.questionContainer.style.display = 'none';
        presenter.state.elements.questionBackground.style.display = 'none';
    };

    presenter.sendEvent = function (evData) {
        if (presenter.eventBus != undefined) {
            presenter.eventBus.sendEvent('ValueChanged', evData);
        }
    };

    presenter.disable = function () {
        presenter.state.isDisabled = true;
    };

    presenter.enable = function () {
        presenter.state.isDisabled = false;
    };

    presenter.getMistakeEventData = function () {
        return {
            source : presenter.configuration.addonID,
            value: presenter.state.mistakes + '',
            item: 'mistake'
        };
    };

    presenter.getOpenedDoorEventData = function (number) {
        return {
            source : presenter.configuration.addonID,
            value: number + '',
            item: 'opened'
        };
    };

    presenter.openedDoor = function (number) {
        presenter.sendEvent(presenter.getOpenedDoorEventData(number));
    };

    presenter.getGatheredLetterEventData = function (letter) {
        return {
            source : presenter.configuration.addonID,
            value: letter,
            item: 'gathered'
        };
    };

    presenter.receivedLetter = function (letter) {
        presenter.sendEvent(presenter.getGatheredLetterEventData(letter));
    };

    presenter.getFinishedMazeEventData = function (mazeNumber) {
        return {
            source: presenter.configuration.addonID,
            value: '1',
            item: mazeNumber + '',
            score: 1
        };
    };

    presenter.getFinishedAllMazeEventData = function () {
        return {
            source: presenter.configuration.addonID,
            value: '1',
            item: 'all',
            score: 1
        };
    };

    presenter.showEndGame = function () {
        presenter.state.elements.endGame.style.display = 'block';
    };

    presenter.finishedMaze = function () {
        if (presenter.state.actualGameIndex + 1 === presenter.configuration.numberOfMazes) {
            presenter.state.actualGameIndex += 1;
            presenter.showEndGame();
            presenter.sendEvent(presenter.getFinishedAllMazeEventData());
        } else {
            presenter.getActualGame().destroy();
            presenter.state.actualGameIndex += 1;
            presenter.getActualGame().start(presenter.state.elements.gameContainer);
            presenter.sendEvent(presenter.getFinishedMazeEventData(presenter.state.actualGameIndex));
        }
    };

    presenter.setNextMazeButtonCallback = function (fn) {
        presenter.state.nextMazeButtonCallback = fn;
    };

    presenter.showLettersAnswer = function (letters) {
        presenter.state.elements.lettersAnswerBackground.style.display = 'block';
        presenter.state.elements.lettersAnswerContainer.style.display = 'block';

        presenter.state.elements.lettersContainer.innerHTML = '';
        letters.forEach(function (element) {
           var div = document.createElement('div');
           div.classList.add('Maze_letters_letter_element');
           div.innerText = element;
           presenter.state.elements.lettersContainer.appendChild(div);
        });

    };

    presenter.hideLettersAnswer = function () {
        presenter.state.elements.lettersAnswerBackground.style.display = 'none';
        presenter.state.elements.lettersAnswerContainer.style.display = 'none';
    };

    presenter.playerMistake = function () {
        presenter.state.mistakes += 1;
        presenter.state.errorCount += 1;

        presenter.sendEvent(presenter.getMistakeEventData());

        if (presenter.state.mistakes === 3) {
            presenter.getActualGame().destroy();
            presenter.initializeMaze();
            presenter.state.mistakes = 0;
        }
    };

    presenter.onNextMazeButtonClick = function () {
        presenter.state.nextMazeButtonCallback.call(presenter.getActualGame());
    };

    presenter.connectHandlers = function () {
        presenter.state.elements.upButton.addEventListener('click', presenter.moveUp);
        presenter.state.elements.leftButton.addEventListener('click', presenter.moveLeft);
        presenter.state.elements.downButton.addEventListener('click', presenter.moveDown);
        presenter.state.elements.rightButton.addEventListener('click', presenter.moveRight);
        presenter.state.elements.applyButton.addEventListener('click', presenter.onQuestionApplyButtonClick);
        presenter.state.elements.lettersAnswerButton.addEventListener('click', presenter.onNextMazeButtonClick);
    };

    presenter.disconnectHandlers = function () {
        presenter.state.elements.upButton.removeEventListener('click', presenter.moveUp);
        presenter.state.elements.leftButton.removeEventListener('click', presenter.moveLeft);
        presenter.state.elements.downButton.removeEventListener('click', presenter.moveDown);
        presenter.state.elements.rightButton.removeEventListener('click', presenter.moveRight);
        presenter.state.elements.applyButton.removeEventListener('click', presenter.onQuestionApplyButtonClick);
        presenter.state.elements.lettersAnswerButton.removeEventListener('click', presenter.onNextMazeButtonClick);
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'showAnswers' : presenter.showAnswers,
            'hideAnswers' : presenter.hideAnswers,
            'moveUp': presenter.moveUp,
            'moveDown': presenter.moveDown,
            'moveLeft': presenter.moveLeft,
            'moveRight': presenter.moveRight,
            'enable': presenter.enable,
            'disable': presenter.disable
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    function generateValidationError(errorCode) {
        return {
            isValid: false,
            errorCode: errorCode
        };
    }

    presenter.showAnswers = function () {
        presenter.state.isShowingAnswers = true;

        if (presenter.state.showingErrors) {
            presenter.setWorkMode();
        }
    };

    presenter.hideAnswers = function () {
        presenter.state.isShowingAnswers = false;
    };

    presenter.setShowErrorsMode = function() {
        presenter.state.isShowingErrors = true;

        if (presenter.state.isShowingAnswers) {
            presenter.hideAnswers();
        }
    };

    presenter.setWorkMode = function () {
        presenter.state.isShowingErrors = false;
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName === 'ShowAnswers') {
            presenter.showAnswers();
        }

        if (eventName === 'HideAnswers') {
            presenter.hideAnswers();
        }
    };

    presenter.validateLabyrinthSize = function (model) {
        var validatedWidth = ModelValidationUtils.validatePositiveInteger(model.width);
        var validatedHeight = ModelValidationUtils.validatePositiveInteger(model.height);

        if (!validatedHeight.isValid) {
            return generateValidationError('WH01');
        }

        if (!validatedWidth.isValid) {
            return generateValidationError('WW01');
        }

        if (validatedWidth.value <= 5) {
            return generateValidationError('WW02');
        }

        if (validatedHeight.value <= 5) {
            return generateValidationError('WH02');
        }

        return {
            isValid: true,
            width: validatedWidth.value,
            height: validatedHeight.value
        };
    };

    presenter.validateNumberOfMazes = function (model) {
        if (model.numberOfMazes === '') {
            model.numberOfMazes = '1';
        }

        var validatedNumberOfMazes = ModelValidationUtils.validatePositiveInteger(model.numberOfMazes);

        if (!validatedNumberOfMazes.isValid) {
            return generateValidationError('WC01');
        }

        return {
            isValid: true,
            value: validatedNumberOfMazes.value
        }
    };

    /**
     *
     * @param {{question:String, answer:String, letter:String, mazeId:String}[]} questions
     */
    presenter.validateQuestions = function (questions) {
        var validatedQuestions = [],
            i;

        for (i = 0; i < questions.length; i += 1) {
            var element = questions[i];
            var validatedLabyrinthNumber = ModelValidationUtils.validatePositiveInteger(element.mazeId);
            if (!validatedLabyrinthNumber.isValid) {
                return generateValidationError('WN01');
            }

            validatedQuestions[validatedLabyrinthNumber.value - 1] = validatedQuestions[validatedLabyrinthNumber.value - 1] || [];
            validatedQuestions[validatedLabyrinthNumber.value - 1].push({
                question: element.question,
                answer: element.answer,
                letter: element.letter
            });
        }

        return {
            isValid: true,
            value: validatedQuestions
        };
    };

    presenter.validateModel = function (model) {
        if (model.gameMode === '') {
            model.gameMode = 'diamond';
        }

        var validatedLabyrinthSize = presenter.validateLabyrinthSize(model);
        if (!validatedLabyrinthSize.isValid) {
            return validatedLabyrinthSize;
        }

        var validatedNumberOfMazes = presenter.validateNumberOfMazes(model);
        if (!validatedNumberOfMazes.isValid) {
            return validatedNumberOfMazes;
        }

        var validatedLabyrinthType = presenter.GAME_TYPES[model.gameMode.toUpperCase()];

        var validatedQuestions = presenter.validateQuestions(model.questions);
        if (!validatedQuestions.isValid) {
            return validatedQuestions;
        }

        return {
            isValid: true,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            labyrinthSize: {
                width: validatedLabyrinthSize.width,
                height: validatedLabyrinthSize.height
            },

            addonSize: {
                width: ModelValidationUtils.validatePositiveInteger(model['Width']).value,
                height: ModelValidationUtils.validatePositiveInteger(model['Height']).value,
            },

            numberOfMazes: validatedNumberOfMazes.value,

            gameType: validatedLabyrinthType,
            questions: validatedQuestions.value,

            addonID: model.ID,
            hideControlPanel: ModelValidationUtils.validateBoolean(model['hideControlPanel']),
            isDisabled: ModelValidationUtils.validateBoolean(model['isDisabled'])
        };
    };

    presenter.getState = function () {
        return JSON.stringify({
            isDisabled: presenter.state.isDisabled,
            actualGameIndex: presenter.state.actualGameIndex,
            mistakes: presenter.state.mistakes,
            errorCount: presenter.state.errorCount,
            actualGame: presenter.getActualGame()? presenter.getActualGame().serialize(): null
        });
    };

    presenter.setState = function (state) {
        var object = JSON.parse(state);
        if (object.actualGameIndex !== 0) {
            presenter.getActualGame().destroy();
        }

        presenter.state.isDisabled = object.isDisabled;
        presenter.state.actualGameIndex = object.actualGameIndex;
        presenter.state.mistakes = object.mistakes;
        presenter.state.errorCount = object.errorCount;

        if (presenter.getActualGame()) {
            if (object.actualGameIndex !== 0) {
                presenter.getActualGame().start(presenter.state.elements.gameContainer);
            }
            presenter.getActualGame().deserialize(object.actualGame);
        } else {
            presenter.showEndGame();
        }

    };

    presenter.reset = function () {
        presenter.state.mistakes = 0;
        presenter.state.isDisabled = presenter.configuration.isDisabled;
        presenter.state.isShowingAnswers = false;
        presenter.state.isShowingErrors = false;
        
        presenter.getActualGame().destroy();
        presenter.state.games = [];

        presenter.initializeMaze();
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
    };

    /**
     * @class
     *
     * @param {{width: Number, height: Number}} size
     * @param {Number} maxSize of maze in px
     *
     */
    function Game (size, maxSize) {
        this.maze = new Maze(size, maxSize);
        this.isStarted = false;
        this.playerElement = document.createElement('div');
        this.playerElement.classList.add('Maze_player_element');

        this.playerPosition = {
            x: 0,
            y: 0
        };
    }

    Game.prototype.serialize = function () {
        return {
            maze: this.maze.serialize(),
            playerPosition: this.playerPosition
        }
    };

    Game.prototype.deserialize = function (obj) {
        this.playerPosition = obj.playerPosition;
        this.maze.deserialize(obj.maze);
    };

    /**
     * @param  {HTMLDivElement} container
     */
    Game.prototype.start = function (container) {
        this.maze.generate();

        container.appendChild(this.maze.getElement());
    };

    Game.prototype.destroy = function () {
        this.maze.getElement().parentNode.removeChild(this.maze.getElement());
        this.maze.mazeElements = [];
        this.maze.rooms = [];
        this.maze.walls = [];
    };

    /**
     * @param {Room}room
     */
    Game.prototype.movePlayerTo = function (room) {
        if (this.checkRoomCallback(room)) {
            room.element.appendChild(this.playerElement);

            this.playerPosition = this.maze.getRoomPosition(room);
        }
    };

    Game.prototype.goUp = function () {
        var wall = this.maze.mazeElements[this.playerPosition.y - 1][this.playerPosition.x];

        if (wall.isOpened()) {
            var room = this.maze.mazeElements[this.playerPosition.y - 2][this.playerPosition.x];
            this.movePlayerTo(room);
        }
    };

    Game.prototype.goLeft = function () {
        var wall = this.maze.mazeElements[this.playerPosition.y][this.playerPosition.x - 1];

        if (wall.isOpened()) {
            var room = this.maze.mazeElements[this.playerPosition.y][this.playerPosition.x - 2];
            this.movePlayerTo(room);
        }
    };

    Game.prototype.goRight = function () {
        var wall = this.maze.mazeElements[this.playerPosition.y][this.playerPosition.x + 1];

        if (wall.isOpened()) {
            var room = this.maze.mazeElements[this.playerPosition.y][this.playerPosition.x + 2];
            this.movePlayerTo(room);
        }
    };

    Game.prototype.goDown = function () {
        var wall = this.maze.mazeElements[this.playerPosition.y + 1][this.playerPosition.x];

        if (wall.isOpened()) {
            var room = this.maze.mazeElements[this.playerPosition.y + 2][this.playerPosition.x];
            this.movePlayerTo(room);
        }
    };

    /**
     * Call room callback if exists
     * @param {Room} room
     * @returns {Boolean} true, if can go, false if something is there
     */
    Game.prototype.checkRoomCallback = function (room) {
        if (room.callback) {
            return room.callback.call(this, room);
        }

        return true;
    };

    function LetterGame (size, maxSize, questions) {
        Game.call(this, size, maxSize);

        this.questions = questions;

        this.endLevelElement = document.createElement('div');
        this.endLevelElement.classList.add('Maze_letters_end_level');
        this.gatheredLettersCount = 0;
        this.questionsPositions = [];   //Saving question as [index] = roomIndex, if roomIndex is null then question is resolved
    }

    LetterGame.prototype = Object.create(Game.prototype);

    LetterGame.prototype.serialize = function () {
        var gameObj = Game.prototype.serialize.call(this);

        return {
            gameObj: gameObj, 
            gatheredLettersCount: this.gatheredLettersCount,
            questionsPositions: this.questionsPositions
        };
    };

    LetterGame.prototype.deserialize = function (obj) {
        Game.prototype.deserialize.call(this, obj.gameObj);
        
        this.gatheredLettersCount = obj.gatheredLettersCount;
        var longestPath = this.maze.getLongestPath();

        this.createEndLevelElement(longestPath);
        this.questionsPositions = obj.questionsPositions;

        var self = this;
        this.questionsPositions.forEach(function (element, index) {
            if (element !== null) {
                self.setLetterInRoom(self.maze.rooms[element], self.questions[index]);
            }
        });

        this.movePlayerTo(this.maze.mazeElements[this.playerPosition.y][this.playerPosition.x]);
    };

    LetterGame.prototype.start = function (container) {
        Game.prototype.start.call(this, container);

        var longestPath = this.maze.getLongestPath();
        this.movePlayerTo(longestPath[0]);
        this.createEndLevelElement(longestPath);

        var questions = this.questions.slice();

        while(questions.length !== 0) {
            var questionIndex = getRandomIndex(questions);

            var question = questions.splice(questionIndex, 1)[0];
            var counter = 0;

            while (true) {
                counter++;

                var roomIndex = getRandomIndex(this.maze.rooms);
                var room = this.maze.rooms[roomIndex];

                if (room == longestPath[0]) {
                    continue;
                }

                if (!room.hasCallback()) {
                    this.setLetterInRoom(room, question);
                    this.questionsPositions[this.questions.indexOf(question)] = roomIndex;
                    break;
                }

                //Be sure that there never will be forever while
                if (counter === 50) {
                    return;
                }
            }
        }
    };

    /**
     *
     * @param room {Room}
     * @param question {{}}
     */
    LetterGame.prototype.setLetterInRoom = function (room, question) {
        room.setCallback(this.onLetterEnterCallback.bind(this, question));

        var paragraph = document.createElement('p');
        paragraph.classList.add('Maze_letters_room_letter');
        paragraph.innerText = question.letter;

        room.getElement().appendChild(paragraph);        
    };

    LetterGame.prototype.onLetterEnterCallback = function (questionObj, room) {
        presenter.setQuestionHTML(questionObj.question);
        presenter.showQuestionModal();


        var self = this;
        presenter.setOnQuestionApplyCallback(function (value) {
            if (value === questionObj.answer) {
                self.gatheredLettersCount += 1;
                room.removeCallback();
                var letter = room.element.getElementsByClassName('Maze_letters_room_letter')[0];
                letter.parentNode.removeChild(letter);

                presenter.receivedLetter(questionObj.letter);
                self.questionsPositions[self.questions.indexOf(questionObj)] = null;
            } else {
                presenter.playerMistake();
            }

            presenter.hideQuestionModal();
        });
    };

    LetterGame.prototype.createEndLevelElement = function (longestPath) {
        longestPath[longestPath.length - 1].element.appendChild(this.endLevelElement);
        longestPath[longestPath.length - 1].setCallback(this.onEnterEndGame);
    };

    LetterGame.prototype.onEnterEndGame = function () {
        var i,
            letters = [];

        if (this.questions.length !== this.gatheredLettersCount) {
            return false;
        }
        
        for (i = 0; i < this.questions.length; i += 1) {
            letters.push(this.questions[i].letter);
        }

        presenter.showLettersAnswer(letters);
        presenter.setNextMazeButtonCallback(function () {
            presenter.finishedMaze();
            presenter.hideLettersAnswer();
        });
    };

    /**
     *
     * @param size
     * @param maxSize
     * @param {{}[]}questions
     * @constructor
     */
    function DiamondGame (size, maxSize, questions) {
        Game.call(this, size, maxSize);

        this.treasureElement = document.createElement('div');
        this.treasureElement.classList.add('Maze_treasure_element');
        this.questions = questions;
        this.keysCount = 0;
    }

    DiamondGame.prototype = Object.create(Game.prototype);

    DiamondGame.prototype.serialize = function () {
        var gameObj = Game.prototype.serialize.call(this);

        return {
            gameObj: gameObj, 
            keysCount: this.keysCount
        };
    };

    DiamondGame.prototype.deserialize = function (obj) {
        Game.prototype.deserialize.call(this, obj.gameObj);

        this.keysCount = obj.keysCount;
        var longestPath = this.maze.getLongestPath(),
            doorsCount = this.questions.length,
            spaceBetween = ~~(longestPath.length / (doorsCount + 1));
        
        this.createTreasureElement(longestPath);
        this.createDoors(longestPath);

        for (var i = 0; i < this.keysCount; i++) {
            this.openDoor(longestPath[(i + 1) * spaceBetween]);
        }

        this.movePlayerTo(this.maze.mazeElements[this.playerPosition.y][this.playerPosition.x]);        
    };

    DiamondGame.prototype.start = function (container) {
        Game.prototype.start.call(this, container);
        var longestPath = this.maze.getLongestPath();
        this.movePlayerTo(longestPath[0]);

        this.createTreasureElement(longestPath);
        this.createDoors(longestPath);
    };

    /**
     *
     * @param {Room[]} longestPath
     */
    DiamondGame.prototype.createDoors = function (longestPath) {
        var doorsCount = this.questions.length,
            spaceBetween = Math.floor(longestPath.length / (doorsCount + 1)),
            i;

        for(i = 1; i <= doorsCount; i += 1) {
            this.createDoorElement(longestPath[i * spaceBetween]);
        }
    };

    DiamondGame.prototype.createDoorElement = function (room) {
        var element = document.createElement('div');
        element.classList.add('Maze_door');

        room.element.appendChild(element);
        room.setCallback(this.onEnterDoor);
    };

    /**
     *
     * @param {Room} room
     */
    DiamondGame.prototype.createOpenedDoorElement = function (room) {
        var element = document.createElement('div');
        element.classList.add('Maze_door_opened');

        room.element.appendChild(element);
    };

    /**
     *
     * @param {Room} room
     * @returns {boolean}
     */
    DiamondGame.prototype.onEnterDoor = function (room) {
            presenter.setQuestionHTML(this.questions[this.keysCount].question);
            presenter.showQuestionModal();

            var self = this;
            presenter.setOnQuestionApplyCallback(function (value) {
                if (value === self.questions[self.keysCount].answer) {
                    self.openDoor(room);
                    self.keysCount += 1;

                    presenter.openedDoor(self.keysCount);
                } else {
                    presenter.playerMistake();
                }

                presenter.hideQuestionModal();
            });
    };

    DiamondGame.prototype.openDoor = function (room) {
        var door = room.element.getElementsByClassName('Maze_door')[0];
        door.parentNode.removeChild(door);
        this.createOpenedDoorElement(room);
        room.removeCallback();
    }

    DiamondGame.prototype.createTreasureElement = function (longestPath) {
        longestPath[longestPath.length - 1].element.appendChild(this.treasureElement);
        longestPath[longestPath.length - 1].setCallback(this.onEnterTreasure);
    };

    DiamondGame.prototype.onEnterTreasure = function () {
        presenter.finishedMaze();
    };

    /**
     * @class
     * @param {Number} index
     *
     * @this Wall
     */
    function Wall (index) {
        this.index = index;

        this.state = this.STATES.close;
    }

    Wall.prototype.serialize = function () {
        return {
            state: this.state
        };
    };

    Wall.prototype.deserialize = function (obj) {
        this.state = obj.state;
    };

    /**
     * close this wall
     */
    Wall.prototype.close = function () {
        this.state = this.STATES.CLOSE;
    };

    Wall.prototype.open = function () {
        this.state = this.STATES.OPEN;
    };

    Wall.prototype.STATES = {
        OPEN: 1,
        CLOSE: 2
    };

    Wall.prototype.isClosed = function () {
        return this.state === this.STATES.CLOSE;
    };

    Wall.prototype.isOpened = function () {
        return this.state === this.STATES.OPEN;
    };

    /**
     * @class
     * 
     * @param {Number} index
     */
    function Room(index) {
        this.index = index;

        this.element = document.createElement('div');
        this.element.classList.add('Maze_Room_container');
        this.walls = document.createElement('div');
        this.element.appendChild(this.walls);
        this.element.classList.add('Maze_room');
        this.callback = null;
    }

    Room.prototype.serialize = function () {
        return {
        };
    };

    Room.prototype.deserialize = function (obj) {
    };

    Room.prototype.hasCallback = function () {
        return this.callback;
    };

    Room.prototype.getElement = function() {
        return this.element;
    };

    Room.prototype.addWallClass = function (className) {
        this.walls.classList.add(className);
    };

    Room.prototype.getWallsElement = function () {
        return this.walls;
    };

    Room.prototype.setCallback = function (callback) {
        this.callback = callback;
    };

    Room.prototype.removeCallback = function () {
        this.callback = null;
    };

    Room.prototype.setDotElement = function (rotation) {
        var dotDiv = document.createElement('div');
        dotDiv.classList.add('Maze_room_left_top_dot');

        rotateElement(dotDiv, rotation)
        this.getElement().appendChild(dotDiv);
    };

    /**
     * Helper for storing maze in memory as square
     */
    function Edge () {

    }

    Edge.prototype.serialize = function () {
        return {

        };
    };

    Edge.prototype.deserialize = function (obj) {

    };

    /**
     * @class
     *
     * @param {{width: Number, height: Number}} size
     * @param {Number} maxSize of maze in px
     * @this Maze
     *
     */
    function Maze (size, maxSize) {
        this.xSize = size.width;
        this.ySize = size.height;
        this.maxSize = maxSize;

        this.mazeElements = []; //All elements in maze. This is {Edge|Wall|Room}[y][x]

        this.mainDiv = document.createElement('div');
        this.mainDiv.className += ' Maze_main_container';

        /** @type {Wall[]} */
        this.walls = [];
        /**@type {Room[]} */
        this.rooms = [];
    }

    Maze.prototype.serialize = function () {
        var elements = [];

        this.mazeElements.forEach(function (row) {
            var rowElements = [];
            row.forEach(function(value) {
                rowElements.push(value.serialize());
            });

            elements.push(rowElements);
        });

        return {
            elements: elements
        };
    };

    Maze.prototype.deserialize = function (mazeObj) {
        this.getMazeElementsContainer().innerHTML = '';
        this.walls = [];
        this.rooms = [];
        this.mazeElements = [];
        this.buildStruct();

        var self = this;
        mazeObj.elements.forEach(function (rowObj, yIndex) {
            rowObj.forEach(function (value, xIndex) {
                self.mazeElements[yIndex][xIndex].deserialize(value);
            });
        });

        this.setValidClasses();
    };

    /**
     * Build structure of maze in memory
     */
    Maze.prototype.buildStruct = function () {
            var i;

            for (i = 0; i < this.ySize; i++) {
                this.buildWallsLine();
                this.buildRoomsLine();
            }

            this.buildWallsLine();
        };

    Maze.prototype.buildWallsLine = function () {
            var i,
                elements = [];

            for (i = 0; i < this.xSize; i++) {
                elements.push(new Edge());
                elements.push(this.buildWall());
            }

            elements.push(new Edge());

            this.mazeElements.push(elements);
    };

    Maze.prototype.buildRoomsLine = function () {
            var i,
                elements = [];

            for (i = 0; i < this.xSize; i++) {
                elements.push(this.buildWall());
                elements.push(this.buildRoom());
            }

            elements.push(this.buildWall());

            this.mazeElements.push(elements);
    };

    Maze.prototype.buildWall = function () {
            var wall = new Wall(this.walls.length);

            this.walls.push(wall);

            return wall;
    };

    Maze.prototype.buildRoom = function () {
            var room = new Room(this.rooms.length);

            this.rooms.push(room);
            this.getMazeElementsContainer().appendChild(room.getElement());

            return room;
    };

    Maze.prototype.algorithms = {
        PRIMS: Prims
    };

    Maze.prototype.getMazeElementsContainer = function () {
        return this.mazeElementsContainer;
    };

    /**
     * Generate new maze
     * @param {"PRIMS"} [algorithmName] name of algorithm which will generate maze
     */
    Maze.prototype.generate = function (algorithmName) {
        algorithmName = algorithmName || 'PRIMS';

        this.mazeElementsContainer = document.createElement('div');
        this.mazeElementsContainer.classList.add('Maze_game_elements_container');

        this.buildStruct();

        this.getElement().appendChild(this.mazeElementsContainer);

        //Call algorithm to build maze
        this.algorithms[algorithmName](this);

        this.setValidClasses();

    };

    /**
    * @returns {Number} count of walls in maze.
    */
    Maze.prototype.getWallsCount = function () {
        return this.walls.length;
    };

    /**
     * @returns {HTMLDivElement}
     */
    Maze.prototype.getElement = function () {
        return this.mainDiv;
    };

    /**
     * Set classes and styles for maze after generating valid maze.
     * Each maze cell is image with correct class name and rotation.
     * Sometimes cell contains single dot in corner to complete this corner.
     */
    Maze.prototype.setValidClasses = function () {
        var i;

        for (i = 0; i < this.rooms.length; i++) {
            var room = this.rooms[i];

            var percent = (100 / Math.max(this.xSize, this.ySize));
            room.getElement().style.width = Math.floor(this.maxSize * percent / 100) + 'px';
            room.getElement().style.height = Math.floor(this.maxSize * percent / 100) + 'px';

            if (i % this.xSize === 0) {
                room.getElement().style.clear = 'both';
            }

            var roomWalls = this.getRoomWalls(room);
            var matchedClass = this.getCorrectClass(roomWalls);

            room.addWallClass(matchedClass.className);

            rotateElement(room.getWallsElement(), matchedClass.rotation * -1);

            this.checkDotIsNeeded(1, 1, 0, room);
            this.checkDotIsNeeded(-1, 1, 90, room);
            this.checkDotIsNeeded(-1, -1, 180, room);
            this.checkDotIsNeeded(1, -1, 270, room);
        }
    };

    /**
     * Sometimes on connection between two walls is needed to put small image for valid display (in corner)
     * @param xSign {Number} check x position with positive sign or negative
     * @param ySign {Number} check y position with positive sign or negative
     * @param rotation {Number}
     * @param room {Room}
     */
    Maze.prototype.checkDotIsNeeded = function (xSign, ySign, rotation, room) {
        var roomPosition = this.getRoomPosition(room);

        if (this.mazeElements[roomPosition.y - (1 * ySign)] && this.mazeElements[roomPosition.y - (2 * ySign)]) {
                var leftWall = this.mazeElements[roomPosition.y - (1 * ySign)][roomPosition.x - (2 * xSign)];
                var topWall = this.mazeElements[roomPosition.y - (2 * ySign)][roomPosition.x - (1 * xSign)];
                if (leftWall && topWall && leftWall.isClosed() && topWall.isClosed()) {
                    room.setDotElement(rotation);
                }
            }
    };

    /**
     * Rotate received walls and try match it to predefined values. Returns the best matched class name and rotation.
     * Be sure that order is correct.
     * @param  {Wall[]} walls in order top, right, bottom, left
     */
    Maze.prototype.getCorrectClass = function (walls) {
        var quad = [true, true, true, true];
        var leftTopRight = [true, true, false, true];
        var leftTop = [true, false, false, true];
        var topBottom = [true, false, true, false];
        var top = [true, false, false, false];

        var matchers = [top, topBottom, leftTop, leftTopRight, quad];

        function match () {
            var i,
                j;
            for (i = matchers.length - 1; i >= 0 ; i--) {
                var matcher = matchers[i],
                    isMatched = true;
      
                for (j = 0; j < 4; j++) {
                    if (matcher[j] !== walls[j].isClosed()) {
                        isMatched = false;
                        break;
                    }
                }

                if (isMatched) {
                    return i;
                }
            }

            return false;
        }

        var matchedRotation = 0,
            bestMatch = -1,
            rotation;

        for (rotation = 0; rotation < 360; rotation += 90) {
            var matched = match();
            if (matched !== false && matched > bestMatch) {
                bestMatch = matched;
                matchedRotation = rotation;
            }

            var wall = walls.pop();
            walls.unshift(wall);
        }

        var classes = {
            4: 'Maze_room_image_top_left_right_bottom',
            3: 'Maze_room_image_top_left_right',
            2: 'Maze_room_image_top_left',
            1: 'Maze_room_image_top_bottom',
            0: 'Maze_room_image_top'
        };

        return {
            className: classes[bestMatch],
            rotation: matchedRotation
        };
    };

    /**Returns room walls in order: top, right, bottom, left
     * @returns  {Wall[]}
     */
    Maze.prototype.getRoomWalls = function (room) {
        var roomPosition = this.getRoomPosition(room);

        var top = this.mazeElements[roomPosition.y - 1][roomPosition.x];
        var left = this.mazeElements[roomPosition.y][roomPosition.x - 1];
        var bottom = this.mazeElements[roomPosition.y + 1][roomPosition.x];
        var right = this.mazeElements[roomPosition.y][roomPosition.x + 1];

        return [top, right, bottom, left];
    };

    /**
     * Get room position in maze.
     * @param {Room} room 
     */
    Maze.prototype.getRoomPosition = function (room) {
        var roomXPosition = room.index % this.xSize,
            roomYPosition = ~~(room.index / this.xSize);

        var roomYPositionInElements = (roomYPosition * 2) + 1,
            roomXPositionInElements = (roomXPosition * 2) + 1;

        return {
            y: roomYPositionInElements,
            x: roomXPositionInElements
        };
    };

    /**Will return all neighbors
     * @param  {Room} room
     */
    Maze.prototype.getRoomNeigh = function (room) {
        var roomPosition = this.getRoomPosition(room);

        var roomYPositionInElements = roomPosition.y,
            roomXPositionInElements = roomPosition.x;

        var neigh = [];

        if (roomXPositionInElements - 2 > 0) {
            neigh.push(this.mazeElements[roomYPositionInElements][roomXPositionInElements - 2]);
        }

        if (roomYPositionInElements - 2 > 0) {
            neigh.push(this.mazeElements[roomYPositionInElements - 2][roomXPositionInElements]);
        }    

        if (roomXPositionInElements + 2 < this.mazeElements[0].length) {
            neigh.push(this.mazeElements[roomYPositionInElements][roomXPositionInElements + 2]);
        } 

        if (roomYPositionInElements + 2 < this.mazeElements.length) {
            neigh.push(this.mazeElements[roomYPositionInElements + 2][roomXPositionInElements]);
        } 

        return neigh;
    };

    /**
     * @param  {Room} roomA
     * @param  {Room} roomB
     */
    Maze.prototype.openWallBetween = function (roomA, roomB) {
        var roomAPosition = this.getRoomPosition(roomA),
            roomBPosition = this.getRoomPosition(roomB);

        var wallXPosition = roomAPosition.x - (roomAPosition.x - roomBPosition.x) / 2,
            wallYPosition = roomAPosition.y - (roomAPosition.y- roomBPosition.y) / 2;

        this.mazeElements[wallYPosition][wallXPosition].open();
    };

    Maze.prototype.isOpenedBetween = function (roomA, roomB) {
        var roomAPosition = this.getRoomPosition(roomA),
            roomBPosition = this.getRoomPosition(roomB);

        var wallXPosition = roomAPosition.x - (roomAPosition.x - roomBPosition.x) / 2,
            wallYPosition = roomAPosition.y - (roomAPosition.y- roomBPosition.y) / 2;

        return this.mazeElements[wallYPosition][wallXPosition].isOpened();
    };

    /**
     * Get longest path in maze.
     * Algorithm: get random element and find longest path from it. Get last element from that longest path and find next longest path which is longest path in maze
     * @returns {Array}
     */
    Maze.prototype.getLongestPath = function () {
        var self = this;
        var bestAnswer = [];
        function dfs(room, from, answer) {
            answer.push(room);

            var neigh = self.getRoomNeigh(room).filter(function (element) {
                return self.isOpenedBetween(room, element);
            });

            neigh.forEach(function (element) {
                if (element !== from) {
                    dfs(element, room, answer.slice());
                }
            });

            if (neigh.length === 1) {
                if (answer.length > bestAnswer.length) {
                    bestAnswer = answer;
                }
            }
        }
        var room = this.rooms[0];

        dfs(room, null, []);
        room = bestAnswer[bestAnswer.length - 1];

        bestAnswer = [];
        dfs(room, null, []);

        return bestAnswer;
    };

    function getRandomIndex (array) {
        return Math.floor(Math.random() * array.length);
    }

    /**http://weblog.jamisbuck.org/2011/1/10/maze-generation-prim-s-algorithm
     * @param  {Maze} maze
     */
    function Prims (maze) {
        var roomsList = [];
        var selected = [];

        function initialize () {
            var i;

            for (i = 0; i < maze.getWallsCount(); i++) {
                maze.walls[i].close();
            }

            var neigh = maze.getRoomNeigh(maze.rooms[0]);
            roomsList = roomsList.concat(neigh);
            selected.push(maze.rooms[0]);
        }

        initialize();

        while (roomsList.length !== 0) {
            var roomIndex = getRandomIndex(roomsList);
            var room = roomsList.splice(roomIndex, 1)[0];
            var roomNeigh = maze.getRoomNeigh(room);
            var selectedNeight = [];

            roomNeigh.forEach(function (element) {
                if (selected.indexOf(element) === -1) {
                    if (roomsList.indexOf(element) === -1) {
                        roomsList.push(element);
                    }
                } else {
                    selectedNeight.push(element);
                }
            });

            var connectWithIndex = getRandomIndex(selectedNeight);
            maze.openWallBetween(room, selectedNeight[connectWithIndex]);
            selected.push(room);

        }

    }

    return presenter;
}
