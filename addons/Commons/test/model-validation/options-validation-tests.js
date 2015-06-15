TestCase("[Commons - Model Validation Utils] Option validation", {
    setUp: function() {
        this.option = {
            'option1': 'OPTION_1',
            'option2': 'OPTION_2',
            'option3': 'OPTION_3',
            'option4': 'OPTION_4',
            DEFAULT: 'option1'
        };
    },

    'test value undefined': function() {
        var validationResult = ModelValidationUtils.validateOption(this.option, undefined);

        assertEquals('OPTION_1', validationResult)
    },

    'test value empty string': function() {
        var validationResult = ModelValidationUtils.validateOption(this.option, '');

        assertEquals('OPTION_1', validationResult)
    },

    'test proper field value': function() {
        var validationResult = ModelValidationUtils.validateOption(this.option, 'option2');

        assertEquals('OPTION_2', validationResult)
    },

    'test default value': function() {
        var validationResult = ModelValidationUtils.validateOption(this.option, 'option99');

        assertEquals('OPTION_1', validationResult)
    },

    'test default value undefined': function() {
        delete this.option.DEFAULT;

        var validationResult = ModelValidationUtils.validateOption(this.option, 'option99');

        assertUndefined(validationResult);
    }
});