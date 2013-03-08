TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonAudio_create();
    },

    'test basic model': function () {
        var model = {
            "Is Visible": "True",
            onEnd: "DoubleStateButton1.deselect();",
            defaultControls: "True"
        };


        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isVisible);
        assertTrue(validatedModel.isVisibleByDefault);
        assertEquals("DoubleStateButton1.deselect();", validatedModel.onEndEventCode);
        assertFalse(validatedModel.enableLoop);
        assertFalse(validatedModel.displayTime);
        assertTrue(validatedModel.defaultControls);
    }
});