TestCase("[Commons - Model Validator] Static List validator", {
    setUp: function () {
        var validatorDecorator = window.ModelValidator.prototype.__validatorDecorator__;

        this.exampleModel = {
            test2: "ok",
            test1: {
                first: {
                    test1: "abc",
                    test2: "avcd"
                },
                second: {
                    test1: "dsf",
                    test3: "sdfsvsdv"
                }
            }

        };

        this.modelValidator = new ModelValidator();
        this.validator = window.ModelValidators.StaticList;
        this.stringValidator = window.ModelValidators.DumbString;
    },

    'test correctly validate model': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator("test1", {
                first: [
                    this.stringValidator("test1"),
                    this.stringValidator("test2")
                ],
                second: [
                    this.stringValidator("test1"),
                    this.stringValidator("test3")
                ]
            })
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals({
            first: {
                test1: "abc",
                test2: "avcd"
            },
            second: {
                test1: "dsf",
                test3: "sdfsvsdv"
            }
        }, validatedModel.value['test1']);
    },

    'test in list shouldValidate function contains correct global scope': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.stringValidator("test2"),
            this.validator("test1", {
                first: [
                    this.stringValidator("test1", function () {
                        return this.validatedModel['test2'] === 'ok';
                    }),
                    this.stringValidator("test2")
                ],
                second: [
                    this.stringValidator("test1", function () {
                        return this.validatedModel['test2'] === 'ok';
                    }),
                    this.stringValidator("test3")
                ]
            })
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals({
            first: {
                test1: "abc",
                test2: "avcd"
            },
            second: {
                test1: "dsf",
                test3: "sdfsvsdv"
            }
        }, validatedModel.value['test1']);
    },

    'test in list shouldValidate function contains correct local scope': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.stringValidator("test2"),
            this.validator("test1", {
                first: [
                    this.stringValidator("test1"),
                    this.stringValidator("test2", function (localScope) {
                        return localScope['test1'] === 'abc'
                    })
                ],
                second: [
                    this.stringValidator("test1"),
                    this.stringValidator("test3", function (localScope) {
                        return localScope['test1'] === 'abc'
                    })
                ]
            })
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals({
            first: {
                test1: "abc",
                test2: "avcd"
            },
            second: {
                test1: "dsf",
                test3: undefined
            }
        }, validatedModel.value['test1']);
    }
});