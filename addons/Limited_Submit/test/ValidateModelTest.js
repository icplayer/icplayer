TestCase("[Limited_Submit] Validating model test", {
    setUp: function () {
        this.presenter = new AddonLimited_Submit_create();

        this.model = {
            Text : 'Sample text',
            'Text selected' : 'Sample text 2',
            'Is Visible' : 'True',
            ID : 'Show_Answers1',
            'Is Tabindex Enabled': 'True',
            'worksWith': "text1 \n" +
                "text2 \n" +
                "  text3 \n" +
                "   text2  \n" +
                "   ",
            speechTexts : {
                'blockEdit': {
                    'textToSpeechText': 'Edition of this page is blocked'
                },

                'noBlockEdit': {
                    'textToSpeechText': 'Edition of this page is not blocked'
                },

                'selected': {
                    'textToSpeechText': 'text select'
                },

                'notAllAttempted': {
                    'textToSpeechText': 'text select'
                }
            }
        };
    },

    'test given text in raw model when validateModel is executed then will return validated text': function() {
        var result = this.presenter.validateModel(this.model);

        assertEquals("Sample text", result.value.text);
    },

    'test given textSelected in raw model when validateModel is called then will return validated textSelected': function() {
        var result = this.presenter.validateModel(this.model);

        assertEquals('Sample text 2', result.value.textSelected);
    },

    'test given visibility in raw model when validateModel is called then will return validated visiblity': function() {
        var result = this.presenter.validateModel(this.model);

        assertTrue(result.value.isVisible);
    },

    'test given addon id in raw model when validateModel is called then will return copy of addon id': function() {
        var result = this.presenter.validateModel(this.model);

        assertEquals("Show_Answers1", result.value.addonID);
    },

    'test given list of addons separated by new line in raw model when validateModel is called then will return this list of addons as js list without whitespaces before and after id and without empty ids': function () {
        var modules = this.presenter.validateModel(this.model).value.worksWithModulesList;

        assertEquals(["text1", "text2", "text3"], modules);
    }
});