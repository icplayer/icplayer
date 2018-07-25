// No tests yet. Test case added for consistency purposes
TestCase("[Maze] Model validation", {
    setUp: function() {
        this.presenter = AddonMaze_create();

        this.validModel = {
            mazeWidth: "20",
            mazeHeight: "20",
            Width: "100",
            Height: "200",
            numberOfMazes: "2",
            gameMode: 'doors',
            "Is Visible": "False",
            questions: [
                {
                    question: "question 1",
                    answer: "answer 1",
                    letter: "A",
                    mazeId: "1",
                    isCaseSensitive: "False"
                }, {
                    question: "question 2",
                    answer: "answer 2",
                    letter: "B",
                    mazeId: "1",
                    isCaseSensitive: "False"
                }, {
                    question: "question 1a",
                    answer: "answer 1a",
                    letter: "A",
                    mazeId: "2",
                    isCaseSensitive: "True"
                }
            ],
            translations: {
                'endGame': {'translation': 'a'},
                'applyQuestion': {'translation': 'b'},
                'nextMazeButton': {'translation':'c'},
                'solutionText': {'translation': 'd'},
                'upButton': {'translation': 'e'},
                'leftButton': {'translation': 'f'},
                'rightButton': {'translation': 'g'},
                'downButton': {'translation': 'h'},
                'loose': {'translation': 'j'},
                'looseButton': {'translation': 'k'}
            },
            isDisabled: "True",
            hideControlPanel: "True",
            ID: "id"
        };
    },
    
    'test validate model returns valid model': function() {
        var expected = {
            "gameMode": "doors",
            "isVisible": false,
            "Is Visible": false,
            "mazeWidth": 20,
            "mazeHeight": 20,
            "Width": 100,
            "Height": 200,
            "numberOfMazes": 2,
            "gameType": 1,
            "questions": [
                [{
                    "question": "question 1",
                    "answer": "answer 1",
                    "letter": undefined,
                    "isCaseSensitive": false,
                    "mazeId": 1
                }, {
                    "question": "question 2",
                    "answer": "answer 2",
                    "letter": undefined,
                    "isCaseSensitive": false,
                    "mazeId": 1
                }],
                [{
                    "question": "question 1a",
                    "answer": "answer 1a",
                    "letter": undefined,
                    "isCaseSensitive": true,
                    "mazeId": 2
                }]
            ],
            translations: {
                'endGame': {'translation': 'a'},
                'applyQuestion': {'translation': 'b'},
                'nextMazeButton': {'translation':'c'},
                'solutionText': {'translation': 'd'},
                'upButton': {'translation': 'e'},
                'leftButton': {'translation': 'f'},
                'rightButton': {'translation': 'g'},
                'downButton': {'translation': 'h'},
                'loose': {'translation': 'j'},
                'looseButton': {'translation': 'k'}
            },
            "hideControlPanel": true,
            "isDisabled": true,
            "ID": "id"
        };

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(expected, conf.value);
    },

    'test wrong width returns validation error': function () {
        this.validModel.mazeWidth = "0";

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(false, conf.isValid);
    },

    'test wrong height return validation error': function () {
        this.validModel.mazeHeight = "a";

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(false, conf.isValid);
    },

    'test width below 5 returns validation error': function () {
        this.validModel.mazeWidth = "4";

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(false, conf.isValid);
    },

    'test height below 5 returns validation error': function () {
        this.validModel.mazeHeight = "4";

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(false, conf.isValid);
    },

    'test wrong maze if returns validation error': function () {
        this.validModel.questions[0].mazeId = '-1';

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(false, conf.isValid);
    },

    'test empty number of mazes returns value 1': function () {
        this.validModel.numberOfMazes = '';

        var conf = this.presenter.validateModel(this.validModel);

        assertTrue(conf.isValid);
        assertEquals(1, conf.value.numberOfMazes);
    },

    'test wrong number of mazes returns validation error' : function () {
        this.validModel.numberOfMazes = '-1';

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(false, conf.isValid);
    }
});