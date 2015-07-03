TestCase("[Zoom Image] Model Validation", {
    setUp: function () {
        this.presenter = AddonZoom_Image_create();

        this.model = {
            "ID": "Zoom_Image1",
            "Is Visible": "True",
            "Full Screen image": "/file/serve/6119881720201217",
            "Page image": "/file/serve/6119881720201216"
        };
    },

    'test proper model': function() {
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertTrue(validatedModel.isVisible);
        assertEquals("Zoom_Image1", validatedModel.ID);
        assertEquals("/file/serve/6119881720201217", validatedModel.bigImage);
        assertEquals("/file/serve/6119881720201216", validatedModel.smallImage);
    },

    'test empty Full Screen image property': function() {
        this.model["Full Screen image"] = "";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("IMAGE01", validatedModel.errorCode);
    },

    'test empty Page image property': function() {
        this.model["Page image"] = "";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("IMAGE01", validatedModel.errorCode);
    },

    'test visible is undefined': function() {
        var validatedModel = this.presenter.validateModel(this.model);

        delete this.model["Is Visible"];

        assertEquals(undefined, this.model["Is Visible"]);
        assertTrue(validatedModel.isVisible);
    }
});