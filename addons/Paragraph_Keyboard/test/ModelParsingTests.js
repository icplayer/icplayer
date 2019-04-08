TestCase("[Paragraph] Model parsing", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
    },

    'test default font values': function() {
        var model = {};

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('Verdana,Arial,Helvetica,sans-serif', validatedModel.fontFamily);
        assertEquals('11px', validatedModel.fontSize);
    },

    'test user font family': function () {
        var model = {
            'Default font family': 'cursive'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('cursive', validatedModel.fontFamily);
        assertEquals('11px', validatedModel.fontSize);
    },

    'test user font size': function () {
        var model = {
            'Default font size': '14px'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('Verdana,Arial,Helvetica,sans-serif', validatedModel.fontFamily);
        assertEquals('14px', validatedModel.fontSize);
    },

    'test user font family and size': function () {
        var model = {
            'Default font family': 'cursive',
            'Default font size': '14px'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('cursive', validatedModel.fontFamily);
        assertEquals('14px', validatedModel.fontSize);
    },

    'test user custom CSS file': function () {
        var model = {
            'Custom CSS': '/file/serve/123'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('/file/serve/123', validatedModel.content_css);
    },

    'test visible toolbar': function () {
        var model = {
            'Height': 168
        };

        var validatedModel = this.presenter.parseModel(model);

        assertFalse(validatedModel.isToolbarHidden);
        assertEquals(131, validatedModel.textAreaHeight);
    },

    'test hide toolbar': function () {
        var model = {
            'Height': 168,
            'Hide toolbar': 'True'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertTrue(validatedModel.isToolbarHidden);
        assertEquals(166, validatedModel.textAreaHeight);
    },

    'test custom toolbar available buttons': function() {
        var toolbar = 'newdocument bold italic underline strikethrough alignleft aligncenter alignright ' +
                              'alignjustify styleselect formatselect fontselect fontsizeselect ' +
                              'bullist numlist outdent indent blockquote undo redo removeformat subscript superscript';

        var model = {
            'Custom toolbar': toolbar,
            "Width": toolbar.split(" ").length * this.presenter.DEFAULTS.BUTTON_WIDTH + this.presenter.DEFAULTS.FORMAT_WIDTH
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals(model['Custom toolbar'], validatedModel.toolbar);
    },

    'test custom toolbar unavailable buttons removed silently': function() {
        var toolbar = 'italic underline bold test fake button';
        var model = {
            'Custom toolbar': toolbar,
            "Width": toolbar.split(" ").length * this.presenter.DEFAULTS.BUTTON_WIDTH
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('italic underline bold', validatedModel.toolbar);
    },

    'test blank custom toolbar': function() {
        var model = {
            'Custom toolbar': '',
            "Width": this.presenter.DEFAULTS.TOOLBAR.length * this.presenter.DEFAULTS.BUTTON_WIDTH
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals(this.presenter.DEFAULTS.TOOLBAR, validatedModel.toolbar);
    },

    'test Custom Keyboard Layout with invalid JSON': function() {
        var model = {
            'layoutType': 'custom',
            'keyboardLayout': '{default:}'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('evaluationError', validatedModel.error);

    },

    'test invalid Custom Keyboard Layout': function() {
        var model = {
            'layoutType': 'custom',
            'keyboardLayout': '{"default": "s t r i n g"}'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals('defaultLayoutError', validatedModel.error);

    },

    'test proper Custom Keyboard Layout': function() {
        var model = {
            'layoutType': 'custom',
            'keyboardLayout': '{"default": ["s t r i n g"]}'
        };

        var validatedModel = this.presenter.parseModel(model);

        assertEquals(false, validatedModel.error);

    },

    'test given manual grading and title when properties set than should be the same in model': function () {
        var model = {
            'ID': 'Paragraph ID',
            'Manual grading': false,
            'Title': 'Sample'
        };

        var upgradedModel = this.presenter.upgradeModel(model);
        var validatedModel = this.presenter.parseModel(upgradedModel);

        assertEquals('Sample', validatedModel.title);
        assertEquals(false, validatedModel.manualGrading);
    },

    'test given manual grading and title when properties are empty than should be empty and false in model': function () {
        var model = {
            'ID': 'Paragraph ID'
        };

        var upgradedModel = this.presenter.upgradeModel(model);
        var validatedModel = this.presenter.parseModel(upgradedModel);

        assertEquals('', validatedModel.title);
        assertEquals(false, validatedModel.manualGrading);
    },

    'test given weight when properties set than should be the same in model': function () {
        var model = {
            'ID': 'Paragraph ID',
            'Weight': '0'
        };

        var upgradedModel = this.presenter.upgradeModel(model);
        var validatedModel = this.presenter.parseModel(upgradedModel);

        assertEquals('0', validatedModel.weight);
    },

    'test given weight when properties are empty than should be empty in model': function () {
        var model = {
            'ID': 'Paragraph ID'
        };

        var upgradedModel = this.presenter.upgradeModel(model);
        var validatedModel = this.presenter.parseModel(upgradedModel);

        assertEquals('', validatedModel.weight);
    }
});