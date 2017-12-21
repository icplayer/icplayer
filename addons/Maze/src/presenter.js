function AddonMaze_create () {
    var presenter = function () {};

    presenter.ERROR_MESSAGES = {
        "WW01": "Width must be positive integer",
        "WH01": "Height must be positive integer",
        "WC01": "Number of mazes must be positive integer",
        "WN01": "Labyrinth number must be positive integer"
    };

    presenter.state = {
        games: [],
        actualGameIndex: 0
    };

    presenter.GAME_TYPES = {
        "DIAMOND": 1,
        "LETTERS": 2
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

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.destroy = function () {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
    };

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
            presenter.connectHandlers();
            var gameContainer = view.getElementsByClassName('Maze-wrapper-game-container')[0];
            var i,
                minSize = Math.min(gameContainer.offsetWidth, gameContainer.offsetHeight);

            for (i = 0; i < presenter.configuration.numberOfMazes; i += 1) {
                if (presenter.configuration.gameType === presenter.GAME_TYPES.DIAMOND) {
                    var diamond = new DiamondGame(presenter.configuration.labyrinthSize, minSize, presenter.configuration.questions[i] || []);
                    presenter.state.games.push(diamond);
                }
            }

            presenter.getActualGame().start(gameContainer);
        }

        presenter.setVisibility(presenter.configuration.isVisible);
    };

    /**@returns {Game}
     */
    presenter.getActualGame = function () {
        return presenter.state.games[presenter.state.actualGameIndex];
    };

    presenter.onUpButtonClick = function () {
        presenter.getActualGame().goUp();
    };

    presenter.onDownButtonClick = function () {
        presenter.getActualGame().goDown();
    };

    presenter.onLeftButtonClick = function () {
        presenter.getActualGame().goLeft();
    };

    presenter.onRightButtonClick = function () {
        presenter.getActualGame().goRight();
    };

    presenter.connectHandlers = function () {
        presenter.view.getElementsByClassName('Maze-wrapper-menu-controls-up')[0].addEventListener('click', presenter.onUpButtonClick);
        presenter.view.getElementsByClassName('Maze-wrapper-menu-controls-left')[0].addEventListener('click', presenter.onLeftButtonClick);
        presenter.view.getElementsByClassName('Maze-wrapper-menu-controls-down')[0].addEventListener('click', presenter.onDownButtonClick);
        presenter.view.getElementsByClassName('Maze-wrapper-menu-controls-right')[0].addEventListener('click', presenter.onRightButtonClick);
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    function generateValidationError(errorCode) {
        return {
            isValid: false,
            errorCode: errorCode
        };
    }

    presenter.validateLabyrinthSize = function (model) {
        var validatedWidth = ModelValidationUtils.validatePositiveInteger(model.width);
        var validatedHeight = ModelValidationUtils.validatePositiveInteger(model.height);

        if (!validatedHeight.isValid) {
            return generateValidationError("WH01");
        }

        if (!validatedWidth.isValid) {
            return generateValidationError("WW01");
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
            return generateValidationError("WC01");
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
                return generateValidationError("WN01");
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
            model.gameMode = "diamond";
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
            questions: validatedQuestions.value
        };
    };

    presenter.getState = function () {
        return JSON.stringify({
        });
    };

    presenter.setState = function (state) {
        var object = JSON.parse(state);
    };

    presenter.reset = function () {
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
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
    /**
     * @param  {HTMLDivElement} container
     */
    Game.prototype.start = function (container) {
        this.maze.generate();

        container.appendChild(this.maze.getElement());
    };

    /**
     * @param {Room }room
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
     *
     * @param {Room} room
     */
    Game.prototype.checkRoomCallback = function (room) {
        if (room.callback) {
            return room.callback.call(this, room);
        }

        return true;
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
            spaceBetween = ~~(longestPath.length / (doorsCount + 1)),
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
        if (this.keysCount > 0) {
            this.keysCount -= 1;

            room.removeCallback();

            var door = room.element.getElementsByClassName('Maze_door')[0];
            door.parentNode.removeChild(door);

            this.createOpenedDoorElement(room);

            return true;
        } else {
            return false;
        }
    };

    DiamondGame.prototype.createTreasureElement = function (longestPath) {
        longestPath[longestPath.length - 1].element.appendChild(this.treasureElement);
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

    Room.prototype.getElement = function() {
        return this.element;
    };

    Room.prototype.addWallClass = function (className) {
        this.walls.classList.add(className);
    };

    Room.prototype.setCallback = function (callback) {
        this.callback = callback;
    };

    Room.prototype.removeCallback = function () {
        this.callback = null;
    };

    function Edge () {

    }

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

        this.mazeElements = [];

        this.mainDiv = document.createElement('div');
        this.mainDiv.className += ' Maze_main_container';

        /** @type {Wall[]} */
        this.walls = [];
        /**@type {Room[]} */
        this.rooms = [];

        this.buildStruct();
    }

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
            this.mainDiv.appendChild(room.getElement());

            return room;
    };

    Maze.prototype.algorithms = {
        PRIMS: Prims
    };

    /**
     * Generate new maze
     * @param {"PRIMS"} [algorithmName] name of algorithm which will generate maze
     */
    Maze.prototype.generate = function (algorithmName) {
        algorithmName = algorithmName || "PRIMS";

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

    Maze.prototype.setValidClasses = function () {
        var i;

        for (i = 0; i < this.rooms.length; i++) {
            var room = this.rooms[i];

            var percent = (100 / Math.max(this.xSize, this.ySize));
            room.getElement().style.width = Math.floor(this.maxSize * percent / 100) + "px";
            room.getElement().style.height = Math.floor(this.maxSize * percent / 100) + "px";

            if (i % this.xSize === 0) {
                room.getElement().style.clear = "both";
            }

            var roomWalls = this.getRoomWalls(room);
            var matchedClass = this.getCorrectClass(roomWalls);

            room.addWallClass(matchedClass.className);

            room.getElement().style.webkitTransform = 'rotate(-' + matchedClass.rotation + 'deg)'; 
            room.getElement().style.mozTransform    = 'rotate(-' + matchedClass.rotation + 'deg)'; 
            room.getElement().style.msTransform     = 'rotate(-' + matchedClass.rotation + 'deg)'; 
            room.getElement().style.oTransform      = 'rotate(-' + matchedClass.rotation + 'deg)'; 
            room.getElement().style.transform       = 'rotate(-' + matchedClass.rotation + 'deg)'; 
        }
    };
    /**
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
            4: "Maze_room_image_top_left_right_bottom",
            3: "Maze_room_image_top_left_right",
            2: "Maze_room_image_top_left",
            1: "Maze_room_image_top_bottom",
            0: "Maze_room_image_top"
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

    /**
     * @param  {Maze} maze
     */
    function Prims (maze) {
        var roomsList = [];
        var selected = [];

        function initialize () {
            var i = 0;

            for (i = 0; i < maze.getWallsCount(); i++) {
                maze.walls[i].close();
            }

            var neigh = maze.getRoomNeigh(maze.rooms[0]);
            roomsList = roomsList.concat(neigh);
            selected.push(maze.rooms[0]);
        }

        function getRandomRoomIndex (array) {
            return Math.floor(Math.random() * array.length);
        }

        initialize();

        while (roomsList.length !== 0) {
            var roomIndex = getRandomRoomIndex(roomsList);
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

            var connectWithIndex = getRandomRoomIndex(selectedNeight);
            maze.openWallBetween(room, selectedNeight[connectWithIndex]);
            selected.push(room);

        }

    }

    return presenter;
}
