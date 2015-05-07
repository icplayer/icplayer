TestCase("[Hangman] Model sanitation", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.keyboardLettersOrder = "";
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

        model["Keyboard Letters Order"] = this.keyboardLettersOrder;

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

        model["Keyboard Letters Order"] = this.keyboardLettersOrder;

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

        model["Keyboard Letters Order"] = this.keyboardLettersOrder;

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

        model["Keyboard Letters Order"] = this.keyboardLettersOrder;

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertFalse(sanitationResult.isError);
        assertEquals(expectedPhrases, sanitationResult.phrases);
        assertEquals(3, sanitationResult.trialsCount);
        assertEquals('Hangman1', sanitationResult.addonID);
    },

    'test proper config with custom keyboard letters order set': function () {
        var model = {
            Phrases: [{
                Letters: '',
                Phrase: 'Hangman'
            }],
            'Possible mistakes': '3',
            ID: 'Hangman1',
            "Keyboard Letters Order": "a, b, c"
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
        assertTrue(sanitationResult.isCustomKeyboardLettersOrderSet);
        assertEquals(['A', 'B', 'C'], sanitationResult.keyboardLettersOrder);
    },

    'test proper config without custom keyboard letters order set': function () {
        var model = {
            Phrases: [{
                Letters: '',
                Phrase: 'Hangman'
            }],
            'Possible mistakes': '3',
            ID: 'Hangman1',
            "Keyboard Letters Order": ""
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
        assertFalse(sanitationResult.isCustomKeyboardLettersOrderSet);
        assertEquals([], sanitationResult.keyboardLettersOrder);
    },

    'test proper config without custom keyboard letters order set': function () {
        var model = {
            Phrases: [{
                Letters: '',
                Phrase: 'Hangman'
            }],
            'Possible mistakes': '3',
            ID: 'Hangman1',
            "Keyboard Letters Order": "asvdavadsfdsa"
        };


        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals("KLO_01", sanitationResult.errorCode);
    }
});

TestCase("[Hangman] Model sanization flow", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.stubs = {
            sanitizePhrases: sinon.stub(this.presenter, 'sanitizePhrases'),
            validateKeyboardLettersOrder: sinon.stub(this.presenter, 'validateKeyboardLettersOrder'),
            validateTrialsCount: sinon.stub(this.presenter, 'validateTrialsCount')
        };
    },

    tearDown: function () {
        this.presenter.sanitizePhrases.restore();
        this.presenter.validateKeyboardLettersOrder.restore();
        this.presenter.validateTrialsCount.restore();
    },

    'test failed sanitize phrases': function () {
        this.stubs.sanitizePhrases.returns({isError: true, errorCode: "fail"});

        var validationResult = this.presenter.sanitizeModel({});

        assertTrue(validationResult.isError);
        assertTrue(this.stubs.sanitizePhrases.calledOnce);

        assertFalse(this.stubs.validateKeyboardLettersOrder.called);
        assertFalse(this.stubs.validateTrialsCount.called);
        assertEquals("fail", validationResult.errorCode);
    },

    'test failed trails count': function () {
        this.stubs.sanitizePhrases.returns({isError: false, phrases: []});
        this.stubs.validateTrialsCount.returns({isValid: false, errorCode: "fail", isError: true});

        var validationResult = this.presenter.sanitizeModel({});

        assertTrue(validationResult.isError);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.sanitizePhrases.calledOnce);
        assertTrue(this.stubs.validateTrialsCount.calledOnce);

        assertFalse(this.stubs.validateKeyboardLettersOrder.called);
    },

    'test failed keyboard letters order': function () {
        this.stubs.sanitizePhrases.returns({isError: false, phrases: []});
        this.stubs.validateTrialsCount.returns({isValid: true, value: ""});
        this.stubs.validateKeyboardLettersOrder.returns({isError: true, errorCode: "fail"});

        var validationResult = this.presenter.sanitizeModel({});

        assertTrue(validationResult.isError);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.sanitizePhrases.calledOnce);
        assertTrue(this.stubs.validateTrialsCount.calledOnce);
        assertTrue(this.stubs.validateKeyboardLettersOrder.called);
    },

    'test valid model': function () {
        this.stubs.sanitizePhrases.returns({isError: false, phrases: []});
        this.stubs.validateTrialsCount.returns({isValid: true, value: ""});
        this.stubs.validateKeyboardLettersOrder.returns({isError: false, value: [], isCustomKeyboardLettersOrderSet: true});

        var validationResult = this.presenter.sanitizeModel({});

        assertFalse(validationResult.isError);
        assertUndefined(validationResult.errorCode);

        assertTrue(this.stubs.sanitizePhrases.calledOnce);
        assertTrue(this.stubs.validateTrialsCount.calledOnce);
        assertTrue(this.stubs.validateKeyboardLettersOrder.called);

        assertEquals([], validationResult.phrases);
        assertEquals("", validationResult.trialsCount);
        assertEquals([], validationResult.keyboardLettersOrder);
        assertEquals(true, validationResult.isCustomKeyboardLettersOrderSet);
    }
});