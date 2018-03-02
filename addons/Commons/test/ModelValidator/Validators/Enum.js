TestCase("[Commons - Model Validator] Enum validator", {
    setUp: function () {
        this.exampleModel = {
            test1: " ",
            test2: "",
            test3: "sdfsf",
            test4: "OK",
            test5: "teeSt",
            test6: "tEsT2",
            test7: 23123
        };

        this.modelValidator = new ModelValidator();
        this.validator = window.ModelValidators.Enum;
    },

    'test if value is empty then will return first value from available values': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {values: ["OK"], default: "OK"}),
            this.validator("test2", {values: ["A", "B", "C"], default: "A"})
        ]);

        assertEquals("OK", validatedModel.value['test1']);
        assertEquals("A", validatedModel.value['test2']);
    },

    'test if value is empty and default value is not provided, then validator will return error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {values: ["OK"]}),
            this.validator("test2", {values: ["A", "B", "C"]})
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("EV01", validatedModel.errorCode);
    },

    'test if value is empty and default value is passed then will return default value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {values: ["OK"], default: "TeSt1"}),
            this.validator("test2", {values: ["A", "B", "C"], default: "tEsT2"})
        ]);

        assertEquals("TeSt1", validatedModel.value['test1']);
        assertEquals("tEsT2", validatedModel.value['test2']);
    },

    'test if value is not in expected values then will return error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test3", {values: ["OK"], default: "TeSt1"})
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("EV01", validatedModel.errorCode);
    },

    'test if value have different size of letters than expected value will return error': function () {
            var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test4", {values: ["ok"], default: "TeSt1"})
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("EV01", validatedModel.errorCode);
    },

    'test if useLowerCase is set then provided value to validate will be changed to lower case': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test4", {values: ["ok"], default: "TeSt1", useLowerCase: true})
        ]);

        assertEquals("ok", validatedModel.value['test4']);
    },

    'test if provided value to validate is in expected array then will return correct value': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test5", {values: [" tEsT2  ", "a", "teeSt", "C", "TEEST"], default: "TeSt1", useLowerCase: false}),
            this.validator("test6", {values: [" tEsT2  ", "a", "teeSt", "C", "TEEST"], default: "TeSt1", useLowerCase: false})
        ]);

        assertEquals("teeSt", validatedModel.value['test5']);
        assertEquals("tEsT2", validatedModel.value['test6']);
    },

    'test if provided value is not a string then validator returns error': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test7", {values: ["OK"]}),
        ]);


        assertFalse(validatedModel.isValid);
        assertEquals("EV02", validatedModel.errorCode);
    }

});