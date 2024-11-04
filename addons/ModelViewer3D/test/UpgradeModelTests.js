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

    'test given model without "modelIOS" when upgrading model then add "modelIOS" with empty string': function () {
        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals("", upgradedModel["modelIOS"]);
    },

    'test given model with value in "modelIOS" when upgrading model then keep provided value': function () {
        const EXAMPLE_PATH = "example/path";
        this.model["modelIOS"] = EXAMPLE_PATH;

        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(EXAMPLE_PATH, upgradedModel["modelIOS"]);
    },
});
