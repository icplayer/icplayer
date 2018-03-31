TestCase("[Commons - Model Validator] DumbInteger validator", {
    setUp: function () {
        this.exampleModel = {
            test1: "12",
            test2: "122ddf",
            test3: "dfs213",
            test4: 34234,
            test5: "234.34",
            test6: ""
        };

        this.modelValidator = new ModelValidator();
        this.validator = window.ModelValidators.DumbInteger;
    },

    'test value with integer as string returns correct number value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1")
        ]);

        assertEquals(12, validatedModel.value['test1']);
    },

    'test value with integers at start and characters at end will returns only number': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test2")
        ]);

        assertEquals(122, validatedModel.value['test2']);
    },

    'test value with characters at start returns NaN': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test3")
        ]);

        assertTrue(isNaN(validatedModel.value['test3']));
    },

    'test if value is number then will return the same number': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test4")
        ]);

        assertEquals(34234, validatedModel.value['test4']);
    },

    'test if value is double precision string then returns only number as integer': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test5")
        ]);

        assertEquals(234, validatedModel.value['test5']);
    },

    'test of value is empty then returns NaN': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test6")
        ]);

        assertTrue(isNaN(validatedModel.value['test6']));
    }
});