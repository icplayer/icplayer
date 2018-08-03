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
TEXT_FOR_PARSING += "and two colored words with red: \\color{red}{Text&nbsp;Text} \n";
TEXT_FOR_PARSING += "and some final text with: \\color{red}{Text}.";

var EXISTING_TEXT_FOR_PARSING = "\\color{red}{fresas&nbsp;y&nbsp;nata.} \n";
EXISTING_TEXT_FOR_PARSING += "\\color{yellow}{era&nbsp;el&nbsp;de&nbsp;\<em>El&nbsp;mago&nbsp;de&nbsp;Oz</em>.} \n";
EXISTING_TEXT_FOR_PARSING += "\\color{blue}{fotos&nbsp;al&nbsp;paisaje.}";

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

        this.presenter = AddonText_Coloring_create();

        this.expectedResult = [];
        this.expectedResult.push(setUpUtils.getWordToken("This"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("is"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("example"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("text"));
        this.expectedResult.push(setUpUtils.getNewLineToken());
        this.expectedResult.push(setUpUtils.getWordToken("with"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("one"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("colored"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("word"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("with"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("red:"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getSelectableToken("Text", "red"));
        this.expectedResult.push(setUpUtils.getNewLineToken());
        this.expectedResult.push(setUpUtils.getWordToken("and"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("one"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("colored"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("word"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("with"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("blue:"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getSelectableToken("Text", "blue"));
        this.expectedResult.push(setUpUtils.getNewLineToken());
        this.expectedResult.push(setUpUtils.getWordToken("and"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("two"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("colored"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("words"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("with"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("red:"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getSelectableToken("Text&nbsp;Text", "red"));
        this.expectedResult.push(setUpUtils.getNewLineToken());
        this.expectedResult.push(setUpUtils.getWordToken("and"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("some"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("final"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("text"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getWordToken("with:"));
        this.expectedResult.push(setUpUtils.getSpaceToken());
        this.expectedResult.push(setUpUtils.getSelectableToken("Text", "red"));
        this.expectedResult.push(setUpUtils.getWordToken("."));
    },

    "test should parse text to word tokens, new lines tokens and color tokens": function () {
        var parsingResult = this.presenter.parseText(TEXT_FOR_PARSING, "ALL_SELECTABLE");

        assertEquals(this.expectedResult, parsingResult);
    },

    "test should parse empty text to empty array - no tokens": function () {
        assertEquals([], this.presenter.parseText("","ALL_SELECTABLE"));
        assertEquals([], this.presenter.parseText("         ","ALL_SELECTABLE"));
        assertEquals([], this.presenter.parseText("     \n    ","ALL_SELECTABLE"));
    }
});

TestCase("[Text_Coloring] parse space special character", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();

        this.expectedResult = [];

        this.expectedResult.push(setUpUtils.getSelectableToken("fresas&nbsp;y&nbsp;nata.", "red"));
        this.expectedResult.push(setUpUtils.getNewLineToken());
        this.expectedResult.push(setUpUtils.getSelectableToken("era&nbsp;el&nbsp;de&nbsp;<em>El&nbsp;mago&nbsp;de&nbsp;Oz</em>.", "yellow"));
        this.expectedResult.push(setUpUtils.getNewLineToken());
        this.expectedResult.push(setUpUtils.getSelectableToken("fotos&nbsp;al&nbsp;paisaje.", "blue"));
    },

    "test should parse text with space special character to word tokens, new lines tokens and color tokens": function () {
        var parsingResult = this.presenter.parseText(EXISTING_TEXT_FOR_PARSING, "ALL_SELECTABLE");

        assertEquals(this.expectedResult, parsingResult);
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
        this.stubs.parseText.returns([123, 123, 123, 1231, 321, 321]);

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
        var colorsValue = [{asdf: 5}, "asdflkhdjfafa", 10];
        var parsedText = [1, 2, 3, 4, 5, 6];
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
            eraserButtonText: eraserButtonText,
            mode: "MARK_PHRASES"

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
            eraserButtonText: eraserButtonText,
            Mode: "Mark phrases to select"
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