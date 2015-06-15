TestCase("[Commons - Model Validation Utils] Integer validation", {
    'test undefined value':function () {
        var validationResult = ModelValidationUtils.validateInteger(undefined);

        assertFalse(validationResult.isValid);
        assertNaN(validationResult.value);
    },

    'test empty string value':function () {
        var validationResult = ModelValidationUtils.validateInteger('');

        assertFalse(validationResult.isValid);
        assertNaN(validationResult.value);
    },

    'test zero value as string':function () {
        var validationResult = ModelValidationUtils.validateInteger('0');

        assertTrue(validationResult.isValid);
        assertEquals(0, validationResult.value);
    },

    'test zero value as number':function () {
        var validationResult = ModelValidationUtils.validateInteger(0);

        assertTrue(validationResult.isValid);
        assertEquals(0, validationResult.value);
    },

    'test value is not a number':function () {
        var validationResult = ModelValidationUtils.validateInteger('value');

        assertFalse(validationResult.isValid);
        assertNaN(validationResult.value);
    },

    'test valid value':function () {
        var validationResult = ModelValidationUtils.validateInteger('10');

        assertTrue(validationResult.isValid);
        assertEquals(10, validationResult.value);
    }
});

TestCase("[Commons - Model Validation Utils] Positive integer validation", {
    'test undefined value':function () {
        var validationResult = ModelValidationUtils.validatePositiveInteger(undefined);

        assertFalse(validationResult.isValid);
        assertNaN(validationResult.value);
    },

    'test zero value':function () {
        var validationResult = ModelValidationUtils.validatePositiveInteger('0');

        assertFalse(validationResult.isValid);
        assertNaN(validationResult.value);
    },

    'test negative value':function () {
        var validationResult = ModelValidationUtils.validatePositiveInteger('-5');

        assertFalse(validationResult.isValid);
        assertNaN(validationResult.value);
    },

    'test valid value':function () {
        var validationResult = ModelValidationUtils.validatePositiveInteger('10');

        assertTrue(validationResult.isValid);
        assertEquals(10, validationResult.value);
    }
});

TestCase("[Commons - Model Validation Utils] Integer in range validation", {
    'test value lower than minimum': function () {
        var validationResult = ModelValidationUtils.validateIntegerInRange('1', 4, 2);

        assertFalse(validationResult.isValid);
    },

    'test value higher than maximum': function () {
        var validationResult = ModelValidationUtils.validateIntegerInRange('5', 4, 2);

        assertFalse(validationResult.isValid);
    },

    'test proper value': function () {
        var validationResult = ModelValidationUtils.validateIntegerInRange('4', 4, 2);

        assertTrue(validationResult.isValid);
        assertEquals(4, validationResult.value);
    },

    'test positive integer range': function () {
        var validationResult = ModelValidationUtils.validateIntegerInRange('0', 4, undefined);

        assertTrue(validationResult.isValid);
        assertEquals(0, validationResult.value);
    },

    'test positive integer value': function () {
        var validationResult = ModelValidationUtils.validateIntegerInRange('2', 4, 1);

        assertTrue(validationResult.isValid);
        assertEquals(2, validationResult.value);
    }
});

TestCase("[Commons - Model Validation Utils] Float validation", {
    'test undefined value': function () {
        var validationResult = ModelValidationUtils.validateFloat(undefined, undefined);

        assertFalse(validationResult.isValid);
        assertNaN(validationResult.value);
    },

    'test empty string value': function () {
        var validationResult = ModelValidationUtils.validateFloat('', undefined);

        assertFalse(validationResult.isValid);
        assertNaN(validationResult.value);
    },

    'test value is not a number': function () {
        var validationResult = ModelValidationUtils.validateFloat('value', undefined);

        assertFalse(validationResult.isValid);
        assertNaN(validationResult.value);
    },

    'test valid value': function () {
        var validationResult = ModelValidationUtils.validateFloat('10.5', undefined);

        assertTrue(validationResult.isValid);
        assertEquals(10.5, validationResult.value);
    },

    'test precision different than default': function () {
        var validationResult = ModelValidationUtils.validateFloat('2.39', 1);

        assertTrue(validationResult.isValid);
        assertEquals(2.4, validationResult.value);
    }
});

TestCase("[Commons - Model Validation Utils] Float in range validation", {
    'test value lower than minimum': function () {
        var validationResult = ModelValidationUtils.validateFloatInRange('1.0', 4, 2, undefined);

        assertFalse(validationResult.isValid);
    },

    'test value higher than maximum': function () {
        var validationResult = ModelValidationUtils.validateFloatInRange('5.0', 4, 2, undefined);

        assertFalse(validationResult.isValid);
    },

    'test proper value': function () {
        var validationResult = ModelValidationUtils.validateFloatInRange('4.1', 5, 2, undefined);

        assertTrue(validationResult.isValid);
        assertEquals(4.1, validationResult.value);
    },

    'test not negative value range': function () {
        var validationResult = ModelValidationUtils.validateFloatInRange('0', 4, undefined, undefined);

        assertTrue(validationResult.isValid);
        assertEquals(0, validationResult.value);
    },

    'test positive integer value': function () {
        var validationResult = ModelValidationUtils.validateFloatInRange('2.35', 4, 1, undefined);

        assertTrue(validationResult.isValid);
        assertEquals(2.35, validationResult.value);
    },

    'test value out of range after applying precision': function () {
        var validationResult = ModelValidationUtils.validateFloatInRange('4.16', 4.14, 1, 1);

        assertFalse(validationResult.isValid);
    },

    'test value in range without applying precision': function () {
        var validationResult = ModelValidationUtils.validateFloatInRange('4.16', 4.17, 1, undefined);

        assertTrue(validationResult.isValid);
        assertEquals(4.16, validationResult.value);
    },

    'test value in range after applying precision': function () {
        var validationResult = ModelValidationUtils.validateFloatInRange('4.17', 4.15, 1, 1);

        assertTrue(validationResult.isValid);
        assertEquals(4.2, validationResult.value);
    },

    'test float value starting with 0': function () {
        var validationResult = ModelValidationUtils.validateFloatInRange('0.17', 4.15, 0, 2);

        assertTrue(validationResult.isValid);
        assertEquals(0.17, validationResult.value);
    },

    'test float parsedValue has proper type': function () {
        var validationResult = ModelValidationUtils.validateFloatInRange('0.17', 4.15, 0, 2);

        assertTrue(validationResult.isValid);
        assertTypeOf('number', validationResult.parsedValue);
    },

    'test float in range when value is out of range': function () {
        var validationResult = ModelValidationUtils.validateFloatInRange('-6', 5.00, -5.00, 2);

        assertFalse(validationResult.isValid);
    }
});
