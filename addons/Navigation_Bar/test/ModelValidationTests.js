TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonNavigation_Bar_create();
    },

    'test model validation': function() {
        var model = { };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.showNextPrevArrows);
        assertFalse(validatedModel.hideHomeLastArrows);
    }
});