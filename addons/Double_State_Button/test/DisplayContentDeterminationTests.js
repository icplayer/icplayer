TestCase("[Double State Button] Display content determination", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();
    },

    'test neither text nor image provided': function () {
        var text = this.presenter.validateString(),
            image = this.presenter.validateString();

        var result = this.presenter.determineDisplayContent(text, image);

        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.NONE, result);
    },

    'test text provided': function () {
        var text = this.presenter.validateString("Some text"),
            image = this.presenter.validateString();

        var result = this.presenter.determineDisplayContent(text, image);

        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.TEXT, result);
    },

    'test image provided': function () {
        var text = this.presenter.validateString(),
            image = this.presenter.validateString("/file/serve/123456");

        var result = this.presenter.determineDisplayContent(text, image);

        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.IMAGE, result);
    },

    'test both text and image provided': function () {
        var text = this.presenter.validateString("Some text"),
            image = this.presenter.validateString("/file/serve/123456");

        var result = this.presenter.determineDisplayContent(text, image);

        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.BOTH, result);
    }
});