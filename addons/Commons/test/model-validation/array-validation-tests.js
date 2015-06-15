TestCase("[Commons - Model Validation Utils] Array element validation", {
    'test undefined value': function() {
        var validationResult = ModelValidationUtils.isArrayElementEmpty(undefined);

        assertTrue(validationResult);
    },

    'test empty element': function() {
        var element = {
            field1: "",
            field2: "",
            field3: ""
        };

        var validationResult = ModelValidationUtils.isArrayElementEmpty(element);

        assertTrue(validationResult);
    },

    'test not empty element': function() {
        var element = {
            field1: "",
            field2: "value",
            field3: ""
        };

        var validationResult = ModelValidationUtils.isArrayElementEmpty(element);

        assertFalse(validationResult);
    }
});
TestCase("[Commons - Model Validation Utils] Array validation", {
    'test undefined value': function() {
        var validationResult = ModelValidationUtils.isArrayEmpty(undefined);

        assertTrue(validationResult);
    },

    'test empty element': function() {
        var array = [{
            field1: "",
            field2: "",
            field3: ""
        }];

        var validationResult = ModelValidationUtils.isArrayEmpty(array);

        assertTrue(validationResult);
    },

    'test not empty first element': function() {
        var array = [{
            field1: "",
            field2: "field value",
            field3: ""
        }];

        var validationResult = ModelValidationUtils.isArrayEmpty(array);

        assertFalse(validationResult);
    },

    'test empty first element but array length too high': function() {
        var array = [{
            field1: "",
            field2: "",
            field3: ""
        }, {
            field1: "",
            field2: "",
            field3: ""
        }];

        var validationResult = ModelValidationUtils.isArrayEmpty(array);

        assertFalse(validationResult);
    }
});