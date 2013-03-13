TestCase("Letter selection adding", {
    setUp: function () {
        this.presenter = AddonHangman_create();
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
    }
});

TestCase("Letter selection detection", {
    setUp: function () {
        this.presenter = AddonHangman_create();
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