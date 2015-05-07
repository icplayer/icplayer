TestCase("[Hangman] Letter element index calculation", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.phrase = ['PHRASE', 'AND', 'SOME', 'TEXT'];
    },

    'test letter in first word': function () {
        var index = this.presenter.calculateLetterElementIndex(this.phrase, {word: 0, index: 5});

        assertEquals(5, index);
    },

    'test letter in third word': function () {
        var index = this.presenter.calculateLetterElementIndex(this.phrase, {word: 2, index: 2});

        assertEquals(11, index);
    }
});