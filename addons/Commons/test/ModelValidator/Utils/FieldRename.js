TestCase("[Commons - Model Validator Utils] Field rename", {
    setUp: function () {
        this.exampleModel = {
            test1: "Test"
        };

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

        this.modelValidator = new ModelValidator();
        this.util = window.ModelValidators.utils.FieldRename;
    },

    'test FieldRename will change validated field name': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.util("test1", "test2", this.validatorsStubs.passedValue("test1"))
        ]);

        assertEquals(validatedModel.value['test2'], "Test");
    },


    'test fieldName is returned while validation error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.util("test1", "test2", this.validatorsStubs.errorCode("test_val"))
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals(validatedModel.fieldName, "test_val");
        assertEquals(validatedModel.errorCode, "TEST_CODE01");
    },

    'test only first FieldRename will works': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.util("test1", "test2", this.util("test2", "test3", this.validatorsStubs.passedValue("test1")))
        ]);

        assertEquals(validatedModel.value['test2'], "Test");
    }

});