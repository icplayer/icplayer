TestCase("[Commons - Model Validation Utils] Colors validation", {
    'test undefined value': function() {
        var validationResult = ModelValidationUtils.validateColor(undefined, undefined);

        assertFalse(validationResult.isValid);
        assertEquals("#FFFFFF", validationResult.color);
    },

    'test empty string value': function() {
        var validationResult = ModelValidationUtils.validateColor('', undefined);

        assertFalse(validationResult.isValid);
        assertEquals("#FFFFFF", validationResult.color);
    },

    'test hash tag missing': function() {
        var validationResult = ModelValidationUtils.validateColor("FFFFFF", undefined);

        assertFalse(validationResult.isValid);
        assertEquals("#FFFFFF", validationResult.color);
    },

    'test short notation': function() {
        var validationResult = ModelValidationUtils.validateColor("FFF", undefined);

        assertFalse(validationResult.isValid);
        assertEquals("#FFFFFF", validationResult.color);
    },

    'test color definition too long': function() {
        var validationResult = ModelValidationUtils.validateColor("#FFFFFFF", undefined);

        assertFalse(validationResult.isValid);
        assertEquals("#FFFFFF", validationResult.color);
    },

    'test wrong characters ': function() {
        var validationResult = ModelValidationUtils.validateColor("FFFFGA", undefined);

        assertFalse(validationResult.isValid);
        assertEquals("#FFFFFF", validationResult.color);
    },

    'test default color': function() {
        var validationResult = ModelValidationUtils.validateColor("FFFFFF", "#FF0000");

        assertFalse(validationResult.isValid);
        assertEquals("#FF0000", validationResult.color);
    }
});