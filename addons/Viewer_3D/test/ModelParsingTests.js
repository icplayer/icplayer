TestCase("[3D Viewer] Model parsing", {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
    },

    'test empty model (missing OBJ file)': function () {
        var model = {
            ID: '3D_Viewer1',
            'Is Visible': 'True'
        };

        var parsedModel = this.presenter.parseModel(model);

        assertFalse(parsedModel.isValid);
        assertEquals('ERR_01', parsedModel.errorCode);
    },

    'test initial rotation error': function () {
        var model = {
            ID: '3D_Viewer1',
            'Is Visible': 'True',
            'OBJ File': '/file/serve/123456',
            'Initial Rotation Y': 'NaN'
        };

        var parsedModel = this.presenter.parseModel(model);

        assertFalse(parsedModel.isValid);
        assertEquals('ERR_02', parsedModel.errorCode);
    },

    'test model color error': function () {
        var model = {
            ID: '3D_Viewer1',
            'Is Visible': 'True',
            'OBJ File': '/file/serve/123456',
            'Model Color': 'NaN'
        };

        var parsedModel = this.presenter.parseModel(model);

        assertFalse(parsedModel.isValid);
        assertEquals('ERR_03', parsedModel.errorCode);
    },

    'test background color error': function () {
        var model = {
            ID: '3D_Viewer1',
            'Is Visible': 'True',
            'OBJ File': '/file/serve/123456',
            'Background Color 1': 'NaN'
        };

        var parsedModel = this.presenter.parseModel(model);

        assertFalse(parsedModel.isValid);
        assertEquals('ERR_04', parsedModel.errorCode);
    },

    'test default values': function () {
        var model = {
            ID: '3D_Viewer1',
            'Is Visible': 'True',
            'OBJ File': '/file/serve/123456'
        };

        var parsedModel = this.presenter.parseModel(model);

        assertTrue(parsedModel.isValid);
        assertEquals('/file/serve/123456', parsedModel.files.OBJ);
        assertEquals('', parsedModel.files.MTL);
        assertEquals(0, parsedModel.initialRotation.X);
        assertEquals(0, parsedModel.initialRotation.Y);
        assertEquals(0, parsedModel.initialRotation.Z);
        assertEquals("#EEEEEE", parsedModel.colors.model);
        assertEquals("#CCCCCC", parsedModel.colors.background1);
        assertEquals("#EEEEEE", parsedModel.colors.background2);
        assertEquals('SMOOTH', parsedModel.renderMode);
        assertEquals('standard', parsedModel.quality);
        assertTrue(parsedModel.isVisible);
        assertTrue(parsedModel.isCurrentlyVisible);

        assertEquals('3D_Viewer1', parsedModel.addonID);
        assertFalse(parsedModel.queues.X.isActive);
        assertEquals('3D_Viewer1_X', parsedModel.queues.X.name);
        assertEquals(0, parsedModel.queues.X.delay);
        assertEquals(0, parsedModel.queues.X.angle);
        assertFalse(parsedModel.queues.Y.isActive);
        assertEquals('3D_Viewer1_Y', parsedModel.queues.Y.name);
        assertEquals(0, parsedModel.queues.Y.delay);
        assertEquals(0, parsedModel.queues.Y.angle);
        assertFalse(parsedModel.queues.Z.isActive);
        assertEquals('3D_Viewer1_Y', parsedModel.queues.Y.name);
        assertEquals(0, parsedModel.queues.Z.delay);
        assertEquals(0, parsedModel.queues.Z.angle);
    },

    'test custom values': function () {
        var model = {
            ID: '3D_Viewer1',
            'Is Visible': 'False',
            'OBJ File': '/file/serve/123456',
            'MTL File': '/file/serve/654321',
            'Initial Rotation X': '45',
            'Initial Rotation Y': '90',
            'Initial Rotation Z': '135',
            'Model Color': '#AAFFAA',
            'Background Color 1': '#AABBCC',
            'Background Color 2': '#DDEEFF',
            'Render Mode': 'Wireframe'
        };

        var parsedModel = this.presenter.parseModel(model);

        assertTrue(parsedModel.isValid);
        assertEquals('/file/serve/123456', parsedModel.files.OBJ);
        assertEquals('/file/serve/654321', parsedModel.files.MTL);
        assertEquals(45, parsedModel.initialRotation.X);
        assertEquals(90, parsedModel.initialRotation.Y);
        assertEquals(135, parsedModel.initialRotation.Z);
        assertEquals("#AAFFAA", parsedModel.colors.model);
        assertEquals("#AABBCC", parsedModel.colors.background1);
        assertEquals("#DDEEFF", parsedModel.colors.background2);
        assertEquals('WIREFRAME', parsedModel.renderMode);
        assertEquals('standard', parsedModel.quality);
        assertFalse(parsedModel.isVisible);
        assertFalse(parsedModel.isCurrentlyVisible);

        assertEquals('3D_Viewer1', parsedModel.addonID);
        assertFalse(parsedModel.queues.X.isActive);
        assertEquals('3D_Viewer1_X', parsedModel.queues.X.name);
        assertEquals(0, parsedModel.queues.X.delay);
        assertEquals(0, parsedModel.queues.X.angle);
        assertFalse(parsedModel.queues.Y.isActive);
        assertEquals('3D_Viewer1_Y', parsedModel.queues.Y.name);
        assertEquals(0, parsedModel.queues.Y.delay);
        assertEquals(0, parsedModel.queues.Y.angle);
        assertFalse(parsedModel.queues.Z.isActive);
        assertEquals('3D_Viewer1_Y', parsedModel.queues.Y.name);
        assertEquals(0, parsedModel.queues.Z.delay);
        assertEquals(0, parsedModel.queues.Z.angle);
    }
});

TestCase("[3D Viewer] rotation parsing - single" , {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
    },

    'test default value': function () {
        var parsedRotation = this.presenter.parseRotation('');

        assertTrue(parsedRotation.isValid);
        assertEquals(0, parsedRotation.rotation);
    },

    'test zero value': function () {
        var parsedRotation = this.presenter.parseRotation('0');

        assertTrue(parsedRotation.isValid);
        assertEquals(0, parsedRotation.rotation);
    },

    'test custom value': function () {
        var parsedRotation = this.presenter.parseRotation('120');

        assertTrue(parsedRotation.isValid);
        assertEquals(120, parsedRotation.rotation);
    },

    'test invalid value': function () {
        var parsedRotation = this.presenter.parseRotation('-120');

        assertFalse(parsedRotation.isValid);
    },

    'test values not numbers': function () {
        var parsedRotation = this.presenter.parseRotation('number');

        assertFalse(parsedRotation.isValid);
    }
});

TestCase("[3D Viewer] rotation parsing" , {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
    },

    'test default value': function () {
        var model = {};

        var parsedRotation = this.presenter.parseInitialRotation(model);

        assertTrue(parsedRotation.isValid);
        assertEquals(0, parsedRotation.X);
        assertEquals(0, parsedRotation.Y);
        assertEquals(0, parsedRotation.Z);
    },

    'test custom value': function () {
        var model = {
            'Initial Rotation X': '110',
            'Initial Rotation Y': '120',
            'Initial Rotation Z': '135'
        };

        var parsedRotation = this.presenter.parseInitialRotation(model);

        assertTrue(parsedRotation.isValid);
        assertEquals(110, parsedRotation.X);
        assertEquals(120, parsedRotation.Y);
        assertEquals(135, parsedRotation.Z);
    },

    'test invalid value': function () {
        var model = {
            'Initial Rotation X': '110',
            'Initial Rotation Y': 'number',
            'Initial Rotation Z': '135'
        };

        var parsedRotation = this.presenter.parseInitialRotation(model);

        assertFalse(parsedRotation.isValid);
    }
});

TestCase("[3D Viewer] model color parsing" , {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
    },

    'test default value': function () {
        var parsedModelColor = this.presenter.parseModelColor('');

        assertTrue(parsedModelColor.isValid);
        assertEquals('#EEEEEE', parsedModelColor.color);
    },

    'test custom value': function () {
        var parsedModelColor = this.presenter.parseModelColor('#FFEEDD');

        assertTrue(parsedModelColor.isValid);
        assertEquals('#FFEEDD', parsedModelColor.color);
    },

    'test invalid value': function () {
        var parsedModelColor = this.presenter.parseModelColor('#ZZEEDD');

        assertFalse(parsedModelColor.isValid);
    }
});

TestCase("[3D Viewer] background colors parsing" , {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
    },

    'test default values': function () {
        var model = { };

        var parsedBackgroundColors = this.presenter.parseBackgroundColors(model);

        assertTrue(parsedBackgroundColors.isValid);
        assertEquals('#CCCCCC', parsedBackgroundColors.color1);
        assertEquals('#EEEEEE', parsedBackgroundColors.color2);
    },

    'test custom values': function () {
        var model = {
            'Background Color 1': '#AABBCC',
            'Background Color 2': '#FFEEDD'
        };

        var parsedBackgroundColors = this.presenter.parseBackgroundColors(model);

        assertTrue(parsedBackgroundColors.isValid);
        assertEquals('#AABBCC', parsedBackgroundColors.color1);
        assertEquals('#FFEEDD', parsedBackgroundColors.color2);
    },

    'test invalid value for first color': function () {
        var model = {
            'Background Color 1': '#AABBCCF',
            'Background Color 2': '#FFEEDD'
        };

        var parsedBackgroundColors = this.presenter.parseBackgroundColors(model);

        assertFalse(parsedBackgroundColors.isValid);
    },

    'test invalid value for second color': function () {
        var model = {
            'Background Color 1': '#AABBCC',
            'Background Color 2': '#GGEEDD'
        };

        var parsedBackgroundColors = this.presenter.parseBackgroundColors(model);

        assertFalse(parsedBackgroundColors.isValid);
    }
});