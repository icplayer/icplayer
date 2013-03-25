TestCase("Configuration", {
    setUp: function () {
        this.presenter = AddonStandard_Shapes_create();
    },

    'test empty config': function () {
        var model = { };

        var readResult = this.presenter.readConfiguration(model);

        assertFalse(readResult.isError);
        assertEquals(this.presenter.SHAPES.LINE, readResult.shape);
        assertEquals(0, readResult.rotation);
        assertEquals(1, readResult.strokeWidth);
        assertEquals("#000", readResult.strokeColor);
        assertEquals("#FFF", readResult.fillColor);
        assertFalse(readResult.cornersRoundings);
        assertEquals(1, readResult.strokeOpacity);
        assertEquals(this.presenter.LINE_ENDING.NONE, readResult.lineEnding);
    },

    'test rational NaN': function () {
        var model = {
            "Rotation angle": "aaa"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.ROTATION.NAN, readResult.errorMessage);
    },

    'test rotation out of bounds (negative value)': function () {
        var model = {
            "Rotation angle": "-1"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.ROTATION.OUT_OF_BOUNDS, readResult.errorMessage);
    },

    'test rotation out of bounds (positive value)': function () {
        var model = {
            "Rotation angle": "480"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.ROTATION.OUT_OF_BOUNDS, readResult.errorMessage);
    },

    'test stroke width NaN': function () {
        var model = {
            "Stroke width": "aaa"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.STROKE_WIDTH.NAN, readResult.errorMessage);
    },

    'test stroke width out of bounds (zero value)': function () {
        var model = {
            "Stroke width": "0"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.STROKE_WIDTH.OUT_OF_BOUNDS, readResult.errorMessage);
    },

    'test stroke width out of bounds (negative value)': function () {
        var model = {
            "Stroke width": "-0.1"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.STROKE_WIDTH.OUT_OF_BOUNDS, readResult.errorMessage);
    },

    'test stroke color NaN': function () {
        var model = {
            "Stroke color": "aaa"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.STROKE_COLOR, readResult.errorMessage);
    },

    'test stroke color is only hash' : function () {
        var model = {
            "Stroke color": "#"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.STROKE_COLOR, readResult.errorMessage);
    },

    'test stroke color many characters': function () {
        var model = {
            "Stroke color": "#115533A"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.STROKE_COLOR, readResult.errorMessage);
    },

    'test stroke color out of bounds': function () {
        var model = {
            "Stroke color": "#AZA"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.STROKE_COLOR, readResult.errorMessage);
    },

    'test checked corners rounding': function () {
        var model = {
            "Corners rounding": "True"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertFalse(readResult.isError);
        assertTrue(readResult.cornersRoundings);
    },

    'test stroke opacity NaN': function () {
        var model = {
            "Stroke opacity": "aaa"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.STROKE_OPACITY.NAN, readResult.errorMessage);
    },

    'test stroke opacity out of bounds (negative value)': function () {
        var model = {
            "Stroke opacity": "-1"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.STROKE_OPACITY.OUT_OF_BOUNDS, readResult.errorMessage);
    },

    'test stroke opacity out of bounds (positive value)': function () {
        var model = {
            "Stroke opacity": "1.1"
        };

        var readResult = this.presenter.readConfiguration(model);

        assertTrue(readResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.STROKE_OPACITY.OUT_OF_BOUNDS, readResult.errorMessage);
    }
});