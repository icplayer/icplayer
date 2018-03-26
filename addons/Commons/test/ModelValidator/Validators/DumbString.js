TestCase("[Commons - Model Validator] DumbString validator", {
    setUp: function () {
        this.exampleModel = {
            test1: "sdfsdfs",
            test2: " 122ddf ",
            test3: " ",
            test4: ""
        };

        this.modelValidator = new ModelValidator();
        this.validator = window.ModelValidators.DumbString;
    },

    'test validator will copy provided value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1"),
            this.validator("test2"),
            this.validator("test3"),
            this.validator("test4")
        ]);

        assertEquals("sdfsdfs", validatedModel.value['test1']);
        assertEquals(" 122ddf ", validatedModel.value['test2']);
        assertEquals(" ", validatedModel.value['test3']);
        assertEquals("", validatedModel.value['test4']);
    }

});