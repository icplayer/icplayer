TestCase("[Board Game] model validation Test Case", {

    setUp: function () {
        this.presenter = AddonBoard_Game_create();

        this.exampleModel = {
            hasFields: "True",
            gameMode: "Game",
            Fields: [
                {
                    Top: "213d",
                    Left: "12ed",
                    Width: "12q32",
                    Height: "123",
                    cssClass: "asdfb"
                },
                {
                    Top: "34fd",
                    Left: "63",
                    Width: "213",
                    Height: "12ds",
                    cssClass: ""
                }
            ],
            Images: [
                {
                    Top: "21sd1",
                    Left: "231d3",
                    Width: "21d12",
                    Height: "213",
                    PawnImage: "sdfsdfs"
                }
            ],
            isDisabled: "True",
            Width: "12312ddc",
            Height: "22341d1",
            ID: "dwefwsef",
            "Is Visible": "True",
            Background: "dfdswfsdf"
        }
    },

    'test model is correctly validated': function () {
        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertTrue(validatedModel.isValid);

        assertEquals({
            isValid: true,
            value: {
                hasFields: true,
                gameMode: "Game",
                Fields: [
                    {
                        Top: 213,
                        Left: 12,
                        Width: 12,
                        Height: 123,
                        cssClass: "asdfb"
                    },
                    {
                        Top: 34,
                        Left: 63,
                        Width: 213,
                        Height: 12,
                        cssClass: ""
                    }
                ],
                Images: [
                    {
                        Top: 21,
                        Left: 231,
                        Width: 21,
                        Height: 213,
                        PawnImage: "sdfsdfs"
                    }
                ],
                isDisabled: true,
                Width: 12312,
                Height: 22341,
                ID: "dwefwsef",
                "Is Visible": true,
                Background: "dfdswfsdf"
            },
            errorCode: ""
        }, validatedModel)
    },

    'test if field Width is too large then will return validation error': function () {
        this.exampleModel.Fields[0].Width = "10000000000";
        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    },

    'test if field height is too large then will return validation error': function () {
        this.exampleModel.Fields[0].Height = "10000000000";
        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    },

    'test if field left value with field width is bigger than addon size then will returns error': function () {
        this.exampleModel.Fields[0].Left = "1000000000000";

        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    },

    'test if field top value with field height is bigger than addon size then will returns error': function () {
        this.exampleModel.Fields[0].Height = "1000000000000";

        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    },

    'test if image width is too large then will return validation error': function () {
        this.exampleModel.Images[0].Width = "1000000";

        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    },

    'test if css class is not valid class name then will returns error': function () {
        this.exampleModel.Fields[0].cssClass = "asd  sadad";

        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    },

    'test if game mode is free and addon dont contains fields then fields wont be validated': function () {
        this.exampleModel.gameMode = "Free";
        this.exampleModel.hasFields = "False";

        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertTrue(validatedModel.isValid);
        assertUndefined(validatedModel.value.Fields);
        assertEquals("Free", validatedModel.value.gameMode);
    },

    'test if mode is not valid then will return error': function () {
        this.exampleModel.gameMode = "dfsdf";

        var validatedModel = this.presenter.validateModel(this.exampleModel);

        assertFalse(validatedModel.isValid);
    }

});