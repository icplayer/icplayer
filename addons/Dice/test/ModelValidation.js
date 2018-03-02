TestCase("[Dice] Build Model Validation", {

    setUp: function () {
        this.presenter = AddonDice_create();

        this.exampleModel = {
            "ID": "testID",
            "isDisabled": "True",
            "animationLength": "10",
            "initialItem": "1",
            "elementsList": [
                {
                    "name": "some",
                    "image": "sImage"
                },
                {
                    "name": "second",
                    "image": "ssImage"
                }
            ],
            "Is Visible": "False",
            "worksWith": ""
        }
    },


    'test validateModel will return valid model': function () {
        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertTrue(validatedModel.isValid);
        assertEquals({
            "ID": "testID",
            "isDisabled": true,
            "animationLength": 10,
            "initialItem": 0,
            "elementsList": [
                {
                    "name": "some",
                    "image": "sImage"
                },
                {
                    "name": "second",
                    "image": "ssImage"
                }
            ],
            "Is Visible": false,
            "worksWith": null
        }, validatedModel.value);
    },

    'test if initial item is bigger than available items then validation will return error': function () {
        this.exampleModel.initialItem = "10";

        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    },

    'test if initial item is below 0 then validation will return error': function () {
        this.exampleModel.initialItem = "-2";

        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    },

    'test if animation length if below 0 then validation will return error': function () {
        this.exampleModel.animationLength = "-2";

        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    },

    'test if initial item is not a name then validator will return error': function () {
        this.exampleModel.initialItem = "10aa";

        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    },

    'test if animation length is not a name then validator will return error': function () {
        this.exampleModel.animationLength = "10aa";

        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    }
});