TestCase("[Hangman] Words to letters matching", {
    setUp: function () {
        this.presenter = AddonHangman_create();
    },

    'test model is valid': function () {
        var letters = ['H', 'A', 'N', 'G', 'M'];
        var words = "Hangman";

        var isModelValid = this.presenter.wordsMatchLetters(letters, words);

        assertTrue(isModelValid);
    },

    'test model is invalid': function () {
        var letters = ['H', 'A', 'N', 'G', 'M'];
        var words = "Hangmant";

        var isModelValid = this.presenter.wordsMatchLetters(letters, words);

        assertFalse(isModelValid);
    },

    'test model is valid for multiple words': function () {
        var letters = ['H', 'A', 'N', 'G', 'M'];
        var words = "Hangman hangman";

        var isModelValid = this.presenter.wordsMatchLetters(letters, words);

        assertTrue(isModelValid);
    },

    'test model is valid with exclamation marks': function () {
        var letters = ['H', 'A', 'N', 'G', 'M'];
        var words = "!Han!gman";

        var isModelValid = this.presenter.wordsMatchLetters(letters, words);

        assertTrue(isModelValid);
    }

});