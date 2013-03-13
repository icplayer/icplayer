TestCase("Model sanitation", {
    setUp: function () {
        this.presenter = AddonHangman_create();
    },

    'test default model': function () {
        var model = {
            Phrases: [{
                Letters: '',
                Phrase: ''
            }],
            'Possible mistakes': '',
            ID: 'Hangman1'
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('P_01', sanitationResult.errorCode);
    },

    'test phrases problem': function () {
        var model = {
            Phrases: [{
                Letters: 'A,BA',
                Phrase: 'Hangman'
            }],
            'Possible mistakes': ''
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('L_01', sanitationResult.errorCode);
    },

    'test number of trials incorrect': function () {
        var model = {
            Phrases: [{
                Letters: '',
                Phrase: 'Hangman'
            }],
            'Possible mistakes': 'trials'
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('T_01', sanitationResult.errorCode);
    },

    'test proper config': function () {
        var model = {
            Phrases: [{
                Letters: '',
                Phrase: 'Hangman'
            }],
            'Possible mistakes': '3',
            ID: 'Hangman1'
        };
        var expectedPhrases = [{
            letters: this.presenter.DEFAULT_LETTERS,
            phrase: ['HANGMAN'],
            errorCount: 0,
            selectedLetters: []
        }];

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertFalse(sanitationResult.isError);
        assertEquals(expectedPhrases, sanitationResult.phrases);
        assertEquals(3, sanitationResult.trialsCount);
        assertEquals('Hangman1', sanitationResult.addonID);
    }
});