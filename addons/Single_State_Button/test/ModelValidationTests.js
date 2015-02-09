TestCase("[Single State Button] Model validation", {
    setUp: function () {
        this.presenter = AddonSingle_State_Button_create();
    },

    'test full config': function () {
        var model = {
            "Is Visible": "True",
            Title: "Some text",
            Image: "/file/server/123456",
            onClick: "Empty script"
        };

        var validationResult = this.presenter.validateModel(model);

        assertEquals("Some text", validationResult.title);
        assertEquals("/file/server/123456", validationResult.image);
        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.BOTH, validationResult.displayContent);

        assertEquals("Empty script", validationResult.onClickEvent.value);
        assertFalse(validationResult.onClickEvent.isEmpty);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertFalse(validationResult.isErrorMode);
    },

    'test empty model': function () {
        var model = {
            "Is Visible": "True"
        };

        var validationResult = this.presenter.validateModel(model);

        assertEquals("", validationResult.title);
        assertEquals("", validationResult.image);
        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.NONE, validationResult.displayContent);

        assertEquals("", validationResult.onClickEvent.value);
        assertTrue(validationResult.onClickEvent.isEmpty);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertFalse(validationResult.isErrorMode);
    }
});