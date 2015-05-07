TestCase("[Hangman] Letter selection adding", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.presenter.configuration = {
            isCustomKeyboardLettersOrderSet: false,
            lettersInCustomOrder: []
        };

        this.phrase = {
            letters: this.presenter.DEFAULT_LETTERS,
            selectedLetters: []
        };
    },

    'test select letter with empty selection array': function () {
        var phrase = {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 0,
            selectedLetters: []
        };

        this.presenter.addLetterSelectionToPhrase(phrase, 'B');

        assertEquals([1], phrase.selectedLetters);
    },

    'test select letter with selection array which contain some selections': function () {
        var phrase = {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 0,
            selectedLetters: [1, 3, 10]
        };

        this.presenter.addLetterSelectionToPhrase(phrase, 'Z');

        assertEquals([1, 3, 10, 25], phrase.selectedLetters);
    },

    'test adding letters selection to phrase should convert old indexes to new one if neccessary': function () {
        var getIndexOfLetterInPhraseStub = sinon.stub(this.presenter, 'getIndexOfLetterInPhrase');
        getIndexOfLetterInPhraseStub.returns(1);

        this.presenter.addLetterSelectionToPhrase(this.phrase, "Z");

        assertTrue(getIndexOfLetterInPhraseStub.called);

        this.presenter.getIndexOfLetterInPhrase.restore();
    },

    'test is letter selected should use new keyboard indexes if necessary': function () {
        var getIndexOfLetterInPhraseStub = sinon.stub(this.presenter, 'getIndexOfLetterInPhrase');
        getIndexOfLetterInPhraseStub.returns(1);

        this.presenter.isLetterSelected(this.phrase, "Z");

        assertTrue(getIndexOfLetterInPhraseStub.called);

        this.presenter.getIndexOfLetterInPhrase.restore();
    }
});

TestCase("[Hangman] Letter selection detection", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.presenter.configuration = {
            isCustomKeyboardLettersOrderSet: false
        };
    },

    'test letter is not selected': function () {
        var phrase = {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 0,
            selectedLetters: []
        };

        var isSelected = this.presenter.isLetterSelected(phrase, 'B');

        assertFalse(isSelected);
    },

    'test letter already selected': function () {
        var phrase = {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 0,
            selectedLetters: [1, 3, 10]
        };

        var isSelected = this.presenter.isLetterSelected(phrase, 'B');

        assertTrue(isSelected);
    }
});

TestCase("[Hangman] Get index of letter in phrase", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.presenter.configuration = {
            isCustomKeyboardLettersOrderSet: false,
            lettersInCustomOrder: []
        };
    },

    'test when custom order is not set, index should be from default keyboard order': function () {
        var phrase = {
            letters: this.presenter.DEFAULT_LETTERS
        };

        var validationResult = this.presenter.getIndexOfLetterInPhrase(phrase, "C");

        assertEquals(2, validationResult);
    },

    'test with custom order set, index should equal to index of letter in customised order': function () {
        var phrase = {
            letters: this.presenter.DEFAULT_LETTERS
        };

        this.presenter.configuration.isCustomKeyboardLettersOrderSet = true;
        this.presenter.configuration.lettersInCustomOrder = ["A", "Z", "I", "P", "W"];

        var validationResult = this.presenter.getIndexOfLetterInPhrase(phrase, "Z");

        assertEquals(1, validationResult);
    }
});

TestCase("[Hangman] Get letters indexes for scoring", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.presenter.configuration = {
            isCustomKeyboardLettersOrderSet: false,
            lettersInCustomOrder: []
        };

        this.phrase = {
            letters: this.presenter.DEFAULT_LETTERS
        };

        this.neededLetters = ["A", "B", "C", "D", "E"];
    },

    'test when custom keyboard is not set, should use phrase letters order': function () {
        var expectedResult = [0, 1, 2, 3, 4];

        var validationResult = this.presenter.getLettersIndexesForScoring(this.neededLetters, this.phrase);

        assertEquals(expectedResult, validationResult);
    },

    'test when custom keyboard is set, should use new order keyboard letters indexes': function () {
        this.presenter.configuration.isCustomKeyboardLettersOrderSet = true;
        this.presenter.configuration.lettersInCustomOrder = ["M", "A", "E", "C", "O", "D", "B"];

        var expectedResult = [1, 6, 3, 5, 2];

        var validationResult = this.presenter.getLettersIndexesForScoring(this.neededLetters, this.phrase);

        assertEquals(expectedResult, validationResult);
    }
});