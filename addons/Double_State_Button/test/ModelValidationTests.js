TestCase("[Double State Button] Model validation", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();
    },

    'test proper model': function () {
        var model = {
            ID: "Double_State_Button1",
            "Is Visible": "True",
            Text: "Deselected text",
            Image: "/file/server/123456",
            onSelected: "feedback1.change('SELECTED');",
            "Text selected": "Selected text",
            "Image selected": "/file/server/654321",
            onDeselected: "feedback1.change('DESELECTED');"
        };

        var validationResult = this.presenter.validateModel(model);

        assertEquals("Double_State_Button1", validationResult.addonID);

        assertEquals("Selected text", validationResult.selected.text);
        assertEquals("/file/server/654321", validationResult.selected.image);
        assertEquals("feedback1.change('SELECTED');", validationResult.selected.event);
        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.BOTH, validationResult.selected.displayContent);

        assertEquals("Deselected text", validationResult.deselected.text);
        assertEquals("/file/server/123456", validationResult.deselected.image);
        assertEquals("feedback1.change('DESELECTED');", validationResult.deselected.event);
        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.BOTH, validationResult.deselected.displayContent);

        assertFalse(validationResult.isSelected);
        assertFalse(validationResult.isSelectedByDefault);

        assertFalse(validationResult.isDisabled);
        assertFalse(validationResult.isDisabledByDefault);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);

        assertFalse(validationResult.isErrorMode);
    },

    'test old model': function () {
        var model = {
            "Is Visible": "True",
            ID: "Double_State_Button1",
            Text: "Deselected text",
            "Text selected": "Selected text"
        };

        var validationResult = this.presenter.validateModel(model);

        assertEquals("Double_State_Button1", validationResult.addonID);

        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.TEXT, validationResult.deselected.displayContent);
        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.TEXT, validationResult.selected.displayContent);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertFalse(validationResult.isErrorMode);
    },

    'test mixed display content': function () {
        var model = {
            "Is Visible": "True",
            ID: "Double_State_Button1",
            Text: "Deselected text",
            Image: "/file/server/123456",
            "Text selected": "Selected text"
        };

        var validationResult = this.presenter.validateModel(model);

        assertEquals("Double_State_Button1", validationResult.addonID);

        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.BOTH, validationResult.deselected.displayContent);
        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.TEXT, validationResult.selected.displayContent);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertFalse(validationResult.isErrorMode);
    }
});