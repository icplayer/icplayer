function AddonMaze_create () {
    var presenter = function () {};

    presenter.ERROR_MESSAGES = {
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

            var a = new Maze(10, 10);
            a.generate();
        }

        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.connectHandlers = function () {
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.validateModel = function (model) {

        return {
            isValid: true,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
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

    Wall.prototype.STATES = {
        OPEN: 1,
        CLOSE: 2
    };

    /**
     * @class
     * 
     * @param {Number} index
     */
    function Room(index) {
        this.index = index;
    }

    function Edge () {

    }

    /**
     * @class
     *
     * @param {Number} xSize
     * @param {Number} ySize
     *
     * @this Maze
     *
     */
    function Maze (xSize, ySize) {
        this.xSize = xSize;
        this.ySize = ySize;

        this.mazeElements = [];

        /** @type {Wall[]} */
        this.walls = [];
        /**@type {Room[]} */
        this.rooms = [];

        this.buildStruct();
    }

    Maze.prototype = {
        buildStruct: function () {
            var i;

            for (i = 0; i < this.ySize; i++) {
                this.buildWallsLine();
                this.buildRoomsLine();
            }

            this.buildWallsLine();
        },

        buildWallsLine: function () {
            var i,
                elements = [];

            for (i = 0; i < this.xSize; i++) {
                wall = this.buildWall();

                elements.push(new Edge());
                elements.push(this.buildWall());
            }

            elements.push(new Edge());

            this.mazeElements.push(elements);
        },

        buildRoomsLine: function () {
            var i,
                elements = [];

            for (i = 0; i < this.xSize; i++) {
                elements.push(this.buildWall());
                elements.push(this.buildRoom());
            }

            elements.push(this.buildWall());

            this.mazeElements.push(elements);
        },

        buildWall: function () {
            var wall = new Wall(this.walls.length);

            this.walls.push(wall);

            return wall;
        },

        buildRoom: function () {
            var room = new Room(this.rooms.length);

            this.rooms.push(room);

            return room;
        }
    }

    Maze.prototype.algorithms = {
        PRIMS: Prims
    };

    /**
     * Generate new maze
     * @param {"PRIMS"} [algorithmName] name of algorithm which will generate maze
     */
    Maze.prototype.generate = function (algorithmName) {
        algorithmName = algorithmName || "PRIMS";

        //Call alghoritm to build maze
        this.algorithms[algorithmName](this);
    };

    /**
    * @returns {Number} count of walls in maze.
    */
    Maze.prototype.getWallsCount = function () {
        return this.walls.length;
    };
    /**
     * @param  {Room} room
     */
    Maze.prototype.getRoomWalls = function (room) {
        var roomXPosition = room.index % this.xSize,
            roomYPosition = room.index / this.xSize;

        var roomYPositionInElements = (roomYPosition * 2) + 1,
            roomXPositionInElements = (roomXPosition * 2) + 1;

        var room = this.mazeElements[roomYPositionInElements][roomXPositionInElements];
        debugger;
    };

    /**
     * @param  {Maze} maze
     */
    function Prims (maze) {
        var wallsList = [];

        function initialize () {
            var i = 0;

            for (i = 0; i < maze.getWallsCount(); i++) {
                maze.walls[i].close();
            }

            var walls = maze.getRoomWalls(maze.rooms[0]);
        }

        initialize();

    }

    return presenter;
}
