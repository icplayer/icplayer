TestCase("[Hangman] Events creation", {
    setUp : function() {
        this.presenter = AddonHangman_create();
        this.presenter.configuration = {
            addonID: 'Hangman1'
        };
        this.presenter.currentPhrase = 0;
        this.presenter.isShowAnswersActive = false;
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
    },

    'test allOk event has been created': function () {
        var eventData = this.presenter.createAllOKEventData();

        assertEquals('Hangman1', eventData.source);
        assertEquals('all', eventData.item);
        assertEquals('', eventData.value);
        assertEquals('', eventData.score);
    }
});

TestCase("[Hangman] Events triggering is Activity", {
    setUp : function() {
        this.presenter = AddonHangman_create();
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
            trialsCount: 3,
            addonID: 'Hangman1'
        };
        this.presenter.currentPhrase = 1;
        this.presenter.isActivity = true;

        sinon.stub(this.presenter, 'unbindAttachedHandlers');
        sinon.stub(this.presenter, 'fillPhraseWithLetters');
        sinon.stub(this.presenter, 'disableRemainingLetters');
        sinon.stub(this.presenter, 'sendEventData');
        sinon.stub(this.presenter, 'isAllOK');
        sinon.stub(this.presenter, 'sendAllOKEvent');
    },

    tearDown: function() {
        this.presenter.unbindAttachedHandlers.restore();
        this.presenter.fillPhraseWithLetters.restore();
        this.presenter.disableRemainingLetters.restore();
        this.presenter.sendEventData.restore();
        this.presenter.isAllOK.restore();
        this.presenter.sendAllOKEvent.restore();
    },

    'test user selected correct letter and all phrases are correctly filled' : function() {
        this.presenter.isAllOK.returns(true);
        this.presenter.onLetterSelectedAction('A', this.presenter.configuration.phrases[1], true);

        assertEquals({source: 'Hangman1', item: '2', value: 'A', score: '1'}, this.presenter.sendEventData.getCall(0).args[0]);
        assertTrue(this.presenter.sendAllOKEvent.called);
    },

    'test user selected correct letter and phrases are not correctly filled' : function() {
        this.presenter.isAllOK.returns(false);
        this.presenter.onLetterSelectedAction('A', this.presenter.configuration.phrases[1], true);

        assertEquals({source: 'Hangman1', item: '2', value: 'A', score: '1'}, this.presenter.sendEventData.getCall(0).args[0]);
        assertFalse(this.presenter.sendAllOKEvent.called);
    },

    'test user selected incorrect letter' : function() {
        this.presenter.isAllOK.returns(false);
        this.presenter.onLetterSelectedAction('B', this.presenter.configuration.phrases[1], true);

        assertEquals({source: 'Hangman1', item: '2', value: 'B', score: '0'}, this.presenter.sendEventData.getCall(0).args[0]);
        assertFalse(this.presenter.sendAllOKEvent.called);
    },

    'test user selected incorrect letter and he runs of trials' : function() {
        this.presenter.configuration.phrases[1].errorCount = 2;
        this.presenter.onLetterSelectedAction('B', this.presenter.configuration.phrases[1], true);

        assertEquals({source: 'Hangman1', item: '2', value: 'B', score: '0'}, this.presenter.sendEventData.getCall(0).args[0]);
        assertEquals({source: 'Hangman1', item: '2', value: 'EOT', score: ''}, this.presenter.sendEventData.getCall(1).args[0]);
    },

    'test user selected incorrect letter when don\'t have trials' : function () {
        this.presenter.configuration.phrases[1].errorCount = 3;
        this.presenter.onLetterSelectedAction('B', this.presenter.configuration.phrases[1], true);

        assertEquals({source: 'Hangman1', item: '2', value: 'B', score: '0'}, this.presenter.sendEventData.getCall(0).args[0]);
        assertEquals({source: 'Hangman1', item: '2', value: 'EOG', score: ''}, this.presenter.sendEventData.getCall(1).args[0]);
    },
    
    'test automatically selected letter' : function() {
        this.presenter.onLetterSelectedAction('B', this.presenter.configuration.phrases[1], false);
        assertFalse(this.presenter.sendEventData.called);
    },

    'test event EndOfGame(EOG) should be send': function () {
        this.presenter.sendEndOfGameEvent();

        assertTrue(this.presenter.sendEventData.calledOnce);
        assertEquals({source: 'Hangman1', item: '2', value: 'EOG', score: ''}, this.presenter.sendEventData.getCall(0).args[0])
    },

    'test event EndOfGame(EOG) should not be send when show answers mode is active': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.sendEndOfGameEvent();

        assertTrue(this.presenter.sendEventData.notCalled);
    },

    'test event EOT should be sent only once on word' : function () {
        this.presenter.configuration.phrases[1].errorCount = 2;
        this.presenter.onLetterSelectedAction('B', this.presenter.configuration.phrases[1], true);

        assertEquals({source: 'Hangman1', item: '2', value: 'B', score: '0'}, this.presenter.sendEventData.getCall(0).args[0]);
        assertEquals({source: 'Hangman1', item: '2', value: 'EOT', score: ''}, this.presenter.sendEventData.getCall(1).args[0]);

        this.presenter.onLetterSelectedAction('A', this.presenter.configuration.phrases[1], true);
        assertEquals({source: 'Hangman1', item: '2', value: 'B', score: '0'}, this.presenter.sendEventData.getCall(0).args[0]);
        assertEquals(3, this.presenter.sendEventData.callCount);
    }
});

TestCase("[Hangman] Events triggering is Not Activity", {
    setUp : function() {
        this.presenter = AddonHangman_create();
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
            trialsCount: 3,
            addonID: 'Hangman1'
        };
        this.presenter.currentPhrase = 1;
        this.presenter.isActivity = false;

        sinon.stub(this.presenter, 'unbindAttachedHandlers');
        sinon.stub(this.presenter, 'fillPhraseWithLetters');
        sinon.stub(this.presenter, 'disableRemainingLetters');
        sinon.stub(this.presenter, 'sendEventData');
        sinon.stub(this.presenter, 'isAllOK');
        sinon.stub(this.presenter, 'sendAllOKEvent');
    },

    tearDown: function() {
        this.presenter.unbindAttachedHandlers.restore();
        this.presenter.fillPhraseWithLetters.restore();
        this.presenter.disableRemainingLetters.restore();
        this.presenter.sendEventData.restore();
        this.presenter.isAllOK.restore();
        this.presenter.sendAllOKEvent.restore();
    },

    'test user selected correct letter and all phrases are correctly filled' : function() {
        this.presenter.onLetterSelectedAction('A', this.presenter.configuration.phrases[1], true);

        assertTrue(this.presenter.sendEventData.called);
        assertFalse(this.presenter.sendAllOKEvent.called);
    },

    'test user selected correct letter and phrases are not correctly filled' : function() {
        this.presenter.onLetterSelectedAction('A', this.presenter.configuration.phrases[1], true);

        assertTrue(this.presenter.sendEventData.called);
        assertFalse(this.presenter.sendAllOKEvent.called);
    },

    'test user selected incorrect letter' : function() {
        this.presenter.onLetterSelectedAction('B', this.presenter.configuration.phrases[1], true);

        assertTrue(this.presenter.sendEventData.called);
        assertFalse(this.presenter.sendAllOKEvent.called);
    },

    'test automatically selected letter' : function() {
        this.presenter.onLetterSelectedAction('B', this.presenter.configuration.phrases[1], false);
        assertFalse(this.presenter.sendEventData.called);
    }
});