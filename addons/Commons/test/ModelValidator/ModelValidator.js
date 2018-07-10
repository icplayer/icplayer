TestCase("[Commons - Model Validator] Base structure", {
    setUp: function () {
        var validatorDecorator = window.ModelValidator.prototype.__validatorDecorator__;

        this.validatorsStubs = {
            errorCode: validatorDecorator(function () {
                return this.generateErrorCode("TEST_CODE01")
            }),
            validValue: validatorDecorator(function () {
               return this.generateValidValue("VALID_VALUE");
            }),
            passedConfig: validatorDecorator(function (valueToValidate, config) {
               return this.generateValidValue(config);
            }),
            passedValue: validatorDecorator(function (valueToValidate) {
                return this.generateValidValue(valueToValidate);
            })
        };

        this.exampleModel = {
            test1: "__OK__",
            test2: 22131,
            test3: 2314,
            test4: null,
            test5: undefined
        };

        this.modelValidator = new ModelValidator();
    },

    'test not valid model will return error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.validValue("test2"),
            this.validatorsStubs.errorCode("test1")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("TEST_CODE01", validatedModel.errorCode);
    },

    'test valid model will return correct value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.validValue("test1"),
            this.validatorsStubs.validValue("test2")
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals("VALID_VALUE", validatedModel.value['test1']);
        assertEquals("VALID_VALUE", validatedModel.value['test2']);
    },

    'test not valid model will return correct field name': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.validValue("test2"),
            this.validatorsStubs.errorCode("test1")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("test1", validatedModel.fieldName);
    },

    'test model validator must pass unchanged config to validator': function () {
        var config = {"A":"A", "b": 123123},
            config2 = "dsfsf";

        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.passedConfig("test1", config),
            this.validatorsStubs.passedConfig("test2", config2)
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals(config, validatedModel.value['test1']);
        assertEquals(config2, validatedModel.value['test2']);
    },

    'test validator will receive valid value to validate': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.passedValue("test1"),
            this.validatorsStubs.passedValue("test2")
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals("__OK__", validatedModel.value['test1']);
        assertEquals(22131, validatedModel.value['test2']);
    },

    'test validator wont be run if shouldRunValidator function returns false': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.validValue("test1"),
            this.validatorsStubs.validValue("test2", {}, function () {
                return false;
            })
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals("VALID_VALUE", validatedModel.value['test1']);
        assertEquals(undefined, validatedModel.value['test2']);
    },

    'test if config is not provided then as default will be empty object': function () {
        var config = {"A":"A", "b": 123123};

        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.passedConfig("test1", config),
            this.validatorsStubs.passedConfig("test2")
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals(config, validatedModel.value['test1']);
        assertEquals({}, validatedModel.value['test2']);
    },

    'test if shouldRunValidator function returns true then validator will be run': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.validValue("test1"),
            this.validatorsStubs.validValue("test2", {}, function () {
                return true;
            })
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals("VALID_VALUE", validatedModel.value['test1']);
        assertEquals("VALID_VALUE", validatedModel.value['test2']);
    },

    'test validators are run in correct order': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.passedValue("test1"),
            this.validatorsStubs.passedValue("test2", {}, function () {
                return this.validatedModel['test1'] === "__OK__";
            }),
            this.validatorsStubs.passedValue("test3", {}, function () {
                return this.validatedModel['test2'] === 22131 && this.validatedModel['test1'] === "__OK__";
            })
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals("__OK__", validatedModel.value['test1']);
        assertEquals(22131, validatedModel.value['test2']);
        assertEquals(2314, validatedModel.value['test3']);
    },

    'test actual scope is correctly passed' : function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.passedValue("test1"),
            this.validatorsStubs.passedValue("test2", {}, function (actualScope) {
                return actualScope['test1'] === "__OK__";
            }),
            this.validatorsStubs.passedValue("test3", {}, function (actualScope) {
                return actualScope['test2'] === 22131 && actualScope['test1'] === "__OK__";
            })
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals("__OK__", validatedModel.value['test1']);
        assertEquals(22131, validatedModel.value['test2']);
        assertEquals(2314, validatedModel.value['test3']);
    },

    'test fields without passed validator wont be validated': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.passedValue("test1"),
            this.validatorsStubs.passedValue("test2")
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals("__OK__", validatedModel.value['test1']);
        assertEquals(22131, validatedModel.value['test2']);
        assertEquals(undefined, validatedModel.value['test3']);
    },

    'test if second parameter of validator is function then this function will be shouldRunValidator function': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.validValue("test1"),
            this.validatorsStubs.validValue("test2", function () {
                return true;
            })
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals("VALID_VALUE", validatedModel.value['test1']);
        assertEquals("VALID_VALUE", validatedModel.value['test2']);
    },

    'test if second parameter of validator is function then config will be empty object': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.validValue("test1"),
            this.validatorsStubs.passedConfig("test2", function () {
                return true;
            })
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals("VALID_VALUE", validatedModel.value['test1']);
        assertEquals({}, validatedModel.value['test2']);
    },

    'test if provided value to validator is null then validator automatically return error code': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.validValue("test4"),
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("UMF01", validatedModel.errorCode);
    },

    'test if provided value to validator is undefined then validator automatically return error code': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validatorsStubs.validValue("test5"),
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("UMF01", validatedModel.errorCode);
    }
});