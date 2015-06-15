TestCase("[Commons - Model Validation Utils] String validation", {
    'test undefined value': function() {
        var validationResult = ModelValidationUtils.isStringEmpty(undefined);

        assertTrue(validationResult);
    },

    'test empty string value': function() {
        var validationResult = ModelValidationUtils.isStringEmpty('');

        assertTrue(validationResult);
    },

    'test not empty string value': function() {
        var validationResult = ModelValidationUtils.isStringEmpty('string value');

        assertFalse(validationResult);
    },

    'test value is not a string': function() {
        var validationResult = ModelValidationUtils.isStringEmpty(0);

        assertFalse(validationResult);
    }
});

TestCase("[Commons - Model Validation Utils] String with prefix validation", {
    'test undefined value': function() {
        var validationResult = ModelValidationUtils.isStringWithPrefixEmpty(undefined, undefined);

        assertTrue(validationResult);
    },

    'test string containing only prefix value': function() {
        var validationResult = ModelValidationUtils.isStringWithPrefixEmpty('/file/', '/file/');

        assertTrue(validationResult);
    },

    'test not empty value': function() {
        var validationResult = ModelValidationUtils.isStringWithPrefixEmpty('/files/serve/sound.aac', '/file/');

        assertFalse(validationResult);
    }
});