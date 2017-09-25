TestCase("[Heading] Model validation", {

    setUp: function () {
        this.presenter = AddonHeading_create();

        this.model = {
            "ID": "Heading1",
            "Heading": "h2",
            "Content": "content"
        }
    },

    'test proper model': function () {
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);

        assertEquals("Heading1", validatedModel.ID);
        assertEquals("h2", validatedModel.heading);
        assertEquals("content", validatedModel.content);
    },

    'test empty property content': function () {
        this.model["Content"] = "";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('C01', validatedModel.errorCode);
    }

});