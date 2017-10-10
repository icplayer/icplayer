TestCase("[Shooting_Range - model validation] validateModel", {
    setUp: function() {
        this.presenter = AddonShooting_Range_create();
        this.definitionMockup = {
            "definition": "def",
            "answer1": "some",
            "answer2": "answer",
            "answer3": "is",
            "correct_answers": "1,2"
        };

        this.definitionMockup2 = {
            "definition": "def2",
            "answer1": "some",
            "answer2": "answer",
            "answer3": "is",
            "correct_answers": "1-3"
        };

        this.model = {
            'initial_time_for_answer': "0.4",
            'time_for_last_answer': "0.02",
            'definitions': [this.definitionMockup, this.definitionMockup2],
            'Is Visible': "True",
            'ID': "someID"
        };
    },

    'test validateModel Will Return All Values': function () {
        var expected = {
            isValid: true,
            'addonID': "someID",
            'initialTimeForAnswer': 0.4,
            'timeForLastAnswer': 0.02,
            'isVisibleByDefault': true,
            gameMode: this.presenter.GAME_MODE.QUESTIONS,
            definitions: [{
                isValid: true,
                answers: ["some", "answer", "is"],
                definition: "def",
                correctAnswers: [0, 1],
                gameMode: this.presenter.GAME_MODE.QUESTIONS
            }, {
                isValid: true,
                answers: ["some", "answer", "is"],
                definition: "def2",
                correctAnswers: [0, 1, 2],
                gameMode: this.presenter.GAME_MODE.QUESTIONS
            }]
        };

        var validatedModel = this.presenter.validateModel(this.model);

        assertEquals(expected, validatedModel);
    }
});

TestCase("[Shooting_Range - model validation] initial_time_for_answer property", {
    setUp: function() {
        this.presenter = AddonShooting_Range_create();
    },

    'test initial_time_for_answer must be positive float' : function () {
        var validatedValue = this.presenter.validateInitialTimeForAnswer({
            'initial_time_for_answer': "0.3"
        });

        assertTrue("Validated value is not valid", validatedValue["isValid"]);
        assertEquals("Validated value is not equals", 0.3, validatedValue["initialTimeForAnswer"]);
    },

    'test negative value in initial_time_for_answer will returns validation error': function () {
        var validatedValue = this.presenter.validateInitialTimeForAnswer({
            'initial_time_for_answer': "-0.3"
        });

        assertFalse("Validated value is not valid", validatedValue["isValid"]);
    },

    'test zero is not valid value': function () {
        var validatedValue = this.presenter.validateInitialTimeForAnswer({
            'initial_time_for_answer': "0"
        });

        assertFalse("Validated value is not valid", validatedValue["isValid"]);
    }
});

TestCase("[Shooting_Range - model validation] time_for_last_answer property", {
    setUp: function() {
        this.presenter = AddonShooting_Range_create();
    },

    'test time_for_last_answer must be positive float' : function () {
        var validatedValue = this.presenter.validateTimeForLastAnswer({
            'time_for_last_answer': "0.3"
        });

        assertTrue("Validated value is not valid", validatedValue["isValid"]);
        assertEquals("Validated value is not equals", 0.3, validatedValue["timeForLastAnswer"]);
    },

    'test negative value in time_for_last_answer will returns validation error': function () {
        var validatedValue = this.presenter.validateTimeForLastAnswer({
            'time_for_last_answer': "-0.3"
        });

        assertFalse("Validated value is not valid", validatedValue["isValid"]);
    },

    'test zero is not valid value': function () {
        var validatedValue = this.presenter.validateTimeForLastAnswer({
            'time_for_last_answer': "0"
        });

        assertFalse("Validated value is not valid", validatedValue["isValid"]);
    }
});

TestCase("[Shooting_Range - model validation] game mode", {
    setUp: function() {
        this.presenter = AddonShooting_Range_create();
    },

    'test if lastMode is undefined then will return newMode' : function () {
        var mode = this.presenter.validateGameMode(this.presenter.GAME_MODE.UNDEFINED, this.presenter.GAME_MODE.QUESTIONS);

        assertTrue(mode.isValid);
        assertEquals(this.presenter.GAME_MODE.QUESTIONS, mode.gameMode);

        mode = this.presenter.validateGameMode(this.presenter.GAME_MODE.UNDEFINED, this.presenter.GAME_MODE.SPEED_ATTACK);

        assertTrue(mode.isValid);
        assertEquals(this.presenter.GAME_MODE.SPEED_ATTACK, mode.gameMode);
    },

    'test if lastMode is not UNDEFINED and is different from newMode will return error': function () {
        var mode = this.presenter.validateGameMode(this.presenter.GAME_MODE.SPEED_ATTACK, this.presenter.GAME_MODE.QUESTIONS);
        assertFalse(mode.isValid);

        mode = this.presenter.validateGameMode(this.presenter.GAME_MODE.QUESTIONS, this.presenter.GAME_MODE.SPEED_ATTACK);
        assertFalse(mode.isValid);
    },

    'test if mode is the same then game mode validation will return mode': function () {
        var mode = this.presenter.validateGameMode(this.presenter.GAME_MODE.SPEED_ATTACK, this.presenter.GAME_MODE.SPEED_ATTACK);
        assertTrue(mode.isValid);
        assertEquals(this.presenter.GAME_MODE.SPEED_ATTACK, mode.gameMode);

        mode = this.presenter.validateGameMode(this.presenter.GAME_MODE.QUESTIONS, this.presenter.GAME_MODE.QUESTIONS);
        assertTrue(mode.isValid);
        assertEquals(this.presenter.GAME_MODE.QUESTIONS, mode.gameMode);
    }
});

TestCase("[Shooting_Range - model validation] validateCorrectAnswers", {
    setUp: function() {
        this.presenter = AddonShooting_Range_create();
    },

    'test if correct answers is empty then validation returns empty array': function () {
        var correctAnswers = this.presenter.validateCorrectAnswers("");

        assertTrue(correctAnswers.isValid);
        assertEquals([], correctAnswers.correctAnswers);
    },

    'test correct answer separated by comma is properly parsed': function () {
        var correctAnswers = this.presenter.validateCorrectAnswers("1, 2, 3");

        assertTrue(correctAnswers.isValid);
        assertEquals([0, 1, 2], correctAnswers.correctAnswers);

        correctAnswers = this.presenter.validateCorrectAnswers("2");

        assertTrue(correctAnswers.isValid);
        assertEquals([1], correctAnswers.correctAnswers);
    },

    'test correct answer separated by comma is sorted': function () {
        var correctAnswers = this.presenter.validateCorrectAnswers("3, 1, 2");

        assertTrue(correctAnswers.isValid);
        assertEquals([0, 1, 2], correctAnswers.correctAnswers);
    },

    'test correct answer separated by comma remove duplicates': function () {
        var correctAnswers = this.presenter.validateCorrectAnswers("3, 1, 2, 2");

        assertTrue(correctAnswers.isValid);
        assertEquals([0, 1, 2], correctAnswers.correctAnswers);
    },

    'test if correct answer separated by comma is out of range then return validation error': function () {
        var correctAnswers = this.presenter.validateCorrectAnswers("3, 1, 2, 4");
        assertFalse(correctAnswers.isValid);

        correctAnswers = this.presenter.validateCorrectAnswers("0");
        assertFalse(correctAnswers.isValid);
    },

    'test correct answer passed as range is properly validated': function () {
        var correctAnswers = this.presenter.validateCorrectAnswers("1-2");
        assertTrue(correctAnswers.isValid);
        assertEquals([0, 1], correctAnswers.correctAnswers);

        correctAnswers = this.presenter.validateCorrectAnswers("3-3");
        assertTrue(correctAnswers.isValid);
        assertEquals([2], correctAnswers.correctAnswers);
    },

    'test if correct answer passed as range is out of range then return validation error': function () {
        var correctAnswers = this.presenter.validateCorrectAnswers("0-3");
        assertFalse(correctAnswers.isValid);

        correctAnswers = this.presenter.validateCorrectAnswers("2-4");
        assertFalse(correctAnswers.isValid);
    }
});

TestCase("[Shooting_Range - model validation] validateDefinition", {
    setUp: function() {
        this.presenter = AddonShooting_Range_create();
        this.definitionMockup = {
            "definition": "def",
            "answer1": "some",
            "answer2": "answer",
            "answer3": "is",
            "correct_answers": "1,2"
        }
    },

    'test definition is properly validated': function () {
        var validatedDefinition = this.presenter.validateDefinition(this.definitionMockup);

        var expected = {
            isValid: true,
            answers: ["some", "answer", "is"],
            definition: "def",
            correctAnswers: [0, 1],
            gameMode: this.presenter.GAME_MODE.QUESTIONS
        };

        assertEquals(expected, validatedDefinition);

        expected.gameMode = this.presenter.GAME_MODE.SPEED_ATTACK;
        expected.definition = "";
        this.definitionMockup.definition = "";

        validatedDefinition = this.presenter.validateDefinition(this.definitionMockup);

        assertEquals(expected, validatedDefinition);
    },

    'test if one of answers is empty then will be validation error': function () {
        var newMock = this.definitionMockup;
        newMock.answer1 = "";

        var validatedDefinition = this.presenter.validateDefinition(newMock);

        assertFalse(validatedDefinition.isValid);

        newMock = this.definitionMockup;
        newMock.answer2 = "";

        validatedDefinition = this.presenter.validateDefinition(newMock);

        assertFalse(validatedDefinition.isValid);

        newMock = this.definitionMockup;
        newMock.answer3 = "";

        validatedDefinition = this.presenter.validateDefinition(newMock);

        assertFalse(validatedDefinition.isValid);
    },

    'test definition property with empty html tags should be treated as empty': function () {
        this.definitionMockup = {
            "definition": "<br/>",
            "answer1": "some",
            "answer2": "answer",
            "answer3": "is",
            "correct_answers": "1,2"
        };

        var validatedDefinition = this.presenter.validateDefinition(this.definitionMockup);

        assertTrue(validatedDefinition.isValid);
        assertEquals("", validatedDefinition.definition);
    }
});

TestCase("[Shooting_Range - model validation] validateDefinitions", {
    setUp: function() {
        this.presenter = AddonShooting_Range_create();
        this.definitionMockup = {
            "definition": "def",
            "answer1": "some",
            "answer2": "answer",
            "answer3": "is",
            "correct_answers": "1,2"
        };

        this.definitionMockup2 = {
            "definition": "def2",
            "answer1": "some",
            "answer2": "answer",
            "answer3": "is",
            "correct_answers": "1-3"
        };

    },
    'test definitions will be properly validated': function () {
        var definitions = [this.definitionMockup, this.definitionMockup2];

        var expected = {
            isValid:true,
            gameMode: this.presenter.GAME_MODE.QUESTIONS,
            definitions: [{
            isValid: true,
            answers: ["some", "answer", "is"],
            definition: "def",
            correctAnswers: [0, 1],
            gameMode: this.presenter.GAME_MODE.QUESTIONS
        }, {
            isValid: true,
            answers: ["some", "answer", "is"],
            definition: "def2",
            correctAnswers: [0, 1, 2],
            gameMode: this.presenter.GAME_MODE.QUESTIONS
        }]};

        var validatedDefinitions = this.presenter.validateDefinitions({definitions: definitions});

        assertTrue(validatedDefinitions.isValid);
        assertEquals(expected, validatedDefinitions);

        this.definitionMockup.definition = "";
        this.definitionMockup2.definition = "";
        definitions = [this.definitionMockup, this.definitionMockup2];

        expected = {
            isValid:true,
            gameMode: this.presenter.GAME_MODE.SPEED_ATTACK,
            definitions: [{
            isValid: true,
            answers: ["some", "answer", "is"],
            definition: "",
            correctAnswers: [0, 1],
            gameMode: this.presenter.GAME_MODE.SPEED_ATTACK
        }, {
            isValid: true,
            answers: ["some", "answer", "is"],
            definition: "",
            correctAnswers: [0, 1, 2],
            gameMode: this.presenter.GAME_MODE.SPEED_ATTACK
        }]};

        validatedDefinitions = this.presenter.validateDefinitions({definitions: definitions});
        assertTrue(validatedDefinitions.isValid);
        assertEquals(expected, validatedDefinitions);
    },

    'test definitions with different games mode returns validation error': function () {
        this.definitionMockup.definition = "";
        var definitions = [this.definitionMockup, this.definitionMockup2];

        var validatedDefinitions = this.presenter.validateDefinitions({definitions: definitions});

        assertFalse(validatedDefinitions.isValid);
    }
});
