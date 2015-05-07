TestCase("[Hangman] Needed letters for phrase", {
    setUp: function () {
        this.presenter = AddonHangman_create();
    },

    'test single word phrase': function () {
        var neededLetters = this.presenter.getNeededLetters(["ABCD"]);

        assertEquals(['A', 'B', 'C', 'D'], neededLetters);
    },

    'test multiple words in phrase': function () {
        var neededLetters = this.presenter.getNeededLetters(["ABCD", "XYZ"]);

        assertEquals(['A', 'B', 'C', 'D', 'X', 'Y', 'Z'], neededLetters);
    },

    'test letter multiple occurrence in phrase': function () {
        var neededLetters = this.presenter.getNeededLetters(["ABCD", "CDEF", "XYZ"]);

        assertEquals(['A', 'B', 'C', 'D', 'E', 'F', 'X', 'Y', 'Z'], neededLetters);
    }
});