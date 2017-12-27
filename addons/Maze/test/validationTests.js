// No tests yet. Test case added for consistency purposes
TestCase("Model validation", {
    setUp: function() {
        this.presenter = AddonMaze_create();

        this.validModel = {
            width: "20",
            height: "20",
            Width: "100",
            Height: "200",
            numberOfMazes: "2",
            gameMode: 'Diamond',
            questions: [
                {
                    question: "question 1",
                    answer: "answer 1",
                    letter: "A",
                    mazeId: "1"
                }, {
                    question: "question 2",
                    answer: "answer 2",
                    letter: "B",
                    mazeId: "1"
                }, {
                    question: "question 1a",
                    answer: "answer 1a",
                    letter: "A",
                    mazeId: "2"
                }
            ],
            isDisabled: "True",
            hideControlPanel: "True",
            ID: "id"
        };
    },
    
    'test validate model returns valid model': function() {
        var expected = {
            "isValid": true,
            "isVisible": false,
            "labyrinthSize": {
                "width": 20,
                "height": 20 
            },
            "addonSize": {
                "width": 100,
                "height": 200
            },
            "numberOfMazes": 2,
            "gameType": 1,
            "questions": [
                [{
                    "question": "question 1",
                    "answer": "answer 1",
                    "letter": "A"
                }, {
                    "question": "question 2",
                    "answer": "answer 2",
                    "letter": "B"
                }],
                [{
                    "question": "question 1a",
                    "answer": "answer 1a",
                    "letter": "A"
                }]
            ],
            "hideControlPanel": true,
            "isDisabled": true,
            "addonID": "id"
        };

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(expected, conf);
    },

    'test wrong width returns validation error': function () {
        this.validModel.width = "0";

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(false, conf.isValid);
    },

    'test wrong height return validation error': function () {
        this.validModel.height = "a";

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(false, conf.isValid);
    },

    'test width below 5 returns validation error': function () {
        this.validModel.width = "4";

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(false, conf.isValid);
    },

    'test height below 5 returns validation error': function () {
        this.validModel.height = "4";

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

        assertEquals(1, conf.numberOfMazes);
    },

    'test wrong number of mazes returns validation error' : function () {
        this.validModel.numberOfMazes = '-1';

        var conf = this.presenter.validateModel(this.validModel);

        assertEquals(false, conf.isValid);
    }
});