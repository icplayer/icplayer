TestCase("[Commons - Model Validation Utils] Html string validation", {
    'test undefined value': function() {
        var validationResult = ModelValidationUtils.isHtmlEmpty(undefined);

        assertTrue(validationResult);
    },

    'test empty string value': function() {
        var validationResult = ModelValidationUtils.isHtmlEmpty('');

        assertTrue(validationResult);
    },

    'test not empty string value': function() {
        var validationResult = ModelValidationUtils.isHtmlEmpty('string value');

        assertFalse(validationResult);
    },

    'test value is not a string': function() {
        var validationResult = ModelValidationUtils.isHtmlEmpty(0);

        assertFalse(validationResult);
    }
});

TestCase("[Commons - Model Validation Utils] Html code validation", {
    'test new line value': function() {
        var validationResult = ModelValidationUtils.isHtmlEmpty('<br>');
        assertTrue(validationResult);
    },

    'test empty paragraph value': function() {
        var validationResult = ModelValidationUtils.isHtmlEmpty('<p> </p>');
        assertTrue(validationResult);
    },

    'test image as a value': function() {
        var validationResult = ModelValidationUtils.isHtmlEmpty('<img src="" />');
        assertFalse(validationResult);
    },

    'test text in paragraph': function() {
        var validationResult = ModelValidationUtils.isHtmlEmpty('<p>test</p>');
        assertFalse(validationResult);
    }
});