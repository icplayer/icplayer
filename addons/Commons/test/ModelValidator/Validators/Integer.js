TestCase("[Commons - Model Validator] Integer validator", {
    setUp: function () {
        this.exampleModel = {
            test1: "12",
            test2: "122ddf",
            test3: "dfs213",
            test4: "234.34",
            test5: "",
            test6: "  ",
            test7: "  213 ",
            test8: "-123",
            test9: 213123
        };

        this.modelValidator = new ModelValidator();
        this.validator = window.ModelValidators.Integer;
    },

    'test value with integer as string returns correct number value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1")
        ]);

        assertEquals(12, validatedModel.value['test1']);
    },

    'test value with integers at start and characters at end will returns error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test2")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("INT02", validatedModel.errorCode);
    },

    'test value with characters at start returns errorCode': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test3")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("INT02", validatedModel.errorCode);
    },

    'test if value is double precision string then returns error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test4")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("INT02", validatedModel.errorCode);
    },

    'test if value is empty then will returns error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test5")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("INT01", validatedModel.errorCode);
    },

    'test if default value is 0 then value will be 0': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test6", {default: 0})
        ]);

        assertEquals(0, validatedModel.value['test6']);
    },

    'test if default value is set then will return default value if is empty': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test6", {default: 20})
        ]);

        assertEquals(20, validatedModel.value['test6']);
    },

    'test if default value as null then will return null value if if empty': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test6", {default: null})
        ]);

        assertEquals(null, validatedModel.value['test6']);
    },

    'test if value contains white spaces at start and end then will correctly parse value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test7")
        ]);

        assertEquals(213, validatedModel.value['test7']);
    },

    'test if value is too large then will returns error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {maxValue: 11})
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("INT03", validatedModel.errorCode);
    },

    'test if value is below or equal than max value then will return correct value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {maxValue: 12}),
            this.validator("test7", {maxValue: 300})
        ]);

        assertEquals(12, validatedModel.value['test1']);
        assertEquals(213, validatedModel.value['test7']);
    },

    'test if value to small then will returns error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {minValue: 20})
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("INT04", validatedModel.errorCode);
    },

    'test if value is above or equal min value then will return correct value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {minValue: 12}),
            this.validator("test7", {minValue: 1})
        ]);

        assertEquals(12, validatedModel.value['test1']);
        assertEquals(213, validatedModel.value['test7']);
    },

    'test if provided value is between minValue and maxValue then will returns correctValue': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {minValue: 12, maxValue: 12}),
            this.validator("test7", {minValue: 1, maxValue: 300})
        ]);

        assertEquals(12, validatedModel.value['test1']);
        assertEquals(213, validatedModel.value['test7']);
    },

    'test if provided value is above provided interval then will return error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {minValue: 12, maxValue: 12}),
            this.validator("test7", {minValue: 1, maxValue: 200})
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("INT03", validatedModel.errorCode);
    },

    'test if provided value is below provided interval then will return error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {minValue: 12, maxValue: 12}),
            this.validator("test7", {minValue: 290, maxValue: 300})
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("INT04", validatedModel.errorCode);
    },

    'test validator works for negative values': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test8")
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals(-123, validatedModel.value['test8']);
    },

    'test if provided value is not a string then validator returns error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test9", {minValue: 290, maxValue: 300})
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("INT05", validatedModel.errorCode);
    }
});