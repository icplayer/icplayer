TestCase("[Paragraph] Model parsing", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
    },

    'test default font values': function() {
        var model = {
            'ID': 'Paragraph1'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('Verdana,Arial,Helvetica,sans-serif', validatedModel.fontFamily);
        assertEquals('11px', validatedModel.fontSize);
    },

    'test user font family': function () {
        var model = {
            'ID': 'Paragraph1',
            'Default font family': 'cursive'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('cursive', validatedModel.fontFamily);
        assertEquals('11px', validatedModel.fontSize);
    },

    'test user font size': function () {
        var model = {
            'ID': 'Paragraph1',
            'Default font size': '14px'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('Verdana,Arial,Helvetica,sans-serif', validatedModel.fontFamily);
        assertEquals('14px', validatedModel.fontSize);
    },

    'test user font family and size': function () {
        var model = {
            'ID': 'Paragraph1',
            'Default font family': 'cursive',
            'Default font size': '14px'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('cursive', validatedModel.fontFamily);
        assertEquals('14px', validatedModel.fontSize);
    },

    'test user custom CSS file': function () {
        var model = {
            'ID': 'Paragraph1',
            'Custom CSS': '/file/serve/123'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('/file/serve/123', validatedModel.content_css);
    },

    'test visible toolbar': function () {
        var model = {
            'ID': 'Paragraph1',
            'Height': 168
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isToolbarHidden);
        assertEquals(131, validatedModel.textAreaHeight);
    },

    'test hide toolbar': function () {
        var model = {
            'ID': 'Paragraph1',
            'Height': 168,
            'Hide toolbar': 'True'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isToolbarHidden);
        assertEquals(166, validatedModel.textAreaHeight);
    },

    'test custom toolbar available buttons': function() {
        var model = {
            'ID': 'Paragraph1',
            'Custom toolbar': 'newdocument bold italic underline strikethrough alignleft aligncenter alignright ' +
                              'alignjustify styleselect formatselect fontselect fontsizeselect ' +
                              'bullist numlist outdent indent blockquote undo redo removeformat subscript superscript |'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals(model['Custom toolbar'], validatedModel.toolbar);
    },

    'test custom toolbar unavailable buttons removed silently': function() {
        var model = {
            'ID': 'Paragraph1',
            'Custom toolbar': 'italic underline bold test fake button'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('italic underline bold', validatedModel.toolbar);
    },

    'test blank custom toolbar': function() {
        var model = {
            'ID': 'Paragraph1',
            'Custom toolbar': ''
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals(this.presenter.DEFAULTS.TOOLBAR, validatedModel.toolbar);
    },

    'test placeholder\'s plugin name should not contains spaces': function() {
        var model = {
            'ID': 'Paragraph ID with spaces',
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals(1, validatedModel.pluginName.split(" ").length);
    },

    'test placeholder\'s plugin name should be alphanumerical': function() {
        var model = {
            'ID': 'Paragraph\'s name !# with :special... char$ """'
        };

        var validatedModel = this.presenter.validateModel(model);
        assertNotEquals("", validatedModel.pluginName);
        assertEquals("", validatedModel.pluginName.replace(/[a-z0-9_]+/gi, ""));
    }
});