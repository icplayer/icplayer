TestCase("[Group Chat Button] Model validation", {
    setUp: function () {
        this.presenter = AddonGroup_Chat_Button_create();
    },

    'test given correct model when validating then return correct configuration': function () {
        var model = {
            Title: "123456",
            Image: "/file/server/123456",
            'Is Visible': "True"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals(presenter.DISPLAY_CONTENT_TYPE.BOTH, validatedModel.displayContent);
        assertEquals("123456", validatedModel.title);
        assertEquals("/file/server/123456", validatedModel.image);
        assertEquals(true, validatedModel.isVisible);
        assertEquals(true, validatedModel.isVisibleByDefault);
    },

    'test given model without title parameter when validating then set title to empty and displayContent to IMAGE': function () {
        var model = {
            Image: "/file/server/123456",
            'Is Visible': "True"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals(presenter.DISPLAY_CONTENT_TYPE.IMAGE, validatedModel.displayContent);
        assertEquals("", validatedModel.title);
    },

    'test given model without image parameter when validating then set image to empty and displayContent to TITLE': function () {
        var model = {
            Title: "123456",
            'Is Visible': "True"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals(presenter.DISPLAY_CONTENT_TYPE.TITLE, validatedModel.displayContent);
        assertEquals("", validatedModel.image);
    },

    'test given model without title and image parameters when validating then set title and image to empty and displyContent to NONE': function () {
        var model = {
            'Is Visible': "True"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals(presenter.DISPLAY_CONTENT_TYPE.TITLE, validatedModel.displayContent);
        assertEquals("", validatedModel.title);
        assertEquals("", validatedModel.image);
    },

    'test given model with false Is Visible parameter when validating then set isVisible and isVisibleByDefault to false': function () {
        var model = {
            'Is Visible': "False"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals(false, validatedModel.isVisible);
        assertEquals(false, validatedModel.isVisibleByDefault);
    },
});