TestCase("Model validation", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test proper model': function () {
        var model = {
            'ID': 'graph1',
            'Is Visible': "True"
        };

        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isError);
        assertUndefined(validationResult.errorMessage);

        assertEquals('graph1', validationResult.ID);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertFalse(validationResult.shouldCalcScore);
    }
});