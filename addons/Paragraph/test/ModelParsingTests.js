TestCase("[Paragraph] Model parsing", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
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
    }
});