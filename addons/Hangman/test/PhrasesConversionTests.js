TestCase("[Hangman] Phrases conversion", {
    setUp: function () {
        this.presenter = AddonHangman_create();
    },

    'test empty phrases': function () {
        var phrases = [{
            Letters: '',
            Phrase: ''
        }];

        var sanitationResult = this.presenter.sanitizePhrases(phrases);

        assertTrue(sanitationResult.isError);
        assertEquals('P_01', sanitationResult.errorCode);
    },

    'test empty phrase': function () {
        var phrases = [{
            Letters: 'h,a,n,g,m',
            Phrase: ''
        }];

        var sanitationResult = this.presenter.sanitizePhrases(phrases);

        assertTrue(sanitationResult.isError);
        assertEquals('W_01', sanitationResult.errorCode);
    },

    'test phrase with white space': function () {
        var phrases = [{
            Letters: 'h,a,n,g,m',
            Phrase: ' '
        }];

        var sanitationResult = this.presenter.sanitizePhrases(phrases);

        assertTrue(sanitationResult.isError);
        assertEquals('W_01', sanitationResult.errorCode);
    },

    'test phrase only with exclamation mark': function () {
        var phrases = [{
            Letters: 'h,a,n,g,m',
            Phrase: '!'
        }];

        var sanitationResult = this.presenter.sanitizePhrases(phrases);

        assertTrue(sanitationResult.isError);
        assertEquals('W_04', sanitationResult.errorCode);
    },

    'test letters definition problem': function () {
        var phrases = [{
            Letters: 'A,BA',
            Phrase: 'Hangman'
        }];

        var sanitationResult = this.presenter.sanitizePhrases(phrases);

        assertTrue(sanitationResult.isError);
        assertEquals('L_01', sanitationResult.errorCode);
    },

    'test word consist letters that are not specified': function () {
        var phrases = [{
            Letters: 'h,a,n,g,m',
            Phrase: 'Hangmans'
        }];

        var sanitationResult = this.presenter.sanitizePhrases(phrases);

        assertTrue(sanitationResult.isError);
        assertEquals('W_02', sanitationResult.errorCode);
    },

    'test word consist two exclemation marks before one letter': function () {
        var phrases = [{
            Letters: 'h,a,n,g,m',
            Phrase: 'Ha!!ngm!an'
        }];

        var sanitationResult = this.presenter.sanitizePhrases(phrases);

        assertTrue(sanitationResult.isError);
        assertEquals('W_03', sanitationResult.errorCode);
    },

    'test valid single phrase': function () {
        var phrases = [{
            Letters: 'h,a,n,g,m',
            Phrase: 'Hangman'
        }];
        var expectedPhrases = [{
            letters: ['A', 'G', 'H', 'M', 'N'],
            phrase: ['HANGMAN'],
            errorCount: 0,
            selectedLetters: []
        }];

        var sanitationResult = this.presenter.sanitizePhrases(phrases);

        assertFalse(sanitationResult.isError);
        assertEquals(expectedPhrases, sanitationResult.phrases);
    },

    'test valid multiple phrases': function () {
        var phrases = [{
            Letters: 'h,a,n,g,m',
            Phrase: 'Hangman'
        }, {
            Letters: '',
            Phrase: 'Hangman and some freaky text'
        }];
        var expectedPhrases = [{
            letters: ['A', 'G', 'H', 'M', 'N'],
            phrase: ['HANGMAN'],
            errorCount: 0,
            selectedLetters: []
        }, {
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN', 'AND', 'SOME', 'FREAKY', 'TEXT'],
            errorCount: 0,
            selectedLetters: []
        }];

        var sanitationResult = this.presenter.sanitizePhrases(phrases);

        assertFalse(sanitationResult.isError);
        assertEquals(expectedPhrases, sanitationResult.phrases);
    }
});