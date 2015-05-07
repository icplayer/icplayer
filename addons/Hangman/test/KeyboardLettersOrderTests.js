TestCase("[Hangman] Keyboard letters order validation", {
    setUp: function () {
        this.presenter = AddonHangman_create();
    },

    'test empty value dont change order': function () {
        var validationResult = this.presenter.validateKeyboardLettersOrder({
            "Keyboard Letters Order": ""
        });

        assertFalse(validationResult.isError);
        assertFalse(validationResult.isCustomKeyboardLettersOrderSet);

        validationResult = this.presenter.validateKeyboardLettersOrder({
            "Keyboard Letters Order": "                          "
        });

        assertFalse(validationResult.isError);
        assertFalse(validationResult.isCustomKeyboardLettersOrderSet);
    },

    'test only single letters should be allowed': function () {
        var expectedResult = ["A", "B", "C", "E", "F", "G", "H", "I", "J", "%", "#"];

        var validationResult = this.presenter.validateKeyboardLettersOrder({
            "Keyboard Letters Order": "a, b, c, e, f, g, h, i, j, %, #"
        });

        assertFalse(validationResult.isError);
        assertEquals(expectedResult, validationResult.value);
        assertTrue(validationResult.isCustomKeyboardLettersOrderSet);
    },

    'test letters with more than single character should be invalid': function () {
        var validationResult = this.presenter.validateKeyboardLettersOrder({
            "Keyboard Letters Order": "a, b, c, e, asfdas"
        });

        assertTrue(validationResult.isError);
        assertEquals("KLO_01", validationResult.errorCode);
    },

    'test letters shouldnt duplicate': function () {
        var validationResult = this.presenter.validateKeyboardLettersOrder({
            "Keyboard Letters Order": "a, b, c, e, a"
        });

        assertTrue(validationResult.isError);
        assertEquals("KLO_02", validationResult.errorCode);
    }
});