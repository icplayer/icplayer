TestCase("[Commons - Model Validator] Boolean validator", {
    setUp: function () {
        this.exampleModel = {
            test1: "True",
            test2: "False",
            test3: "adasda"
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
    }
});