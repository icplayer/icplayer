TestCase("[Hangman] Getting phrase for scoring", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.presenter.isErrorCheckingMode = false;
        this.presenter.isShowAnswersActive = false;
        this.presenter.currentPhrase = 0;
        this.presenter.configuration = {
            phrases: [{
                letters: this.presenter.DEFAULT_LETTERS,
                phrase: ['HANGMAN'],
                errorCount: 1,
                selectedLetters: [7,0,13,6]
            }]
        };
    },

    'test get phrases in work mode': function () {
        this.presenter.configuration = {
            phrases: [{
                letters: this.presenter.DEFAULT_LETTERS,
                phrase: ['HANGMAN'],
                errorCount: 1,
                selectedLetters: [7,0,13,6]
            }]
        };

        var phrases = this.presenter.getPhraseForScoring();

        assertEquals(this.presenter.configuration.phrases, phrases);
    },

    'test get phrases in errors checking mode': function () {
        var workPhrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [7,0,13,6]
        }];

        this.presenter.isErrorCheckingMode = true;
        this.presenter.configuration = {
            phrases: [{
                letters: this.presenter.DEFAULT_LETTERS,
                phrase: ['HANGMAN'],
                errorCount: 1,
                selectedLetters: [7,0,13,6,12]
            }]
        };
        this.presenter.workModeState = JSON.stringify({
            currentPhrase: 0,
            phrases: workPhrases
        });

        var phrases = this.presenter.getPhraseForScoring();

        assertEquals(workPhrases, phrases);
    },

    'test given hangman with show answers mode on when get phrases then returns workModeState phrases as JSON': function () {
        var workPhrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [7,0,13,6]
        }];

        this.presenter.isShowAnswersActive = true;
        this.presenter.configuration = {
            phrases: [{
                letters: this.presenter.DEFAULT_LETTERS,
                phrase: ['HANGMAN'],
                errorCount: 1,
                selectedLetters: [7,0,13,6,12]
            }]
        };
        this.presenter.workModeState = JSON.stringify({
            currentPhrase: 0,
            phrases: workPhrases
        });

        var phrases = this.presenter.getPhraseForScoring();

        assertEquals(workPhrases, phrases);
    }
});

TestCase("[Hangman] Selection array sufficiency check", {
    setUp: function () {
        this.presenter = AddonHangman_create();
    },

    'test selected letters indexes includes all needed indexes': function () {
        var selectedLetters = [7,0,13,6,12];
        var neededLetters = [7,0,13,6,12];

        var isSelectionSufficient = this.presenter.isSelectionSufficient(neededLetters, selectedLetters);

        assertTrue(isSelectionSufficient)
    },

    'test selected letters indexes does not includes all needed indexes': function () {
        var selectedLetters = [7,0,13,5,12];
        var neededLetters = [7,0,13,6,12];

        var isSelectionSufficient = this.presenter.isSelectionSufficient(neededLetters, selectedLetters);

        assertFalse(isSelectionSufficient)
    },

    'test selected letters indexes includes all needed indexes and more': function () {
        var selectedLetters = [7,0,13,6,12,3,4];
        var neededLetters = [7,0,13,6,12];

        var isSelectionSufficient = this.presenter.isSelectionSufficient(neededLetters, selectedLetters);

        assertTrue(isSelectionSufficient)
    }

});

TestCase("[Hangman] Scoring calculation", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.presenter.configuration = {
            isCustomKeyboardLettersOrderSet: false
        };
    },

    'test user selected all needed letters': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [7,0,13,6,12]
        }];

        var score = this.presenter.getScoring(phrases);

        assertEquals({score: 1, errors: 0}, score);
    },

    'test user selected all needed letters in phrase with exclamation marks': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['!HAN!GMA!N'],
            errorCount: 1,
            selectedLetters: [7,0,13,6,12]
        }];

        var score = this.presenter.getScoring(phrases);

        assertEquals({score: 1, errors: 0}, score);
    },

    'test user did not select all needed letters in phrase with exclamation marks': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['H!AN!G!MA!N'],
            errorCount: 1,
            selectedLetters: [7,0,13,6]
        }];

        var score = this.presenter.getScoring(phrases);

        assertEquals({score: 0, errors: 1}, score);
    },

    'test user selected all needed letters in one phrase but not in second in phrases with exclamation marks': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HA!NG!MA!N'],
            errorCount: 1,
            selectedLetters: [7,0,13,6,12]
        }, {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['H!AN!GMA!N'],
            errorCount: 1,
            selectedLetters: [7,0,13,6]
        }];

        var score = this.presenter.getScoring(phrases);

        assertEquals({score: 1, errors: 1}, score);
    },

    'test user selected all needed letters in all phrases in phrases with exclamation marks': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['H!AN!GMA!N'],
            errorCount: 1,
            selectedLetters: [7,0,13,6,12]
        }, {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['H!A!NG!MA!N'],
            errorCount: 1,
            selectedLetters: [7,0,13,6,12]
        }];

        var score = this.presenter.getScoring(phrases);

        assertEquals({score: 2, errors: 0}, score);
    },

    'test user did not select all needed letters': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [7,0,13,6]
        }];

        var score = this.presenter.getScoring(phrases);

        assertEquals({score: 0, errors: 1}, score);
    },

    'test user selected all needed letters in one phrase but not in second': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [7,0,13,6,12]
        }, {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [7,0,13,6]
        }];

        var score = this.presenter.getScoring(phrases);

        assertEquals({score: 1, errors: 1}, score);
    },

    'test user selected all needed letters in all phrases': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [7,0,13,6,12]
        }, {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [7,0,13,6,12]
        }];

        var score = this.presenter.getScoring(phrases);

        assertEquals({score: 2, errors: 0}, score);
    },

    'test user selected all needed letters and few others': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [7,0,13,6,12,3,4]
        }];

        var score = this.presenter.getScoring(phrases);

        assertEquals({score: 1, errors: 0}, score);
    }
});

TestCase("[Hangman] Scoring calculation with custom keyboard letters order", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.presenter.configuration = {
            isCustomKeyboardLettersOrderSet: true,
            lettersInCustomOrder: ["H", "A", "N", "G", "M", "B", "C", "F", "E", "I"]
        };

        this.spies = {
            getLettersIndexesForScoring: sinon.spy(this.presenter, 'getLettersIndexesForScoring'),
            isSelectionSufficient: sinon.spy(this.presenter, 'isSelectionSufficient')
        };
    },

    tearDown: function () {
        this.presenter.getLettersIndexesForScoring.restore();
        this.presenter.isSelectionSufficient.restore();
    },

    'test user selected all needed letters': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [0, 1, 2, 3, 4]
        }];

        var score = this.presenter.getScoring(phrases);

        assertTrue(this.spies.getLettersIndexesForScoring.called);
        assertTrue(this.spies.isSelectionSufficient.called);

        assertTrue(this.spies.getLettersIndexesForScoring.calledBefore(this.spies.isSelectionSufficient));

        assertEquals({score: 1, errors: 0}, score);
    },

    'test user selected all needed letters in phrase with exclamation marks': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['!HAN!GMA!N'],
            errorCount: 1,
            selectedLetters: [0, 1, 2, 3, 4]
        }];

        var score = this.presenter.getScoring(phrases);

        assertTrue(this.spies.getLettersIndexesForScoring.called);
        assertTrue(this.spies.isSelectionSufficient.called);

        assertTrue(this.spies.getLettersIndexesForScoring.calledBefore(this.spies.isSelectionSufficient));

        assertEquals({score: 1, errors: 0}, score);
    },

    'test user did not select all needed letters in phrase with exclamation marks': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['H!AN!G!MA!N'],
            errorCount: 1,
            selectedLetters: [1, 2, 3]
        }];

        var score = this.presenter.getScoring(phrases);

        assertTrue(this.spies.getLettersIndexesForScoring.called);
        assertTrue(this.spies.isSelectionSufficient.called);

        assertTrue(this.spies.getLettersIndexesForScoring.calledBefore(this.spies.isSelectionSufficient));

        assertEquals({score: 0, errors: 1}, score);
    },

    'test user selected all needed letters in one phrase but not in second in phrases with exclamation marks': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HA!NG!MA!N'],
            errorCount: 1,
            selectedLetters: [0, 1, 2, 3, 4]
        }, {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['H!AN!GMA!N'],
            errorCount: 1,
            selectedLetters: [1, 2, 3]
        }];

        var score = this.presenter.getScoring(phrases);

        assertTrue(this.spies.getLettersIndexesForScoring.called);
        assertTrue(this.spies.isSelectionSufficient.called);

        assertTrue(this.spies.getLettersIndexesForScoring.calledBefore(this.spies.isSelectionSufficient));

        assertEquals({score: 1, errors: 1}, score);
    },

    'test user selected all needed letters in all phrases in phrases with exclamation marks': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['H!AN!GMA!N'],
            errorCount: 1,
            selectedLetters: [0, 1, 2, 3, 4]
        }, {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['H!A!NG!MA!N'],
            errorCount: 1,
            selectedLetters: [0, 1, 2, 3, 4]
        }];

        var score = this.presenter.getScoring(phrases);

        assertTrue(this.spies.getLettersIndexesForScoring.called);
        assertTrue(this.spies.isSelectionSufficient.called);

        assertTrue(this.spies.getLettersIndexesForScoring.calledBefore(this.spies.isSelectionSufficient));

        assertEquals({score: 2, errors: 0}, score);
    },

    'test user did not select all needed letters': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [0, 1, 2]
        }];

        var score = this.presenter.getScoring(phrases);

        assertTrue(this.spies.getLettersIndexesForScoring.called);
        assertTrue(this.spies.isSelectionSufficient.called);

        assertTrue(this.spies.getLettersIndexesForScoring.calledBefore(this.spies.isSelectionSufficient));

        assertEquals({score: 0, errors: 1}, score);
    },

    'test user selected all needed letters in one phrase but not in second': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [0, 1, 2, 3, 4]
        }, {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [0, 1, 2]
        }];

        var score = this.presenter.getScoring(phrases);

        assertTrue(this.spies.getLettersIndexesForScoring.called);
        assertTrue(this.spies.isSelectionSufficient.called);

        assertTrue(this.spies.getLettersIndexesForScoring.calledBefore(this.spies.isSelectionSufficient));

        assertEquals({score: 1, errors: 1}, score);
    },

    'test user selected all needed letters in all phrases': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [0, 1, 2, 3, 4]
        }, {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [0, 1, 2, 3, 4]
        }];

        var score = this.presenter.getScoring(phrases);

        assertTrue(this.spies.getLettersIndexesForScoring.called);
        assertTrue(this.spies.isSelectionSufficient.called);

        assertTrue(this.spies.getLettersIndexesForScoring.calledBefore(this.spies.isSelectionSufficient));

        assertEquals({score: 2, errors: 0}, score);
    },

    'test user selected all needed letters and few others': function () {
        var phrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 1,
            selectedLetters: [1, 2, 3, 4, 0, 5, 6, 7]
        }];

        var score = this.presenter.getScoring(phrases);

        assertTrue(this.spies.getLettersIndexesForScoring.called);
        assertTrue(this.spies.isSelectionSufficient.called);

        assertTrue(this.spies.getLettersIndexesForScoring.calledBefore(this.spies.isSelectionSufficient));

        assertEquals({score: 1, errors: 0}, score);
    }
});