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

TestCase("[ModelViewer3D] upgradeModelWithModelIOS tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.model = {
            "ID": "ID",
            "existingProperty": "existingValue"
        };
    },

    'test given model without modelIOS property when upgradeModelWithModelIOS called then add modelIOS with empty string': function () {
        var upgradedModel = this.presenter.upgradeModelWithModelIOS(this.model);

        assertTrue(upgradedModel.hasOwnProperty('modelIOS'));
        assertEquals("", upgradedModel['modelIOS']);
    },

    'test given model with modelIOS property when upgradeModelWithModelIOS called then keep existing value': function () {
        this.model['modelIOS'] = "path/to/model.usdz";

        var upgradedModel = this.presenter.upgradeModelWithModelIOS(this.model);

        assertEquals("path/to/model.usdz", upgradedModel['modelIOS']);
    },

    'test given model when upgradeModelWithModelIOS called then preserve existing properties': function () {
        var upgradedModel = this.presenter.upgradeModelWithModelIOS(this.model);

        assertEquals("ID", upgradedModel["ID"]);
        assertEquals("existingValue", upgradedModel["existingProperty"]);
    },

    'test given model when upgradeModelWithModelIOS called then return new object without modifying original': function () {
        var upgradedModel = this.presenter.upgradeModelWithModelIOS(this.model);

        assertFalse(this.model.hasOwnProperty('modelIOS'));
        assertTrue(upgradedModel.hasOwnProperty('modelIOS'));
    },

    'test given model with empty string modelIOS when upgradeModelWithModelIOS called then keep empty string': function () {
        this.model['modelIOS'] = "";

        var upgradedModel = this.presenter.upgradeModelWithModelIOS(this.model);

        assertEquals("", upgradedModel['modelIOS']);
    }
});
