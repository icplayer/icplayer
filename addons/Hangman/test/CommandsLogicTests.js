TestCase("[Hangman] Commands dispatching", {
    setUp: function () {
        this.presenter = AddonHangman_create();

        sinon.stub(Commands, 'dispatch');
    },

    tearDown: function () {
        Commands.dispatch.restore();
    },

    'test commands dispatching in work mode': function () {
        this.presenter.executeCommand('nextPhrase', []);

        assertTrue(Commands.dispatch.called);
    },

    'test commands dispatching in error checking mode': function () {
        this.presenter.isErrorCheckingMode = true;

        this.presenter.executeCommand('nextPhrase', []);

        assertFalse(Commands.dispatch.called);
    }
});

TestCase("[Hangman] Commands logic - next and previous phrases", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.presenter.currentPhrase = 0;

        sinon.stub(this.presenter, 'switchPhrase');
    },

    tearDown: function () {
        this.presenter.switchPhrase.restore();
    },

    'test nextPhrase call': function () {
        this.presenter.nextPhrase();

        assertTrue(this.presenter.switchPhrase.calledWith(2));
    },

    'test previousPhrase call': function () {
        this.presenter.previousPhrase();

        assertTrue(this.presenter.switchPhrase.calledWith(0));
    }
});

TestCase("[Hangman] Commands logic - switchPhrase", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.presenter.configuration = {
            phrases: [{
                letters: this.presenter.DEFAULT_LETTERS,
                phrase: ['HANGMAN'],
                errorCount: 0,
                selectedLetters: []
            }, {
                letters: this.presenter.DEFAULT_LETTERS,
                phrase: ['HANGMAN'],
                errorCount: 0,
                selectedLetters: []
            }]
        };
        this.presenter.currentPhrase = 0;
        this.presenter.$lettersContainer = {};
        this.presenter.$phraseContainer = {};

        sinon.stub(this.presenter, 'removeChildrenElements');
        sinon.stub(this.presenter, 'drawElementsAndAttachMouseHandlers');
        sinon.stub(this.presenter, 'applySelection');
        sinon.stub(this.presenter, 'addMarkedLetter');
    },

    tearDown: function () {
        this.presenter.removeChildrenElements.restore();
        this.presenter.drawElementsAndAttachMouseHandlers.restore();
        this.presenter.applySelection.restore();
        this.presenter.addMarkedLetter.restore();
    },

    'test phrase number is not a number': function () {
        this.presenter.switchPhraseCommand(['phrase']);

        assertFalse(this.presenter.removeChildrenElements.called);
        assertFalse(this.presenter.drawElementsAndAttachMouseHandlers.called);
        assertFalse(this.presenter.applySelection.called);
    },

    'test phrase number is too low': function () {
        this.presenter.switchPhraseCommand(['0']);

        assertFalse(this.presenter.removeChildrenElements.called);
        assertFalse(this.presenter.drawElementsAndAttachMouseHandlers.called);
        assertFalse(this.presenter.applySelection.called);
    },

    'test phrase number is too high': function () {
        this.presenter.switchPhraseCommand(['3']);

        assertFalse(this.presenter.removeChildrenElements.called);
        assertFalse(this.presenter.drawElementsAndAttachMouseHandlers.called);
        assertFalse(this.presenter.applySelection.called);
    },

    'test switch to second phrase': function () {
        this.presenter.switchPhraseCommand(['2']);

        assertTrue(this.presenter.removeChildrenElements.calledTwice);
        assertTrue(this.presenter.drawElementsAndAttachMouseHandlers.calledOnce);
        assertTrue(this.presenter.applySelection.calledOnce);

        assertEquals(1, this.presenter.currentPhrase);
    }
});

TestCase("[Hangman] Commands logic - reset", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.presenter.currentPhrase = 1;
        this.presenter.configuration = {
            phrases: [{
                letters: this.presenter.DEFAULT_LETTERS,
                phrase: ['HANGMAN'],
                errorCount: 1,
                selectedLetters: [1,2,3]
            }, {
                letters: this.presenter.DEFAULT_LETTERS,
                phrase: ['HANGMAN'],
                errorCount: 2,
                selectedLetters: [1,4,14]
            }]
        };
        this.presenter.isVisible = true;
        this.presenter.isVisibleByDefault = false;
        this.presenter.$lettersContainer = {};
        this.presenter.$phraseContainer = {};

        sinon.stub(this.presenter, 'removeChildrenElements');
        sinon.stub(this.presenter, 'drawElementsAndAttachMouseHandlers');
        sinon.stub(this.presenter, 'applySelection');
        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'addMarkedLetter');
    },

    tearDown: function () {
        this.presenter.removeChildrenElements.restore();
        this.presenter.drawElementsAndAttachMouseHandlers.restore();
        this.presenter.applySelection.restore();
        this.presenter.setVisibility.restore();
        this.presenter.addMarkedLetter.restore();
    },

    'test reset command call': function () {
        var expectedPhrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 0,
            selectedLetters: []
        }, {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 0,
            selectedLetters: []
        }];

        this.presenter.reset();

        assertTrue(this.presenter.removeChildrenElements.calledTwice);
        assertTrue(this.presenter.drawElementsAndAttachMouseHandlers.calledOnce);
        assertTrue(this.presenter.applySelection.calledOnce);
        assertTrue(this.presenter.setVisibility.calledOnce);

        assertEquals(0, this.presenter.currentPhrase);
        assertEquals(expectedPhrases, this.presenter.configuration.phrases);
        assertFalse(this.presenter.isVisible);
    }
});

TestCase("[Hangman] Commands logic - hide", {
    setUp : function() {
        this.presenter = AddonHangman_create();
        sinon.stub(this.presenter, 'setVisibility');
    },

    tearDown : function() {
        this.presenter.setVisibility.restore();
    },

    'test show command' : function() {
        this.presenter.show();

        assertTrue(this.presenter.setVisibility.calledOnce);
        assertTrue(this.presenter.isVisible);
    },

    'test hide command' : function() {
        this.presenter.hide();

        assertTrue(this.presenter.setVisibility.calledOnce);
        assertFalse(this.presenter.isVisible);
    }
});

TestCase("[Hangman] Commands logic - isAllOK", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        sinon.stub(this.presenter, 'getScore');
        sinon.stub(this.presenter, 'getMaxScore');
    },

    tearDown : function() {
        this.presenter.getScore.restore();
        this.presenter.getMaxScore.restore();
    },

    'test isAllOk while all letters correctly selected': function () {
        this.presenter.getScore.returns(2);
        this.presenter.getMaxScore.returns(2);

        assertTrue(this.presenter.isAllOK());
    },

    'test isAllOk while letters incorrectly selected': function () {
        this.presenter.getScore.returns(1);
        this.presenter.getMaxScore.returns(2);

        assertFalse(this.presenter.isAllOK());
    }
});