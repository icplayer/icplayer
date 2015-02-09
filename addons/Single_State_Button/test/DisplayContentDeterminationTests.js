TestCase("[Single State Button] Display content determination", {
    setUp: function () {
        this.presenter = AddonSingle_State_Button_create();
    },

    'test both text and image are provided': function () {
        var text = {
            isEmpty: false,
            value: "Some value"
        }, image = {
            isEmpty: false,
            value: "Some value"
        };

        var determinationResult = this.presenter.determineDisplayContent(text, image);

        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.BOTH, determinationResult);
    },

    'test neither text nor image are provided': function () {
        var text = {
            isEmpty: true,
            value: ""
        }, image = {
            isEmpty: true,
            value: ""
        };

        var determinationResult = this.presenter.determineDisplayContent(text, image);

        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.NONE, determinationResult);
    },

    'test only text is provided': function () {
        var text = {
            isEmpty: false,
            value: "Some value"
        }, image = {
            isEmpty: true,
            value: ""
        };

        var determinationResult = this.presenter.determineDisplayContent(text, image);

        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.TITLE, determinationResult);
    },

    'test only image is provided': function () {
        var text = {
            isEmpty: true,
            value: ""
        }, image = {
            isEmpty: false,
            value: "Some value"
        };

        var determinationResult = this.presenter.determineDisplayContent(text, image);

        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.IMAGE, determinationResult);
    }
});