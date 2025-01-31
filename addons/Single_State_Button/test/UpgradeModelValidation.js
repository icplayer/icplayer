TestCase("[Single State Button] Upgrade model validation", {
    setUp: function () {
        this.presenter = AddonSingle_State_Button_create();
    },

    'test upgrade disable': function () {
        var oldModel = {
            Title: "Some text",
            Image: "/file/server/123456",
            onClick: "Empty script"
        }, expectedModel = {
            Title: "Some text",
            Image: "/file/server/123456",
            onClick: "Empty script",
            Disable: "False"
        };

        var upgradedModel = this.presenter.upgradeDisable(oldModel);

        assertEquals(expectedModel, upgradedModel);
    },

    'test given model without renderSVGAsHTML when upgrading model then renderSVGAsHTML will be added with default value': function () {
        var oldModel = {};

        var upgradedModel = this.presenter.upgradeModel(oldModel);

        assertEquals('False', upgradedModel['renderSVGAsHTML']);
    },

    'test given model with renderSVGAsHTML when upgrading model then renderSVGAsHTML value will not be overwritten': function () {
        var oldModel = {'renderSVGAsHTML': 'True'};

        var upgradedModel = this.presenter.upgradeModel(oldModel);

        assertEquals('True', upgradedModel['renderSVGAsHTML']);
    }
});