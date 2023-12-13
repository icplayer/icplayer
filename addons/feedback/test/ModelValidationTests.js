TestCase("Model validation", {
    setUp: function () {
        this.presenter = Addonfeedback_create();
    },

    'test proper model': function () {
        var model = {
            'Reset response on page change': 'True',
            'Fade transitions': 'False',
            'Center horizontally': 'True',
            'Center vertically': 'False',
            'Mute': 'True'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.resetResponse);
        assertFalse(validatedModel.fadeTransitions);
        assertTrue(validatedModel.centerHorizontally);
        assertFalse(validatedModel.centerVertically);
        assertTrue(validatedModel.isActivity);
        assertTrue(validatedModel.isMute);
    }
});