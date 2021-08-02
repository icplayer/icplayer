TestCase("[Quiz] Configuration tests", {
    setUp: function () {
        this.presenter = AddonQuiz_create();
        this.presenter.addonID = 'Quiz1';
    },

    'test proper configuration was setted': function () {
        var question = {
                Question: 'What?',
                CorrectAnswer: 'OK',
                WrongAnswer1: 'WrongAnswer',
                WrongAnswer2: 'WrongAnswer',
                WrongAnswer3: 'WrongAnswer',
                Hint: 'Hint',
            },
            model = {
                'Is Visible': 'True',
                'ShowHelpButtons': 'False',
                'Questions': [question],
                'isActivity': "True",
            };
        var errorOccurred = false;
        var config = {};
        try {
            this.presenter.setupConfig(model);
            config = this.presenter.config;
        } catch (e) {
            errorOccurred = true;
        }
        assertFalse(errorOccurred);
    },

    'test question with image was setted': function () {
        var question = {
                Question: '<img src="test.png" />',
                CorrectAnswer: 'OK',
                WrongAnswer1: 'WrongAnswer',
                WrongAnswer2: 'WrongAnswer',
                WrongAnswer3: 'WrongAnswer',
                Hint: 'Hint',
            },
            model = {
                'Is Visible': 'True',
                'ShowHelpButtons': 'False',
                'Questions': [question],
                'isActivity': "True",
            };
        var errorOccurred = false;
        var config = {};
        try {
            this.presenter.setupConfig(model);
            config = this.presenter.config;
        } catch (e) {
            errorOccurred = true;
        }
        assertFalse(errorOccurred);
    },

    'test model without questions': function () {
        var model = {
                'Is Visible': 'True',
                'ShowHelpButtons': 'False',
                'Questions': [],
                'isActivity': "True",
            };
        var errorOccurred = false;
        var errorName = 'None';
        try {
            this.presenter.setupConfig(model);
        } catch (e) {
            errorOccurred = true;
            errorName = e.name;
        }
        assertTrue(errorOccurred);
        assertEquals('ConfigurationError', errorName);
    },

    'test question without hint was setted': function () {
        var question = {
                Question: 'Test',
                CorrectAnswer: 'OK',
                WrongAnswer1: 'WrongAnswer',
                WrongAnswer2: 'WrongAnswer',
                WrongAnswer3: 'WrongAnswer',
                Hint: '',
            },
            model = {
                'Is Visible': 'True',
                'ShowHelpButtons': 'True',
                'Questions': [question],
                'isActivity': "True",
            };
        var errorOccurred = false,
            errorName = 'None';
        try {
            this.presenter.setupConfig(model);
        } catch (e) {
            errorOccurred = true;
            errorName = e.name;
        }
        assertTrue(errorOccurred);
        assertEquals('ConfigurationError', errorName);
    },
});
