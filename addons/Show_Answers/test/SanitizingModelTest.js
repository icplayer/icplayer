TestCase("[Show_Answers] Sanitizing model test", {
    setUp: function () {
        this.presenter = new AddonShow_Answers_create();

        this.model = {
            Text : 'Sample text',
            'Text selected' : 'Sample text 2',
            'Is Visible' : 'True',
            ID : 'Show_Answers1',
            'Increment check counter': 'True',
            'Increment mistake counter': 'True'
        };
    },

    'test should return "Sample text"': function() {
        var result = this.presenter.sanitizeModel(this.model);

        assertEquals("Sample text", result.text);
    },

    'test should return "Sample text 2" for textSelected': function() {
        var result = this.presenter.sanitizeModel(this.model);

        assertEquals('Sample text 2', result.textSelected);
    },

    'test should return true for isVisible': function() {
        var result = this.presenter.sanitizeModel(this.model);

        assertTrue(result.isVisible);
    },

    'test should return "Show_Answers1" for addonID': function() {
        var result = this.presenter.sanitizeModel(this.model);

        assertEquals("Show_Answers1", result.addonID);
    },

    'test should return true for enabling check counter': function() {
        var result = this.presenter.sanitizeModel(this.model);

        assertTrue(result.enableCheckCounter);
    },

    'test should return true for enabling check counter': function() {
        var result = this.presenter.sanitizeModel(this.model);

        assertTrue(result.enableMistakeCounter);
    }
});