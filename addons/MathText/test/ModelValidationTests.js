TestCase("[MathText] Model validation", {
    setUp: function () {
        this.presenter = AddonMathText_create();
    },

    'test filled model configuration': function () {
        var model = {
            "isActivity": "False",
            "text": "<abc></abc>",
            "Is Visible": "False"
        };

        var validatedModel = this.presenter.validateModel(model);
        assertTrue(validatedModel.isValid);
        assertFalse(validatedModel.value.isActivity);
        assertFalse(validatedModel.value.isVisible);
        assertEquals("<abc></abc>", validatedModel.value.text);
    },

    'test not filled model configuration': function () {
        var model = {
            "isActivity": "False",
            "text": "",
            "Is Visible": "False"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isValid);
        assertFalse(validatedModel.value.isActivity);
        assertFalse(validatedModel.value.isVisible);
        assertEquals(this.presenter.EMPTY_MATHTEXT, validatedModel.value.text);
    },

});