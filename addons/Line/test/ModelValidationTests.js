TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonLine_create();
    },

    'test empty config': function () {
        var model = { };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);
        assertEquals(0, validatedModel.rotation);
        assertEquals(1, validatedModel.strokeWidth);
        assertEquals("#000", validatedModel.strokeColor);
        assertEquals(1, validatedModel.strokeOpacity);
        assertFalse(validatedModel.cornersRoundings);
        assertEquals(this.presenter.LINE_ENDING.NONE, validatedModel.rightLineEnding);
        assertEquals(this.presenter.LINE_ENDING.NONE, validatedModel.leftLineEnding);
        assertFalse(validatedModel.isVisible);
        assertFalse(validatedModel.isVisibleByDefault);
    },

    'test custom configuration': function () {
        var model = {
            'Is Visible': 'True',
            'Rotation angle': '10',
            'Line width': '2',
            'Line color': '#ABC',
            'Right line ending': 'Round',
            'Left line ending': 'Circle',
            'Line opacity': '0.85'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);
        assertEquals(10, validatedModel.rotation);
        assertEquals(2, validatedModel.strokeWidth);
        assertEquals("#ABC", validatedModel.strokeColor);
        assertEquals(0.85, validatedModel.strokeOpacity);
        assertEquals(this.presenter.LINE_ENDING.CIRCLE, validatedModel.leftLineEnding);
        assertEquals(this.presenter.LINE_ENDING.ROUND, validatedModel.rightLineEnding);
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

    'test line width NaN': function () {
        var model = {
            "Line width": "aaa"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST2', validatedModel.errorCode);
    },

    'test line width out of bounds (zero value)': function () {
        var model = {
            "Line width": "0"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST1', validatedModel.errorCode);
    },

    'test line width out of bounds (negative value)': function () {
        var model = {
            "Line width": "-0.1"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST1', validatedModel.errorCode);
    },

    'test stroke color NaN': function () {
        var model = {
            "Line color": "aaa"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST3', validatedModel.errorCode);
    },

    'test line color is only hash' : function () {
        var model = {
            "Line color": "#"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST3', validatedModel.errorCode);
    },

    'test line color many characters': function () {
        var model = {
            "Line color": "#115533A"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST3', validatedModel.errorCode);
    },

    'test line color out of bounds': function () {
        var model = {
            "Line color": "#AZA"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST3', validatedModel.errorCode);
    },

    'test line opacity NaN': function () {
        var model = {
            "Line opacity": "aaa"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST5', validatedModel.errorCode);
    },

    'test line opacity out of bounds (negative value)': function () {
        var model = {
            "Line opacity": "-1"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST4', validatedModel.errorCode);
    },

    'test line opacity out of bounds (positive value)': function () {
        var model = {
            "Line opacity": "1.1"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('ST4', validatedModel.errorCode);
    }
});