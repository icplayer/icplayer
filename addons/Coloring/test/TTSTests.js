TestCase("[Coloring] TTS Tests", {
    setUp: function () {
        this.presenter = new AddonColoring_create();

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
            getColorAtPoint: sinon.stub(),
            floodFill: sinon.stub()
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.stubs.getColorAtPoint.returns([255,255,255,255]);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
        this.presenter.getColorAtPoint = this.stubs.getColorAtPoint;
        this.presenter.floodFill = this.stubs.floodFill;

        this.presenter.colorSpeechTextMap = { "255 255 255 255": "White" };
        this.presenter.configuration = {};
        this.presenter.configuration.areas = [
            { speechText: "Test", x: 200, y: 200 },
            { speechText: "Test2", x: 100, y: 100 },
        ];
        this.presenter.configuration.colors = [
            { colorRGBA: [255,255,255,255], speechText: "colorTest" },
            { colorRGBA: [155,155,155,155], speechText: "colorTest2" },
        ]

        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.presenter.configuration.areas[0];
        this.keyboardControllerObject.createColorListForKeyNav = () => {};
        this.keyboardControllerObject.readCurrentElement = () => {};

        this.presenter.setSpeechTexts();
        this.activateTTSWithoutReading();
    },

    'test given keyboard controller in area selection when selecting an area then key nav elements switch to colors': function () {
        assertEquals(this.presenter.configuration.areas, this.keyboardControllerObject.keyboardNavigationElements);

        this.keyboardControllerObject.select()

        assertEquals(this.presenter.configuration.colors, this.keyboardControllerObject.keyboardNavigationElements);
    },

    'test given keyboard controller in color selection when pressing escape key nav elements switch to areas': function () {
        this.keyboardControllerObject.switchElementsToColors()

        this.keyboardControllerObject.escape();

        assertEquals(this.presenter.configuration.areas, this.keyboardControllerObject.keyboardNavigationElements);
    },

    'test given keyboard controller selected an area when selecting a color then the selected area is colored': function () {
        this.keyboardControllerObject.setElements(this.presenter.configuration.areas);
        this.keyboardControllerObject.select();
        this.keyboardControllerObject.select();

        assertTrue(this.presenter.floodFill.calledOnce);
    },

    'test given keyboard controller when coloring an area then previous color is restored': function () {
        this.presenter.defaultColor = "255";

        this.keyboardControllerObject.switchElementsToColors();
        this.keyboardControllerObject.select();

        assertEquals("255", this.presenter.defaultColor);
    },

    'test given valid colors when getting area TTS then area color is read': function () {
        this.keyboardControllerObject.select();
        const color = this.keyboardControllerObject.getCurrentAreaColorSpeechText();

        assertEquals(this.presenter.colorSpeechTextMap["255 255 255 255"], color)
    },

    'test given colors with white RGBA when creating colorMap then white is skipped': function () {
        const colors = [
            { colorRGBA: [255, 255, 255, 255], speechText: "white" },
            { colorRGBA: [0, 0, 0, 0], speechText: "black" },
            { colorRGBA: [100, 100, 100, 100], speechText: "red" },
        ]

        this.presenter.createColorSpeechTextsMap(colors);

        const expected = undefined;
        const actual = this.presenter.colorSpeechTextMap["255 255 255 255"];
        assertEquals(expected, actual)
    },

    'test given valid colors when creating colorMap then colors are saved in map': function () {
        const colors = [
            { colorRGBA: [0, 0, 0, 0], speechText: "black" },
            { colorRGBA: [100, 100, 100, 100], speechText: "some color" },
        ]

        this.presenter.createColorSpeechTextsMap(colors);

        const expectedBlack = "black";
        const expectedRed = "some color";
        const actualBlack = this.presenter.colorSpeechTextMap["0 0 0 0"];
        const actualRed = this.presenter.colorSpeechTextMap["100 100 100 100"];
        assertEquals(expectedBlack, actualBlack);
        assertEquals(expectedRed, actualRed);
    },


    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

});