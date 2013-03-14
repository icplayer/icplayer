TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonImage_Identification_create();
    },

    'test full config': function () {
        var model = {
            "Is Visible": "True",
            ID: 'ImageIdentification1',
            Image: "/file/serve/123456",
            SelectionCorrect: ""
        };

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);

        assertFalse(validationResult.shouldBeSelected);
        assertFalse(validationResult.isSelected);

        assertEquals("/file/serve/123456", validationResult.imageSrc);
        assertEquals('ImageIdentification1', validationResult.addonID);
    }
});