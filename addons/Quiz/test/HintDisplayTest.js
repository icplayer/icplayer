TestCase("[Quiz] Hint displays", {
    setUp: function () {
        this.presenter = AddonQuiz_create();
        this.presenter.config = {questions: []};
        this.presenter.$view = $('<div></div>');
        this.presenter.activeElements = [];
        this.presenter.showCurrentQuestion = function () {
            this.questionAppeard = true;
        };
        this.presenter.setState(JSON.stringify({fiftyFiftyUsed: false, hintUsed: false}));
    },

    'test given "50/50" mode when hints are creates then add only 50/50 hint to the view': function () {
        this.presenter.config.helpButtons = true;
        this.presenter.config.helpButtonsMode = '50/50'
        var $buttons = $('<div></div>');
        var $view = $('<div></div>');

        this.presenter.displayHint($view, $buttons);

        assertNotUndefined($buttons.find('.fifty-fifty'));
        assertEquals(this.presenter.activeElements.length, 1);
    },

    'test given "Hint" mode when hints are creates then add only hint to the view': function () {
        this.presenter.config.helpButtons = true;
        this.presenter.config.helpButtonsMode = 'Hint'
        var $buttons = $('<div></div>');
        var $view = $('<div></div>');

        this.presenter.displayHint($view, $buttons);

        assertNotUndefined($buttons.find('.hint-button'));
        assertEquals(this.presenter.activeElements.length, 1);
    },

    'test given "Both" mode when hints are creates then add hint and 50/50 hint to the view': function () {
        this.presenter.config.helpButtons = true;
        this.presenter.config.helpButtonsMode = 'Both'
        var $buttons = $('<div></div>');
        var $view = $('<div></div>');

        this.presenter.displayHint($view, $buttons);

        assertNotUndefined($buttons.find('.hint-button'));
        assertNotUndefined($buttons.find('.fifty-fifty'));
        assertEquals(this.presenter.activeElements.length, 2);
    },

    'test given helpButton on true when displayHint was called then add "with-hint" class to the view': function () {
        this.presenter.config.helpButtons = true;
        this.presenter.config.helpButtonsMode = 'Both'
        var $buttons = $('<div></div>');
        var $view = $('<div></div>');

        this.presenter.displayHint($view, $buttons);

        assertTrue($view.hasClass('with-hint'));
    },

    'test given helpButton on false when displayHint was called then add "without-hint" class to the view': function () {
        this.presenter.config.helpButtons = false;
        this.presenter.config.helpButtonsMode = 'Both'
        var $buttons = $('<div></div>');
        var $view = $('<div></div>');

        this.presenter.displayHint($view, $buttons);

        assertTrue($view.hasClass('without-hint'));
    }
});
