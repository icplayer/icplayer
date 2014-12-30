TestCase("[Table Of Contents] Hidden Pages", {
    setUp: function () {
        this.presenter = AddonTable_Of_Contents_create();
    },

    'test proper values': function () {
        var validationResult = this.presenter.validateHiddenPages("3;4;6");

        assertTrue(validationResult.isValid);
        assertEquals([3, 4, 6], validationResult.value);
    },

    'test with page not a number': function () {
        var validationResult = this.presenter.validateHiddenPages("1;E");

        assertFalse(validationResult.isValid);
        assertEquals("E01", validationResult.errorCode);
    },

    'test with page number less then 0': function () {
        var validationResult = this.presenter.validateHiddenPages("4;-1");

        assertFalse(validationResult.isValid);
        assertEquals("E02", validationResult.errorCode);
    },

    'test multiple occurrences of same page number': function () {
        var validationResult = this.presenter.validateHiddenPages("2;3;3;4");

        assertFalse(validationResult.isValid);
        assertEquals("E03", validationResult.errorCode);
    },

    'test empty string': function () {
        var validationResult = this.presenter.validateHiddenPages("");

        assertTrue(validationResult.isValid);
        assertEquals("", validationResult.value);
    },

    'test passed value is undefined': function () {
        var validationResult = this.presenter.validateHiddenPages(undefined);

        assertTrue(validationResult.isValid);
        assertEquals("", validationResult.value);
    }
});