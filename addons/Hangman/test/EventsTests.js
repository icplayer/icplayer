TestCase("Events creation", {
    setUp : function() {
        this.presenter = AddonHangman_create();
        this.presenter.addonID = 'Hangman1';
        this.presenter.currentPhrase = 0;
    },

    'test create base event data': function () {
        var eventData = this.presenter.createBaseEventData();

        assertEquals('Hangman1', eventData.source);
        assertEquals('1', eventData.item);
        assertEquals('', eventData.value);
        assertEquals('', eventData.score);
    },

    'test end of trials event has been created': function () {
        var eventData = this.presenter.createEndOfTrialsEventData();

        assertEquals('Hangman1', eventData.source);
        assertEquals('1', eventData.item);
        assertEquals('EOT', eventData.value);
        assertEquals('', eventData.score);
    },

    'test letter selected event data for correct selection': function () {
        var eventData = this.presenter.createLetterSelectedEventData('A', true);

        assertEquals('Hangman1', eventData.source);
        assertEquals('1', eventData.item);
        assertEquals('A', eventData.value);
        assertEquals('1', eventData.score);
    },

    'test letter selected event data for incorrect selection': function () {
        var eventData = this.presenter.createLetterSelectedEventData('B', false);

        assertEquals('Hangman1', eventData.source);
        assertEquals('1', eventData.item);
        assertEquals('B', eventData.value);
        assertEquals('0', eventData.score);
    }
});

TestCase("Events triggering", {
    setUp : function() {
        this.presenter = AddonHangman_create();
        this.presenter.addonID = 'Hangman1';
        this.presenter.configuration = {
            phrases: [{
                letters: this.presenter.DEFAULT_LETTERS,
                phrase: ['BABE'],
                errorCount: 0,
                selectedLetters: []
            }, {
                letters: this.presenter.DEFAULT_LETTERS,
                phrase: ['HANGMAN'],
                errorCount: 0,
                selectedLetters: []
            }],
            trialsCount: 3
        };
        this.presenter.currentPhrase = 1;

        sinon.stub(this.presenter, 'unbindAttachedHandlers');
        sinon.stub(this.presenter, 'fillPhraseWithLetters');
        sinon.stub(this.presenter, 'disableRemainingLetters');
        sinon.stub(this.presenter, 'sendEventData');
    },

    tearDown: function() {
        this.presenter.unbindAttachedHandlers.restore();
        this.presenter.fillPhraseWithLetters.restore();
        this.presenter.disableRemainingLetters.restore();
        this.presenter.sendEventData.restore();
    },

    'test user selected correct letter' : function() {
        this.presenter.onLetterSelectedAction('A', this.presenter.configuration.phrases[1]);

        assertTrue(this.presenter.sendEventData.calledWith({source: 'Hangman1', item: '2', value: 'A', score: '1'}));
    },

    'test user selected incorrect letter' : function() {
        this.presenter.onLetterSelectedAction('B', this.presenter.configuration.phrases[1]);

        assertTrue(this.presenter.sendEventData.calledWith({source: 'Hangman1', item: '2', value: 'B', score: '0'}));
    },

    'test user selected incorrect letter and he runs of trials' : function() {
        this.presenter.configuration.phrases[1].errorCount = 2;
        this.presenter.onLetterSelectedAction('B', this.presenter.configuration.phrases[1]);

        assertEquals({source: 'Hangman1', item: '2', value: 'B', score: '0'}, this.presenter.sendEventData.getCall(0).args[0]);
        assertEquals({source: 'Hangman1', item: '2', value: 'EOT', score: ''}, this.presenter.sendEventData.getCall(1).args[0]);
    }
});