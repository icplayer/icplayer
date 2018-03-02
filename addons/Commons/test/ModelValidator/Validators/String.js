TestCase("[Commons - Model Validator] String validator", {
    setUp: function () {
        this.exampleModel = {
            test1: "12",
            test2: " 122ddf ",
            test3: " ",
            test4: "",
            test5: 34234
        };

        this.modelValidator = new ModelValidator();
        this.validator = window.ModelValidators.String;
    },

    'test validator will return nonempty string if nonempty string is provided': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1")
        ]);

        assertEquals("12", validatedModel.value['test1']);
    },

    'test validator will return trunc string at default': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test2")
        ]);

        assertEquals("122ddf", validatedModel.value['test2']);
    },

    'test if string is empty then validator returns error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test3")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("STR01", validatedModel.errorCode);
    },

    'test validator with trim as false will return string with white spaces': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test3", {trim: false})
        ]);

        assertEquals(" ", validatedModel.value['test3']);
    },

    'test validator with trim as true will return string without spaces': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test2")
        ]);

        assertEquals("122ddf", validatedModel.value['test2']);
    },

    'test if default value is empty string and string is empty then will return empty string': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test3", {default: ""})
        ]);

        assertEquals("", validatedModel.value['test3']);
    },

    'test if default is empty string and trim false then will return string with white spaces': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test3", {default: "", trim: false})
        ]);

        assertEquals(" ", validatedModel.value['test3']);
    },

    'test if default is not provided then will return error if string is empty': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test3")
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("STR01", validatedModel.errorCode);
    },

    'test if default value is null then will return null if provided value is empty': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test3", {trim: true, default: null})
        ]);

        assertEquals(null, validatedModel.value['test3']);
    },

    'test if default is string then this string will be returned if provided value is empty': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test3", {trim: true, default: "OK"})
        ]);

        assertEquals("OK", validatedModel.value['test3']);
    },

    'test if trim is true and string is empty then validator will return error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test4", {trim: false})
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("STR01", validatedModel.errorCode);
    },

    'test if provided value is not a string then will return error code': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test5", {trim: true, default: "OK"})
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("STR02", validatedModel.errorCode);
    }
});