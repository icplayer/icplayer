TestCase("[Double State Button] String validation", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();
    },

    'test string undefined': function () {
        var validationResult = this.presenter.validateString(undefined);

        assertTrue(validationResult.isEmpty);
        assertEquals("", validationResult.value);
    },

    'test string empty': function () {
        var validationResult = this.presenter.validateString("");

        assertTrue(validationResult.isEmpty);
        assertEquals("", validationResult.value);
    },

    'test string not empty': function () {
        var validationResult = this.presenter.validateString("/file/serve/234566");

        assertFalse(validationResult.isEmpty);
        assertEquals("/file/serve/234566", validationResult.value);
    }
});