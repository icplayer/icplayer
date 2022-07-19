TestCase("[Speechace] Upgrade model", {
    setUp: function () {
        this.presenter = AddonSpeechace_create();
    },

    'test given model without courseId when upgrade model then new model has courseId set to empty string': function () {
        var model = {};

        var upgradedModel = this.presenter.upgradeModel(model);

        assertTrue(upgradedModel.hasOwnProperty("CourseId"));
        assertEquals(upgradedModel.CourseId, "");
    },

    'test given model with correct courseId when upgrade model then new model has courseId with unchanged value': function () {
        var model = {CourseId: "test_embed"};

        var upgradedModel = this.presenter.upgradeModel(model);

        assertTrue(upgradedModel.hasOwnProperty("CourseId"));
        assertEquals(upgradedModel.CourseId, model.CourseId);
    }
});