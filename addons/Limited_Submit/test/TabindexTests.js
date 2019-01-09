TestCase('[Limited_Show_Answers] Tabindex tests', {
    setUp: function () {
        this.presenter = AddonLimited_Show_Answers_create();

        this.view = $('<div></div>');
        this.wrapper = $('<div class="limited-show-answers-wrapper"></div>');
        this.button = $('<div class="limited-show-answers-button"></div>');
        this.wrapper.append(this.button);
        this.view.append(this.wrapper);

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
            "  text3 \n",
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

    'test should set tabindex of button to 0 when isTabindexEnabled is true': function () {
        this.presenter.presenterLogic(this.view, this.model, true);

        assertEquals(0, this.presenter.$wrapper.attr('tabindex'));
    },

    'test should not set tabindex when isTabindexEnabled is false': function () {
        this.model['Is Tabindex Enabled'] = 'False';
        this.presenter.presenterLogic(this.view, this.model, true);

        assertEquals(undefined, this.presenter.$wrapper.attr('tabindex'));
    }
});