TestCase("[Audio] Model validation", {
    setUp: function () {
        this.presenter = AddonAudio_create();
    },

    'test basic model': function () {
        var model = {
            "Is Visible": "True",
            onEnd: "DoubleStateButton1.deselect();",
            defaultControls: "True",
            ID: "Some id",
            forceLoadAudio: "True",
            Narration: "Lorem ipsum"
        };


        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isVisible);
        assertTrue(validatedModel.isVisibleByDefault);
        assertEquals("DoubleStateButton1.deselect();", validatedModel.onEndEventCode);
        assertFalse(validatedModel.enableLoop);
        assertFalse(validatedModel.displayTime);
        assertTrue(validatedModel.defaultControls);
        assertTrue(validatedModel.forceLoadAudio);
        assertEquals("Some id", validatedModel.addonID);
        assertEquals("Lorem ipsum", validatedModel.narration);
    }
});