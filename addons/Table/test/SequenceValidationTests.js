TestCase("[Table] Single number validation", {
    setUp: function () {
        this.presenter = AddonTable_create();
    },

    'test valid column number': function () {
        var validationResult = this.presenter.validateSingleNumber('1', 3);

        assertTrue(validationResult.isValid);
        assertEquals(1, validationResult.value);
        assertUndefined(validationResult.errorCode);
    },

    'test column number is NaN': function () {
        var validationResult = this.presenter.validateSingleNumber('a', 3, false);

        assertFalse(validationResult.isValid);
        assertEquals('CO_02', validationResult.errorCode);
        assertUndefined(validationResult.value);
    },

    'test row number is NaN': function () {
        var validationResult = this.presenter.validateSingleNumber('a', 3, true);

        assertFalse(validationResult.isValid);
        assertEquals('CO_01', validationResult.errorCode);
        assertUndefined(validationResult.value);
    },

    'test row number out of bounds': function () {
        var validationResult = this.presenter.validateSingleNumber('4', 3, true);

        assertFalse(validationResult.isValid);
        assertEquals('CO_03', validationResult.errorCode);
        assertUndefined(validationResult.value);
    }
});

TestCase("[Table] Sequence validation", {
    setUp: function () {
        this.presenter = AddonTable_create();
    },

    'test single valid column number': function () {
        var validationResult = this.presenter.validateSequence('1', 3);

        assertTrue(validationResult.isValid);
        assertEquals([1], validationResult.values);
        assertUndefined(validationResult.errorCode);
    },

    'test single invalid column number': function () {
        var validationResult = this.presenter.validateSequence('-2', 3);

        assertFalse(validationResult.isValid);
        assertEquals('CO_02', validationResult.errorCode);
        assertUndefined(validationResult.values);
    },

    'test multiple valid column numbers': function () {
        var validationResult = this.presenter.validateSequence('1, 2', 3);

        assertTrue(validationResult.isValid);
        assertEquals([1, 2], validationResult.values);
        assertUndefined(validationResult.errorCode);
    },

    'test multiple column numbers with one invalid': function () {
        var validationResult = this.presenter.validateSequence('1, -2', 3);

        assertFalse(validationResult.isValid);
        assertEquals('CO_02', validationResult.errorCode);
        assertUndefined(validationResult.values);
    },

    'test column numbers must be sequential': function () {
        var validationResult = this.presenter.validateSequence('1, 3', 3);

        assertFalse(validationResult.isValid);
        assertEquals('CR_00', validationResult.errorCode);
        assertUndefined(validationResult.values);
    }
});