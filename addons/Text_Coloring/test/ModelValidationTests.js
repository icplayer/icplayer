var DEFAULTS = {
    ERROR_CODES: {
        "TC_COLORS_COLOR_DEFINITION_HAVE_TO_BE_RGB_HEX": "Color definitions in colors property have to be proper rgb hex e.g #FF0000",
        "TC_COLORS_COLOR_MUST_HAVE_ID": "Color definitions in colors property must have id",
    },

    ERROR_CODES_KEYS: {
        "TC_COLORS_COLOR_DEFINITION_HAVE_TO_BE_RGB_HEX": "TC_COLORS_COLOR_DEFINITION_HAVE_TO_BE_RGB_HEX",
        "TC_COLORS_COLOR_MUST_HAVE_ID": "TC_COLORS_COLOR_MUST_HAVE_ID",
    }
};

var TEXT_FOR_PARSING = "This is example text \n";
TEXT_FOR_PARSING += "with one colored word with red: \\color{red}{Text} \n";
TEXT_FOR_PARSING += "and one colored word with blue: \\color{blue}{Text} \n";
TEXT_FOR_PARSING += "and some final text with: \\color{red}{Text}.";


TestCase("[Text_Coloring] Validate Colors", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
        this.validColorProperty = [
            {
                "id": "nouns",
                "color": "#FF0000",
                "description": "Nouns"

            },
            {
                "id": "verbs",
                "color": "#00FF00",
                "description": "verbs"

            },
            {
                "id": "adjectives",
                "color": "#0000FF",
                "description": "adjectives"
            }
        ];

        this.expectedResult = [
            {
                "id": "nouns",
                "color": "#FF0000",
                "description": "Nouns"

            },
            {
                "id": "verbs",
                "color": "#00FF00",
                "description": "verbs"

            },
            {
                "id": "adjectives",
                "color": "#0000FF",
                "description": "adjectives"
            }
        ];

        this.invalidRGBHExDefinition = [{
            "id": "nouns",
            "color": "Fz!00",
            "description": "Nouns"
        }];

        this.invalidEmptyID = [{
            "id": "      ",
            "color": "#00FF00",
            "description": "Nouns"
        }];

        this.invalidRGBHexErrorCode = DEFAULTS.ERROR_CODES_KEYS.TC_COLORS_COLOR_DEFINITION_HAVE_TO_BE_RGB_HEX;
        this.invalidEmptyIDErrorCode = DEFAULTS.ERROR_CODES_KEYS.TC_COLORS_COLOR_MUST_HAVE_ID;
    },

    'test should parse valid model to array of objects with id, color, description': function () {
        var result = this.presenter.validateColors(this.validColorProperty);
        assertTrue(result.isValid);
        assertEquals(this.expectedResult, result.value);
    },

    'test should return invalid object with error code for wrong rgb hex color definition': function () {
        var result = this.presenter.validateColors(this.invalidRGBHExDefinition);

        assertFalse(result.isValid);
        assertEquals(this.invalidRGBHexErrorCode, result.errorCode);
    },

    'test should return invalid object with error code for color empty id': function () {
        var result = this.presenter.validateColors(this.invalidEmptyID);

        assertFalse(result.isValid);
        assertEquals(this.invalidEmptyIDErrorCode, result.errorCode);
    },
});

TestCase("[Text_Coloring] Validate Text", {
    setUp: function () {
        function getWordToken(value) {
            return {
                "value": value,
                "type": "word"
            };
        }

        function getNewLineToken() {
            return {
                "type": "new_line"
            };
        }

        function getSelectableToken(value, colorID) {
            return {
                "type": "selectable",
                "value": value,
                "color": colorID
            };
        }

        function getSpaceToken() {
            return {
                type: "space"
            };
        }

        this.presenter = AddonText_Coloring_create();

        this.expectedResult = [];
        this.expectedResult.push(getWordToken("This"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("is"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("example"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("text"));
        this.expectedResult.push(getNewLineToken());
        this.expectedResult.push(getWordToken("with"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("one"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("colored"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("word"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("with"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("red:"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken(""));
        this.expectedResult.push(getSelectableToken("Text", "red"));
        this.expectedResult.push(getNewLineToken());
        this.expectedResult.push(getWordToken("and"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("one"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("colored"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("word"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("with"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("blue:"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken(""));
        this.expectedResult.push(getSelectableToken("Text", "blue"));
        this.expectedResult.push(getNewLineToken());
        this.expectedResult.push(getWordToken("and"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("some"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("final"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("text"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken("with:"));
        this.expectedResult.push(getSpaceToken());
        this.expectedResult.push(getWordToken(""));
        this.expectedResult.push(getSelectableToken("Text", "red"));
        this.expectedResult.push(getWordToken("."));
    },

    "test should parse text to word tokens, new lines tokens and color tokens": function () {
        var parsingResult = this.presenter.parseText(TEXT_FOR_PARSING);

        assertEquals(this.expectedResult, parsingResult);
    },

    "test should parse empty text to empty array - no tokens": function () {
        assertEquals([], this.presenter.parseText(""));
        assertEquals([], this.presenter.parseText("         "));
        assertEquals([], this.presenter.parseText("     \n    "));
    }
});

TestCase("[Text_Coloring] Model Validation flow", {
    setUp: function () {
        this.presenter = new AddonText_Coloring_create();
        this.stubs = {
            parseText: sinon.stub(this.presenter, 'parseText'),
            validateColors: sinon.stub(this.presenter, 'validateColors')
        };
    },

    tearDown: function () {
        this.presenter.parseText.restore();
        this.presenter.validateColors.restore();
    },

    'test should parseColors and text if they are valid': function () {
        this.stubs.parseText.returns([123, 123, 123, 1231, 321,321]);

        this.stubs.validateColors.returns({
            isValid: true
        });

        this.presenter.validateModel({});

        assertTrue(this.stubs.validateColors.calledOnce);
        assertTrue(this.stubs.parseText.calledOnce);
    },

    'test should not parse text if parsing colors was invalid': function () {
        this.stubs.validateColors.returns({
            isValid: false,
            isError: true
        });

        this.presenter.validateModel({});

        assertTrue(this.stubs.validateColors.calledOnce);
        assertFalse(this.stubs.parseText.called);
    },

    'test should return model with validated values': function () {
        var colorsValue = [{asdf:5}, "asdflkhdjfafa", 10];
        var parsedText = [1, 2,3,4,5,6];
        var buttonsPosition = "left";
        var showSetEraserButtonMode = "False";
        var hideColorsButtons = "False";
        var modelID = "Text_Coloring_1";
        var eraserButtonText = "Argh";

        var expectedModel = {
            isVisible: true,
            isValid: true,
            isError: false,
            ID: modelID,
            colors: colorsValue,
            textTokens: parsedText,
            buttonsPosition: buttonsPosition,
            showSetEraserButtonMode: false,
            hideColorsButtons: false,
            eraserButtonText: eraserButtonText

        };

        this.stubs.validateColors.returns({
            isValid: true,
            isError: false,
            value: colorsValue
        });

        this.stubs.parseText.returns(parsedText);

        var result = this.presenter.validateModel({
            'Is Visible': "True",
            ID: modelID,
            buttonsPosition: buttonsPosition,
            hideColorsButtons: hideColorsButtons,
            showSetEraserModeButton: showSetEraserButtonMode,
            eraserButtonText: eraserButtonText
        });


        assertEquals(expectedModel, result);
        assertTrue(this.stubs.validateColors.calledOnce);
        assertTrue(this.stubs.parseText.calledOnce);
    }
});

TestCase("[Text_Coloring] parse Buttons position", {
    setUp: function () {
        this.presenter = new AddonText_Coloring_create();
    },
    
    'test should return default value when value is empty or undefined': function () {
        assertEquals("top", this.presenter.parseButtonsPosition(""));
        assertEquals("top", this.presenter.parseButtonsPosition(undefined));
    },
    
    'test should return position value as is': function () {
        assertEquals("top", this.presenter.parseButtonsPosition("top"));
        assertEquals("left", this.presenter.parseButtonsPosition("left"));
        assertEquals("bottom", this.presenter.parseButtonsPosition("bottom"));
        assertEquals("right", this.presenter.parseButtonsPosition("right"));
    }
});