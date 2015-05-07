TestCase("[Hangman] Phrase sanitation", {
    setUp: function () {
        this.presenter = AddonHangman_create();
    },

    'test empty phrase': function () {
        var sanitationResult = this.presenter.sanitizePhrase('');

        assertTrue(sanitationResult.isError);
        assertEquals('W_01', sanitationResult.errorCode);
    },

    'test single word phrase': function () {
        var sanitationResult = this.presenter.sanitizePhrase('phrase');

        assertFalse(sanitationResult.isError);
        assertEquals(['PHRASE'], sanitationResult.phrase);
    },

    'test single word phrase with whitespaces': function () {
        var sanitationResult = this.presenter.sanitizePhrase(' phrase  ');

        assertFalse(sanitationResult.isError);
        assertEquals(['PHRASE'], sanitationResult.phrase);
    },

    'test multiple words phrase': function () {
        var sanitationResult = this.presenter.sanitizePhrase('phrase and some text');

        assertFalse(sanitationResult.isError);
        assertEquals(['PHRASE', 'AND', 'SOME', 'TEXT'], sanitationResult.phrase);
    },

    'test multiple words phrase with whitespaces': function () {
        var sanitationResult = this.presenter.sanitizePhrase('phrase and  some text  ');

        assertFalse(sanitationResult.isError);
        assertEquals(['PHRASE', 'AND', 'SOME', 'TEXT'], sanitationResult.phrase);
    }
});