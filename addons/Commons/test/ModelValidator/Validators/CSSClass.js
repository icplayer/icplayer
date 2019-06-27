TestCase("[Commons - Model Validator] CSS validator", {
    setUp: function () {
        this.exampleModel = {
            test1: "    ",
            test2: "",
            test3: "adasda",
            test4: "  sdfw3 ",
            test5: "34dfgdgf",
            test6: "fsf223 gr",
            test7: "dg$#RT#$",
            test8: "-ddgdgdg__dgdg-gdfgdf4t3g-g",
            test9: 21312312
        };

        this.modelValidator = new ModelValidator();
        this.validator = window.ModelValidators.CSSClass;
    },

    'test if value is empty and default value is set then will return default value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {default: "OK"}),
            this.validator("test2", {default: "Ok2"})
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals("OK", validatedModel.value['test1']);
        assertEquals("Ok2", validatedModel.value['test2']);
    },

    'test if value is empty and dont contains default value then validator will return error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("CSS01", validatedModel.errorCode);
    },

    'test if value contains only white spaces then will be treated as empty value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test2")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("CSS01", validatedModel.errorCode);
    },

    'test if value is correct then will return validated value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test3"),
            this.validator("test4"),
            this.validator("test8")
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals("adasda", validatedModel.value['test3']);
        assertEquals("sdfw3", validatedModel.value['test4']);
        assertEquals("-ddgdgdg__dgdg-gdfgdf4t3g-g", validatedModel.value['test8']);
    },

    'test if css class starts with number then validator will return error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test5")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("CSS01", validatedModel.errorCode);
    },

    'test if css class contains space then will return error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test6")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("CSS01", validatedModel.errorCode);
    },

    'test if css class contains special characters then will return error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test7")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("CSS01", validatedModel.errorCode);
    },

    'test if provided value is not a string then validator returns error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test9")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("CSS02", validatedModel.errorCode);
    }

});