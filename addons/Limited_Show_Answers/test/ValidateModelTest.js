TestCase("[Limited_Show_Answers] Validating model test", {
    setUp: function () {
        this.presenter = new AddonLimited_Show_Answers_create();

        this.model = {
            Text : 'Sample text',
            'Text selected' : 'Sample text 2',
            'Is Visible' : 'True',
            ID : 'Show_Answers1',
            'Increment check counter': 'True',
            'Increment mistake counter': 'True',
            'Is Tabindex Enabled': 'True',
            'worksWith': "text1 \n" +
            "text2 \n" +
            "  text3 \n" +
            "   text2  \n" +
            "   ",
            speechTexts :
                {
                    Selected: {
                        Selected: 'is selected'
                    },
                    'Block edit': {
                        'Block edit': 'Edition of this page is blocked'
                    },

                    'No block edit': {
                        'No block edit': 'Edition of this page is not blocked'
                    }
                }
        };
    },

    'test should return "Sample text"': function() {
        var result = this.presenter.validateModel(this.model);

        assertEquals("Sample text", result.value.text);
    },

    'test should return "Sample text 2" for textSelected': function() {
        var result = this.presenter.validateModel(this.model);

        assertEquals('Sample text 2', result.value.textSelected);
    },

    'test should return true for isVisible': function() {
        var result = this.presenter.validateModel(this.model);

        assertTrue(result.value.isVisible);
    },

    'test should return "Show_Answers1" for addonID': function() {
        var result = this.presenter.validateModel(this.model);

        assertEquals("Show_Answers1", result.value.addonID);
    },

    'test should return true for enabling check counter': function() {
        var result = this.presenter.validateModel(this.model);

        assertTrue(result.value.enableMistakeCounter);
    },

    'test setSpeechTexts sets provided values': function() {
        var result = this.presenter.validateModel(this.model);

        assertTrue(0 === this.presenter.speechTexts.selected.localeCompare('is selected'));
        assertTrue(0 === this.presenter.speechTexts.editBlock.localeCompare('Edition of this page is blocked'));
        assertTrue(0 === this.presenter.speechTexts.noEditBlock.localeCompare('Edition of this page is not blocked'));
    },

    'test validateModel should return list of modules to send event': function () {
        var modules = this.presenter.validateModel(this.model).value.worksWithModulesList;

        assertEquals(["text1", "text2", "text3"], modules);
    }
});