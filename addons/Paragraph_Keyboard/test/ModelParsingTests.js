TestCase("[Paragraph Keyboard] Model parsing", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
    },

    'test default font values': function() {
        var model = {
            'ID': 'Paragraph_Keyboard1',
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('Verdana,Arial,Helvetica,sans-serif', validatedModel.fontFamily);
        assertEquals('11px', validatedModel.fontSize);
    },

    'test user font family': function () {
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'Default font family': 'cursive'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('cursive', validatedModel.fontFamily);
        assertEquals('11px', validatedModel.fontSize);
    },

    'test user font size': function () {
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'Default font size': '14px'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('Verdana,Arial,Helvetica,sans-serif', validatedModel.fontFamily);
        assertEquals('14px', validatedModel.fontSize);
    },

    'test user font family and size': function () {
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'Default font family': 'cursive',
            'Default font size': '14px'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('cursive', validatedModel.fontFamily);
        assertEquals('14px', validatedModel.fontSize);
    },

    'test user custom CSS file': function () {
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'Custom CSS': '/file/serve/123'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('/file/serve/123', validatedModel.content_css);
    },

    'test visible toolbar': function () {
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'Height': 168
        };

        var validatedModel = this.presenter.parseModel(model);

        assertFalse(validatedModel.isToolbarHidden);
        assertEquals(131, validatedModel.textAreaHeight);
    },

    'test hide toolbar': function () {
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'Height': 168,
            'Hide toolbar': 'True'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertTrue(validatedModel.isToolbarHidden);
        assertEquals(166, validatedModel.textAreaHeight);
    },

    'test placeholder\'s plugin name should not contains spaces': function() {
        var model = {
            'ID': 'Paragraph Keyboard ID with spaces',
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals(1, validatedModel.pluginName.split(" ").length);
    },

    'test placeholder\'s plugin name should be alphanumerical': function() {
        var model = {
            'ID': 'Paragraph Keyboard\'s name !# with :special... char$ """'
        };

        var validatedModel = this.presenter.parseModel(model);
        assertNotEquals("", validatedModel.pluginName);
        assertEquals("", validatedModel.pluginName.replace(/[a-z0-9_]+/gi, ""));
    },

    'test custom toolbar available buttons': function() {
        var toolbar = 'newdocument bold italic underline strikethrough alignleft aligncenter alignright ' +
                              'alignjustify styleselect formatselect fontselect fontsizeselect ' +
                              'bullist numlist outdent indent blockquote undo redo removeformat subscript superscript';

        var model = {
            'ID': 'Paragraph_Keyboard1',
            'Custom toolbar': toolbar,
            "Width": toolbar.split(" ").length * this.presenter.DEFAULTS.BUTTON_WIDTH + this.presenter.DEFAULTS.FORMAT_WIDTH
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals(model['Custom toolbar'], validatedModel.toolbar);
    },

    'test custom toolbar unavailable buttons removed silently': function() {
        var toolbar = 'italic underline bold test fake button';
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'Custom toolbar': toolbar,
            "Width": toolbar.split(" ").length * this.presenter.DEFAULTS.BUTTON_WIDTH
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('italic underline bold', validatedModel.toolbar);
    },

    'test blank custom toolbar': function() {
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'Custom toolbar': '',
            "Width": this.presenter.DEFAULTS.TOOLBAR.length * this.presenter.DEFAULTS.BUTTON_WIDTH
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals(this.presenter.DEFAULTS.TOOLBAR, validatedModel.toolbar);
    },

    'test Custom Keyboard Layout with invalid JSON': function() {
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'layoutType': 'custom',
            'keyboardLayout': '{default:}'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('evaluationError', validatedModel.errorCode);
    },

    'test invalid Custom Keyboard Layout': function() {
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'layoutType': 'custom',
            'keyboardLayout': '{"default": "s t r i n g"}'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('defaultLayoutError', validatedModel.errorCode);
    },

    'test proper Custom Keyboard Layout': function() {
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'layoutType': 'custom',
            'keyboardLayout': '{"default": ["s t r i n g"]}'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertTrue(validatedModel.isValid);
    },

    'test given manual grading and title when properties set then should be the same in model': function () {
        var model = {
            'ID': 'Paragraph_Keyboard1',
            'Manual grading': false,
            'Title': 'Sample'
        };

        var upgradedModel = this.presenter.upgradeModel(model);
        var validatedModel = this.presenter.parseModel(upgradedModel);

        assertEquals('Sample', validatedModel.title);
        assertEquals(false, validatedModel.manualGrading);
    },

    'test given manual grading and title when properties are empty then should be empty and false in model': function () {
        var model = {
            'ID': 'Paragraph_Keyboard1'
        };

        var upgradedModel = this.presenter.upgradeModel(model);
        var validatedModel = this.presenter.parseModel(upgradedModel);

        assertEquals('', validatedModel.title);
        assertEquals(false, validatedModel.manualGrading);
    },

    'test not given value as weight when validating model in run mode then use default value 1 as weight': function () {
        const model = {
            'ID': 'Paragraph ID'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals(1, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test not given value as weight when validating model in preview mode then use default value 1 as weight': function () {
        const model = {
            'ID': 'Paragraph ID'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals(1, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given the lowest number that can be accepted as weight when validating model in run mode then accept it to the model': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '0'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals(0, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given the lowest number that can be accepted as weight when validating model in preview mode then accept it to the model': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '0'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals(0, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given the largest number that can be accepted as weight when validating model in run mode then accept it to the model': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '100'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals(100, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given the largest number that can be accepted as weight when validating model in preview mode then accept it to the model': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '100'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals(100, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given random string as weight when validating model in run mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': 'Lorem'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given random string as weight when validating model in preview mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': 'Lorem'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given negative number as weight when validating model in run mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '-1'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given negative number as weight when validating model in preview mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '-1'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given number larger then 100 as weight when validating model in run mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '101'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given number larger then 100 as weight when validating model in preview mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '101'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given float as weight when validating model in run mode then execute floor on value and accept it to the model': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '2.8'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals(2, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given float as weight when validating model in preview mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '2.8'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.parseModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },
});
