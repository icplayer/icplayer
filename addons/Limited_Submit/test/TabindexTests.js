TestCase('[Limited Submit] Tabindex tests', {
    setUp: function () {
        this.presenter = AddonLimited_Submit_create();

        this.view = $('<div></div>');
        this.wrapper = $('<div class="limited-submit-wrapper"></div>');
        this.button = $('<div class="limited-submit-button"></div>');
        this.wrapper.append(this.button);
        this.view.append(this.wrapper);

        this.model = {
            Text : 'Sample text',
            'Text selected' : 'Sample text 2',
            'Is Visible' : 'True',
            ID : 'Show_Answers1',
            'Is Tabindex Enabled': 'True',
            'worksWith': "text1 \n" +
            "text2 \n" +
            "  text3 \n",
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

    'test given simple configuration with enabled tabindex when presenterLogic is executed then will set tabindex attribute': function () {
        this.presenter.presenterLogic(this.view, this.model, true);

        assertEquals(0, this.presenter.$wrapper.attr('tabindex'));
    },

    'test given simple configuration with disabled tabindex when presenterLogic is executed thn wont set tabindex attribute': function () {
        this.model['Is Tabindex Enabled'] = 'False';
        this.presenter.presenterLogic(this.view, this.model, true);

        assertEquals(undefined, this.presenter.$wrapper.attr('tabindex'));
    }
});