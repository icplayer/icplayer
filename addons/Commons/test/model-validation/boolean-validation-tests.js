TestCase("[Commons - Model Validation Utils] Boolean validation", {
    'test undefined value': function() {
        var validationResult = ModelValidationUtils.validateBoolean(undefined);

        assertFalse(validationResult);
    },

    'test empty string': function() {
        var validationResult = ModelValidationUtils.validateBoolean('');

        assertFalse(validationResult);
    },

    'test "True" value': function() {
        var validationResult = ModelValidationUtils.validateBoolean("True");

        assertTrue(validationResult);
    },

    'test "False" value': function() {
        var validationResult = ModelValidationUtils.validateBoolean("False");

        assertFalse(validationResult);
    }
});