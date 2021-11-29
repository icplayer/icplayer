TestCase("[Quiz] Model upgrades - add langAttribute", {
    setUp: function () {
        this.presenter = AddonQuiz_create();
        var question = {
            Question: 'What?',
            CorrectAnswer: 'OK',
            WrongAnswer1: 'WrongAnswer',
            WrongAnswer2: 'WrongAnswer',
            WrongAnswer3: 'WrongAnswer',
            Hint: 'Hint',
        }
        this.model = {
            'Is Visible': 'True',
            'ShowHelpButtons': 'False',
            'Questions': [question],
            'isActivity': "True",
        };
        this.langAttributeLabel = 'langAttribute'
    },

    'test langAttribute undefined': function () {
        var upgradedModel = this.presenter.addLangTag(this.model);

        assertNotUndefined(upgradedModel[this.langAttributeLabel]);
        assertEquals("", upgradedModel[this.langAttributeLabel]);
    },

    'test langAttribute already defined': function () {
        this.model[this.langAttributeLabel] = "it-IT";

        var upgradedModel = this.presenter.addLangTag(this.model);

        assertNotUndefined(upgradedModel[this.langAttributeLabel]);
        assertEquals("it-IT", upgradedModel[this.langAttributeLabel]);
    },
});

TestCase("[Quiz] Model upgrades - add speechTexts", {
    setUp: function () {
        this.presenter = AddonQuiz_create();
        var question = {
            Question: 'What?',
            CorrectAnswer: 'OK',
            WrongAnswer1: 'WrongAnswer',
            WrongAnswer2: 'WrongAnswer',
            WrongAnswer3: 'WrongAnswer',
            Hint: 'Hint',
        }
        this.model = {
            'Is Visible': 'True',
            'ShowHelpButtons': 'False',
            'Questions': [question],
            'isActivity': "True",
        };
        this.speachTextLabel = 'speechTexts'
    },

    validateSpeechTextValue: function (upgradedModel, label, expectedValue) {
        assertNotUndefined(upgradedModel[this.speachTextLabel][label]);
        assertEquals(expectedValue, upgradedModel[this.speachTextLabel][label][label]);
    },

    'test speechTexts undefined': function () {
        var upgradedModel = this.presenter.addSpeechTexts(this.model);

        const expectedValue = {
            Question: {Question: ""},
            Answer: {Answer: ""},
            FiftyFiftyButton: {FiftyFiftyButton: ""},
            FiftyFiftyButtonWhenNotEnoughAnswers:
                {FiftyFiftyButtonWhenNotEnoughAnswers: ""},
            HintButton: {HintButton: ""},
            CommentField: {CommentField: ""},
            Hint: {Hint: ""},
            Summary: {Summary: ""},
            Selected: {Selected: ""},
            Correct: {Correct: ""},
            Wrong: {Wrong: ""},
            Inactive: {Inactive: ""},
            OutOf: {OutOf: ""},
        };
        assertNotUndefined(upgradedModel[this.speachTextLabel]);
        assertEquals(expectedValue, upgradedModel[this.speachTextLabel]);
    },

    'test speechTexts already defined': function () {
        this.model[this.speachTextLabel] = {Question: {Question: ""}};

        var upgradedModel = this.presenter.addSpeechTexts(this.model);

        assertNotUndefined(upgradedModel[this.speachTextLabel]);
        assertEquals({Question: {Question: ""}}, upgradedModel[this.speachTextLabel]);
    },

    'test given model without speechTexts property when upgradeModel is called then missing properties are added with default values': function () {
        var upgradedModel = this.presenter.addSpeechTexts(this.model);

        const expectedValue = ""
        this.validateSpeechTextValue(upgradedModel, 'Question', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'Answer', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'FiftyFiftyButton', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'FiftyFiftyButtonWhenNotEnoughAnswers', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'HintButton', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'CommentField', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'Hint', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'Summary', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'Selected', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'Correct', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'Wrong', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'Inactive', expectedValue);
        this.validateSpeechTextValue(upgradedModel, 'OutOf', expectedValue);
    },

    'test given model with speechTexts properties when upgradeModel is called the speechTexts properties are unaffected': function () {
        this.model[this.speachTextLabel] = {
            Question: {Question: 'Question_'},
            Answer: {Answer: 'Answer_'},
            FiftyFiftyButton: {FiftyFiftyButton: 'FiftyFiftyButton_'},
            FiftyFiftyButtonWhenNotEnoughAnswers:
                {FiftyFiftyButtonWhenNotEnoughAnswers: 'FiftyFiftyButtonWhenNotEnoughAnswers_'},
            HintButton: {HintButton: 'HintButton_'},
            CommentField: {CommentField: 'CommentField_'},
            Hint: {Hint: 'Hint_'},
            Summary: {Summary: 'Summary_'},
            Selected: {Selected: 'Selected_'},
            Correct: {Correct: 'Correct_'},
            Wrong: {Wrong: 'Wrong_'},
            Inactive: {Inactive: 'Inactive_'},
            OutOf: {OutOf: 'OutOf_'},
        };

        var upgradedModel = this.presenter.addSpeechTexts(this.model);

        this.validateSpeechTextValue(upgradedModel, 'Question', 'Question_');
        this.validateSpeechTextValue(upgradedModel, 'Answer', 'Answer_');
        this.validateSpeechTextValue(upgradedModel, 'FiftyFiftyButton', 'FiftyFiftyButton_');
        this.validateSpeechTextValue(upgradedModel, 'FiftyFiftyButtonWhenNotEnoughAnswers', 'FiftyFiftyButtonWhenNotEnoughAnswers_');
        this.validateSpeechTextValue(upgradedModel, 'HintButton', 'HintButton_');
        this.validateSpeechTextValue(upgradedModel, 'CommentField', 'CommentField_');
        this.validateSpeechTextValue(upgradedModel, 'Hint', 'Hint_');
        this.validateSpeechTextValue(upgradedModel, 'Summary', 'Summary_');
        this.validateSpeechTextValue(upgradedModel, 'Selected', 'Selected_');
        this.validateSpeechTextValue(upgradedModel, 'Correct', 'Correct_');
        this.validateSpeechTextValue(upgradedModel, 'Wrong', 'Wrong_');
        this.validateSpeechTextValue(upgradedModel, 'Inactive', 'Inactive_');
        this.validateSpeechTextValue(upgradedModel, 'OutOf', 'OutOf_');
    }
});

TestCase("[Quiz] Model upgrades - add helpButtonsMode", {
    setUp: function () {
        this.presenter = AddonQuiz_create();
        var question = {
            Question: 'What?',
            CorrectAnswer: 'OK',
            WrongAnswer1: 'WrongAnswer',
            WrongAnswer2: 'WrongAnswer',
            WrongAnswer3: 'WrongAnswer',
            Hint: 'Hint',
        }
        this.model = {
            'Is Visible': 'True',
            'ShowHelpButtons': 'False',
            'Questions': [question],
            'isActivity': "True",
        };
        this.helpButtonsMode = 'HelpButtonsMode';
    },

    'test given undefined helpButtonsMode when upgradeModel was called then create property and set to "Both"': function () {
        var upgradedModel = this.presenter.addHelpButtonsMode(this.model);

        assertNotUndefined(upgradedModel[this.helpButtonsMode]);
        assertEquals("Both", upgradedModel[this.helpButtonsMode]);
    },

    'test given mode "Hint" in helpButtonsMode property when upgradeModel was called then leave "Hint"': function () {
        this.model[this.helpButtonsMode] = "Hint";

        var upgradedModel = this.presenter.addHelpButtonsMode(this.model);

        assertNotUndefined(upgradedModel[this.helpButtonsMode]);
        assertEquals("Hint", upgradedModel[this.helpButtonsMode]);
    }
});
