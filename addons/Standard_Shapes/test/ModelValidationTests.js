TestCase("[Standard Shapes] Model validation", {
    setUp: function () {
        this.presenter = AddonStandard_Shapes_create();
    },

    'test empty config': function () {
        var model = { };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);

        assertEquals(this.presenter.SHAPES.LINE, validatedModel.shape);
        assertEquals(0, validatedModel.rotation);
        assertEquals(1, validatedModel.strokeWidth);
        assertEquals("#000", validatedModel.strokeColor);
        assertEquals(1, validatedModel.strokeOpacity);

        assertEquals("#FFF", validatedModel.fillColor);

        assertFalse(validatedModel.cornersRoundings);
        assertEquals(this.presenter.LINE_ENDING.NONE, validatedModel.lineEnding);

        assertFalse(validatedModel.isVisible);
        assertFalse(validatedModel.isVisibleByDefault);
    },

    'test custom configuration': function () {
        var model = {
            'Is Visible': 'True',
            'Shape': 'Rectangle',
            'Rotation angle': '10',
            'Stroke width': '2',
            'Stroke color': '#ABC',
            'Corners rounding': 'True',
            'Line ending': 'None - Circle',
            'Stroke opacity': '0.85',
            'Fill color': '#DEF'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);

        assertEquals(this.presenter.SHAPES.RECTANGLE, validatedModel.shape);
        assertEquals(10, validatedModel.rotation);

        assertEquals(2, validatedModel.strokeWidth);
        assertEquals("#ABC", validatedModel.strokeColor);
        assertEquals(0.85, validatedModel.strokeOpacity);

        assertEquals("#DEF", validatedModel.fillColor);

        assertTrue(validatedModel.cornersRoundings);
        assertEquals(this.presenter.LINE_ENDING.NONE_AND_CIRCLE, validatedModel.lineEnding);

        assertTrue(validatedModel.isVisible);
        assertTrue(validatedModel.isVisibleByDefault);
    },

    'test rational NaN': function () {
        var model = {
            "Rotation angle": "aaa"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('R02', validatedModel.errorCode);
    },

    'test rotation out of bounds (negative value)': function () {
        var model = {
            "Rotation angle": "-1"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('R01', validatedModel.errorCode);
    },

    'test rotation out of bounds (positive value)': function () {
        var model = {
            "Rotation angle": "480"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('R01', validatedModel.errorCode);
    },

    'test stroke width NaN': function () {
        var model = {
            "Stroke width": "aaa"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST2', validatedModel.errorCode);
    },

    'test stroke width out of bounds (zero value)': function () {
        var model = {
            "Stroke width": "0"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST1', validatedModel.errorCode);
    },

    'test stroke width out of bounds (negative value)': function () {
        var model = {
            "Stroke width": "-0.1"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST1', validatedModel.errorCode);
    },

    'test stroke color NaN': function () {
        var model = {
            "Stroke color": "aaa"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST3', validatedModel.errorCode);
    },

    'test stroke color is only hash' : function () {
        var model = {
            "Stroke color": "#"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST3', validatedModel.errorCode);
    },

    'test stroke color many characters': function () {
        var model = {
            "Stroke color": "#115533A"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST3', validatedModel.errorCode);
    },

    'test stroke color out of bounds': function () {
        var model = {
            "Stroke color": "#AZA"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST3', validatedModel.errorCode);
    },

    'test checked corners rounding': function () {
        var model = {
            "Corners rounding": "True"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);
        assertTrue(validatedModel.cornersRoundings);
    },

    'test stroke opacity NaN': function () {
        var model = {
            "Stroke opacity": "aaa"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST5', validatedModel.errorCode);
    },

    'test stroke opacity out of bounds (negative value)': function () {
        var model = {
            "Stroke opacity": "-1"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST4', validatedModel.errorCode);
    },

    'test stroke opacity out of bounds (positive value)': function () {
        var model = {
            "Stroke opacity": "1.1"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST4', validatedModel.errorCode);
    }
});