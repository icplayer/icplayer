TestCase("Model validation", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
    },

    'test proper model configuration': function () {
        var model = {
            ID: 'MultipleGap1'
        };

        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isError);
        assertUndefined(validationResult.errorMessage);

        assertEquals('MultipleGap1', validationResult.ID);
        assertTrue(validationResult.isActivity);
    }
});