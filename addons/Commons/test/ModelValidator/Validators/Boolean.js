TestCase("[Commons - Model Validator] Boolean validator", {
    setUp: function () {
        this.exampleModel = {
            test1: "True",
            test2: "False",
            test3: "adasda",
            test4: "",
            test5: 1,
            test6: "0",
            test7: "1",
        };

        this.modelValidator = new ModelValidator();
        this.BooleanValidator = window.ModelValidators.Boolean;
    },

    'test boolean with value True returns true': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.BooleanValidator("test1")
        ]);

        assertTrue(validatedModel.value['test1']);
    },

    'test boolean with value False returns false': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.BooleanValidator("test2")
        ]);

        assertFalse(validatedModel.value['test2']);
    },

    'test boolean with value different than True and False returns false': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.BooleanValidator("test3")
        ]);

        assertFalse(validatedModel.value['test3']);
    },

    'test if value is empty then validator will returns false': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.BooleanValidator("test4")
        ]);

        assertFalse(validatedModel.value['test4']);
    },

    'test if value is not a string then validator will return error code': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.BooleanValidator("test5")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("BL01", validatedModel.errorCode);
    },

    'test if value is 0 as string then validator will return false': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.BooleanValidator("test6")
        ]);

        assertFalse(validatedModel.value['test6']);
    },

    'test if value is 1 as string then validator will return false': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.BooleanValidator("test7")
        ]);

        assertFalse(validatedModel.value['test7']);
    },
});