TestCase("[Coloring] Model validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.presenter.speechTexts = this.presenter.DEFAULT_TTS_PHRASES;
        this.model = {
            'Areas' : '55; 150; 255 200 255 255; Area',
            'colors' : [{ 'colorRGBA': '255 200 255 255', 'speechText': "Test" }],
            'Width' : '500',
            'Height' : '500',
            'Tolerance' : '50',
            'DefaultFillingColor' : '',
            'Image' : '/file/serve/4834816278659072'
        };
        this.isPreview = false;
    },

    'test validate areas wrong color format' : function() {
        this.model.Areas = '55; 150; 255 200 255';
        var validated = this.presenter.validateModel(this.model, this.isPreview);
        assertEquals(true, validated.isError);
        assertEquals('E06', validated.errorCode);
    },

    'test given invalid TTS separation in areas when validating then proper error is displayed' : function() {
        this.model.Areas = '55; 150; 255 200 255, Head';
        var validated = this.presenter.validateModel(this.model, this.isPreview);
        assertEquals(true, validated.isError);
        assertEquals('E06', validated.errorCode);
    },

    'test validate areas proper color format' : function() {
        var validated = this.presenter.validateModel(this.model, this.isPreview);
        assertEquals(false, validated.isError);
        assertEquals([255, 200, 255, 255], validated.areas[0].colorToFill);
    },

    'test given proper areas with text to speech when validating then no error is present' : function() {
        const validated = this.presenter.validateModel(this.model, this.isPreview);
        assertEquals(false, validated.isError);
    },

    'test validate areas too few arguments' : function() {
        this.model.Areas = '55; 150';
        var validated = this.presenter.validateModel(this.model, this.isPreview);
        assertEquals(true, validated.isError);
        assertEquals('E03', validated.errorCode);
    },

    'test validate areas when last param (color to be filled) is blank will set it to default' : function() {
        this.model.Areas = '55; 150; 255 200 255 255';
        var validated = this.presenter.validateModel(this.model, this.isPreview);
        assertEquals(false, validated.isError);
    },

    'test when DefaultFillingColor is empty, then its auto set to red' : function() {
        var expectedColor = [255, 100, 100, 255],
            validated = this.presenter.validateModel(this.model, this.isPreview);

        assertEquals(expectedColor, validated.defaultFillingColor);
    },

    'test validate areas when x is not smaller than Width' : function(){
        this.model.Areas = '550; 50; 255 200 255 255';
        this.model.Width = '500';
        this.model.Height = '500';
        this.isPreview = true;
        var validated = this.presenter.validateModel(this.model, this.isPreview);
        assertEquals(true, validated.isError);
        assertEquals('E04',validated.errorCode);
    },

    'test validate areas when y is not smaller than Height': function(){
        this.model.Areas = '50; 550; 255 200 255 255';
        this.model.Width = '500';
        this.model.Height = '500';
        this.isPreview = true;
        var validated = this.presenter.validateModel(this.model, this.isPreview);
        assertEquals(true, validated.isError);
        assertEquals('E04',validated.errorCode);
    },

    'test validate areas when x and y is too large and not in preview': function(){
        this.model.Areas = '550; 550; 255 200 255 255';
        this.model.Width = '500';
        this.model.Height = '500';
        this.isPreview = false;
        var validated = this.presenter.validateModel(this.model, this.isPreview);
        assertEquals(false, validated.isError);
    }
});

TestCase("[Coloring] Transparent areas validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.presenter.speechTexts = this.presenter.DEFAULT_TTS_PHRASES;
    },

    'test detecting proper transparent areas': function () {
        var model = {
            Areas: '55; 150; 255 200 255 255\n' +
            '200; 300; transparent\n' +
            '150; 300; transparent\n' +
            '500; 50; 50 30 40 60',
            Width: '600',
            Height: '600'
        };
        var isPreview = false;
        var expectedData = [
            {x:55, y:150,type: 0, colorToFill: [255,200,255,255], isError: false, isValid: true},
            {x:200, y:300, type: 1, colorToFill: [-1,-1,-1,-1], isError: false, isValid: true},
            {x:150, y:300, type: 1, colorToFill: [-1,-1,-1,-1], isError: false, isValid: true},
            {x:500, y:50,type: 0, colorToFill: [50,30,40,60], isError: false, isValid: true}
        ];

        var validatedAreas = this.presenter.validateAreas(model.Areas, isPreview, model.Width, model.Height);

        assertFalse(validatedAreas.isError);
        assertTrue(validatedAreas.isValid);
        assertEquals(4, validatedAreas.value.length);
        expectedData.forEach((element, i) => {
            assertEquals(element.type, validatedAreas.value[i].type);
        })
    }
});

TestCase("[Coloring] Parsing transparent area validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.presenter.speechTexts = this.presenter.DEFAULT_TTS_PHRASES;
    },

    'test given valid area with optional TTS when validating then all is OK': function () {
        const splittedAreaArray = ["200", "300", "transparent", "Hello"];
        const expectedArea = {
            isError: false,
            x: 200,
            y: 300,
            colorToFill: [-1, -1, -1, -1],
            type: this.presenter.AREA_TYPE.TRANSPARENT,
            speechText: "Hello",
        };

        const parsingResult = this.presenter.parseTransparentArea(splittedAreaArray);

        assertFalse(parsingResult.isError);
        assertEquals(expectedArea, parsingResult);
    },

    'test given valid area without optional TTS when validating then all is OK': function () {
        const splittedAreaArray = ["133", "522", "transparent"];
        const expectedArea = {
            isError: false,
            x: 133,
            y: 522,
            colorToFill: [-1, -1, -1, -1],
            type: this.presenter.AREA_TYPE.TRANSPARENT,
            speechText: this.presenter.speechTexts.Area,
        };

        const parsingResult = this.presenter.parseTransparentArea(splittedAreaArray);
        assertFalse(parsingResult.isError);
        assertEquals(expectedArea, parsingResult);
    },

    'test parsing invalid input, not numbers co-ordinates': function () {
        var splittedAreaArray = ["wqeqwdsadsa200", "300", "transparent"];

        var parsingResult = this.presenter.parseTransparentArea(splittedAreaArray);

        assertFalse(parsingResult.isValid);
        assertTrue(parsingResult.isError);
        assertEquals('A01', parsingResult.errorCode);

        splittedAreaArray = ["133", "zxvcxzvxz522", "transparent"];
        parsingResult = this.presenter.parseTransparentArea(splittedAreaArray);

        assertTrue(parsingResult.isError);
        assertFalse(parsingResult.isValid);
        assertEquals('A01', parsingResult.errorCode);
    },

    'test parsing invalid input, negative co-ordinates': function () {
        var splittedAreaArray = ["-23", "77", "transparent"];

        var parsingResult = this.presenter.parseTransparentArea(splittedAreaArray);

        assertFalse(parsingResult.isValid);
        assertTrue(parsingResult.isError);
        assertEquals('A01', parsingResult.errorCode);

        splittedAreaArray = ["23", "-77", "transparent"];
        parsingResult = this.presenter.parseTransparentArea(splittedAreaArray);

        assertTrue(parsingResult.isError);
        assertFalse(parsingResult.isValid);
        assertEquals('A01', parsingResult.errorCode);
    },

    'test given invalid color RGBA in colors prop when validating then return error code': function () {
        const model = { colors: [{ colorRGBA: "255 255 255", speechText: "ABC" }] }

        const validatedColors = this.presenter.validateColors(model['colors']);

        assertEquals("E01", validatedColors[0].errorCode);
    },

    'test given valid color prop when validating then all colors are saved': function () {
        const model = { colors: [{ colorRGBA: "255 255 255 255", speechText: "ABC" }, { colorRGBA: "166 166 166 255", speechText: "DEF" }] }

        const expected =  [
            { colorRGBA:[255,255,255,255], speechText: "ABC" },
            { colorRGBA: [166,166,166,255], speechText: "DEF" }
        ];
        const validatedColors = this.presenter.validateColors(model.colors);

        assertEquals(expected, validatedColors);
    },

});