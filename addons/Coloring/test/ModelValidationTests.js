TestCase("[Coloring] Model validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.model = {
            'Areas' : '55; 150; 255 200 255 255',
            'Tolerance' : '50',
            'DefaultFillingColor' : ''
        };
    },

    'test validate areas wrong color format' : function() {
        this.model.Areas = '55; 150; 255 200 255';
        var validated = this.presenter.validateModel(this.model);
        assertEquals(true, validated.isError);
        assertEquals('E01', validated.errorCode);
    },

    'test validate areas proper color format' : function() {
        var validated = this.presenter.validateModel(this.model);
        assertEquals(false, validated.isError);
        assertEquals([255, 200, 255, 255], validated.areas[0].colorToFill);
    },

    'test validate areas too few arguments' : function() {
        this.model.Areas = '55; 150';
        var validated = this.presenter.validateModel(this.model);
        assertEquals(true, validated.isError);
        assertEquals('E03', validated.errorCode);
    },

    'test validate areas when last param (color to be filled) is blank will set it to default' : function() {
        this.model.Areas = '55; 150; 255 200 255 255';
        var validated = this.presenter.validateModel(this.model);
        assertEquals(false, validated.isError);
    },

    'test when DefaultFillingColor is empty, then its auto set to red' : function() {
        var expectedColor = [255, 100, 100, 255],
            validated = this.presenter.validateModel(this.model);

        assertEquals(expectedColor, validated.defaultFillingColor);
    }

});

TestCase("[Coloring] Transparent areas validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();

    },

    'test detecting proper transparent areas': function () {
        var model = {
            Areas: '55; 150; 255 200 255 255\n' +
            '200; 300; transparent\n' +
            '150; 300; transparent\n' +
            '500; 50; 50 30 40 60'
        };

        var expectedData = [
            {isError: false, x: 55, y: 150, colorToFill: [255, 200, 255, 255], type: this.presenter.AREA_TYPE.NORMAL},
            {isError: false, x: 200, y: 300, colorToFill: [-1, -1, -1, -1], type: this.presenter.AREA_TYPE.TRANSPARENT},
            {isError: false, x: 150, y: 300, colorToFill: [-1, -1, -1, -1], type: this.presenter.AREA_TYPE.TRANSPARENT},
            {isError: false, x: 500, y: 50, colorToFill: [50, 30, 40, 60], type: this.presenter.AREA_TYPE.NORMAL}
        ];

        var validatedAreas = this.presenter.validateAreas(model.Areas);

        assertFalse(validatedAreas.isError);
        assertTrue(validatedAreas.isValid);
        assertEquals(4, validatedAreas.items.length);
        assertEquals(expectedData, validatedAreas.items);
    }
});

TestCase("[Coloring] Parsing transparent area validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();
    },

    'test parsing valid input': function () {
        var splittedAreaArray = ["200", "300", "transparent"];
        var expectedArea = {
            isError: false,
            x: 200,
            y: 300,
            colorToFill: [-1, -1, -1, -1],
            type: this.presenter.AREA_TYPE.TRANSPARENT
        };

        var parsingResult = this.presenter.parseTransparentArea(splittedAreaArray);

        assertFalse(parsingResult.isError);
        assertEquals(expectedArea, parsingResult);

        splittedAreaArray = ["133", "522", "transparent"];
        expectedArea = {
            isError: false,
            x: 133,
            y: 522,
            colorToFill: [-1, -1, -1, -1],
            type: this.presenter.AREA_TYPE.TRANSPARENT
        };

        parsingResult = this.presenter.parseTransparentArea(splittedAreaArray);
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
    }

});