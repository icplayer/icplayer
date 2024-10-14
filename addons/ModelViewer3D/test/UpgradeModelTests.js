TestCase("[ModelViewer3D] Upgrade model tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.model = {
            "ID": "ID",
        };
    },

    'test given model without "enableFullscreen" when upgrading model then add "enableFullscreen" with "False"': function () {
        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals("False", upgradedModel["enableFullscreen"]);
    },

    'test given model with value in "enableFullscreen" when upgrading model then keep provided value': function () {
        this.model["enableFullscreen"] = "True";

        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals("True", upgradedModel["enableFullscreen"]);
    },
});
