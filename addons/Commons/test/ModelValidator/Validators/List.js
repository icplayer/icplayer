TestCase("[Commons - Model Validator] List validator", {
    setUp: function () {
        var validatorDecorator = window.ModelValidator.prototype.__validatorDecorator__;

        this.exampleModel = {
            test2: "ok",
            test1: [
                {
                    test1: "abc",
                    test2: "avcd"
                },
                {
                    test1: "dsf",
                    test2: "sdfsvsdv"
                }
            ]

        };

        this.modelValidator = new ModelValidator();
        this.validator = window.ModelValidators.List;
        this.stringValidator = window.ModelValidators.DumbString;
    },

    'test correctly validate model': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", [
                this.stringValidator("test1"),
                this.stringValidator("test2")
            ])
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals([
            {
                test1: "abc",
                test2: "avcd"
            },
            {
                test1: "dsf",
                test2: "sdfsvsdv"
            }
        ], validatedModel.value['test1']);
    },

    'test in list shouldValidate function contains correct global scope': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.stringValidator("test2"),
            this.validator("test1", [
                this.stringValidator("test1", function () {
                    return this.validatedModel['test2'] === 'ok';
                }),
                this.stringValidator("test2")
            ])
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals([
            {
                test1: "abc",
                test2: "avcd"
            },
            {
                test1: "dsf",
                test2: "sdfsvsdv"
            }
        ], validatedModel.value['test1']);
    },

    'test in list shouldValidate function contains correct local scope': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.stringValidator("test2"),
            this.validator("test1", [
                this.stringValidator("test1"),
                this.stringValidator("test2", function (localScope) {
                    return localScope['test1'] === 'abc'
                })
            ])
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals([
            {
                test1: "abc",
                test2: "avcd"
            }, {
                test1: "dsf",
                test2: undefined
            }
        ], validatedModel.value['test1']);
    },

    'test if provided value is not an array then will return error code': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test2", [
                this.stringValidator("test1"),
                this.stringValidator("test2"),
            ])
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals("ARR01", validatedModel.errorCode);
    }

});