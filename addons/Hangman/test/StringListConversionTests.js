TestCase("[Hangman] String array validation", {
    setUp: function() {
        this.presenter = AddonHangman_create();
    },

    'test valid list representation': function () {
        assertTrue(this.presenter.isArrayWithLettersValid(['A','B','C','D','E']));
    },

    'test invalid list representation': function () {
        assertFalse(this.presenter.isArrayWithLettersValid(['A','B','CZ','D','E']));
    }
});

TestCase("[Hangman] String array conversion", {
    setUp: function() {
        this.presenter = AddonHangman_create();
    },

    'test empty list': function () {
        var result = this.presenter.convertStringArray('');

        assertEquals(this.presenter.DEFAULT_LETTERS, result);
    },

    'test undefined list': function () {
        var result = this.presenter.convertStringArray(undefined);

        assertEquals(this.presenter.DEFAULT_LETTERS, result);
    },

    'test not empty list': function () {
        var result = this.presenter.convertStringArray('A,B,C,D,E');

        assertEquals(['A', 'B', 'C', 'D', 'E'], result);
    },

    'test small letters': function () {
        var result = this.presenter.convertStringArray('a,b,c,d,e');

        assertEquals(['A', 'B', 'C', 'D', 'E'], result);
    },

    'test cyrillic letters list': function () {
        var result = this.presenter.convertStringArray('\u0430,\u0431,\u0432,\u0433,\u0434,\u0435,\u0436');

        assertEquals(['\u0410', '\u0411', '\u0412', '\u0413', '\u0414', '\u0415', '\u0416'], result);
    },

    'test whitespaces in list': function () {
        var result = this.presenter.convertStringArray('A, B, C,D ,E');

        assertEquals(['A', 'B', 'C', 'D', 'E'], result);
    },

    'test empty items in list': function () {
        var result = this.presenter.convertStringArray('A,,C,,E');

        assertEquals(['A', 'C', 'E'], result);
    },

    'test letters are not sorted': function () {
        var result = this.presenter.convertStringArray('a,b,e,D,C');

        assertEquals(['A', 'B', 'C', 'D', 'E'], result);
    }
});