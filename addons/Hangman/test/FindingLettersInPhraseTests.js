TestCase("[Hangman] Finding letters in phrase", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.phrase = ['PHRASE', 'AND', 'SOME', 'TEXT'];
    },

    'test letter occurs once in phrase': function () {
        var findResult = this.presenter.findLetterInPhrase('D', this.phrase);

        assertEquals([{word: 1, index: 2}], findResult);
    },

    'test letter occurs multiple times in one word': function () {
        var findResult = this.presenter.findLetterInPhrase('T', this.phrase);

        assertEquals([{word: 3, index: 0}, {word: 3, index: 3}], findResult);
    },

    'test letter occurs multiple times in multiple words': function () {
        var findResult = this.presenter.findLetterInPhrase('E', this.phrase);

        assertEquals([{word: 0, index: 5}, {word: 2, index: 3}, {word: 3, index: 1}], findResult);
    },

    'test letter does not occur in phrase': function () {
        var findResult = this.presenter.findLetterInPhrase('Y', this.phrase);

        assertEquals([], findResult);
    }
});