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
    }
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
        const upgradedModel = this.presenter.upgradeModelWithModelIOS(this.model);

        assertTrue(upgradedModel.hasOwnProperty('modelIOS'));
        assertEquals("", upgradedModel['modelIOS']);
    },

    'test given model with modelIOS property when upgradeModelWithModelIOS called then keep existing value': function () {
        this.model['modelIOS'] = "path/to/model.usdz";

        const upgradedModel = this.presenter.upgradeModelWithModelIOS(this.model);

        assertEquals("path/to/model.usdz", upgradedModel['modelIOS']);
    },

    'test given model when upgradeModelWithModelIOS called then preserve existing properties': function () {
        const upgradedModel = this.presenter.upgradeModelWithModelIOS(this.model);

        assertEquals("ID", upgradedModel["ID"]);
        assertEquals("existingValue", upgradedModel["existingProperty"]);
    },

    'test given model when upgradeModelWithModelIOS called then return new object without modifying original': function () {
        const upgradedModel = this.presenter.upgradeModelWithModelIOS(this.model);

        assertFalse(this.model.hasOwnProperty('modelIOS'));
        assertTrue(upgradedModel.hasOwnProperty('modelIOS'));
    },

    'test given model with empty string modelIOS when upgradeModelWithModelIOS called then keep empty string': function () {
        this.model['modelIOS'] = "";

        const upgradedModel = this.presenter.upgradeModelWithModelIOS(this.model);

        assertEquals("", upgradedModel['modelIOS']);
    }
});

TestCase("[ModelViewer3D] upgradeModelWithLangAttribute tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.model = {
            "ID": "ID",
            "existingProperty": "existingValue"
        };
    },

    "test given model without set langAttribute when upgradeModel is called then langAttribute is added with default value": function () {
        const upgradedModel = this.presenter.upgradeModelWithLangAttribute(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("", upgradedModel["langAttribute"]);
    },

    "test given model with set langAttribute when upgradeModel is called then langAttribute value remains unchanged": function () {
        this.model["langAttribute"] = "PL-pl";

        const upgradedModel = this.presenter.upgradeModelWithLangAttribute(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("PL-pl", upgradedModel["langAttribute"]);
    },

    'test given model when upgradeModelWithLangAttribute called then preserve existing properties': function () {
        const upgradedModel = this.presenter.upgradeModelWithLangAttribute(this.model);

        assertEquals("ID", upgradedModel["ID"]);
        assertEquals("existingValue", upgradedModel["existingProperty"]);
    },

    'test given model when upgradeModelWithLangAttribute called then return new object without modifying original': function () {
        const upgradedModel = this.presenter.upgradeModelWithLangAttribute(this.model);

        assertFalse(this.model.hasOwnProperty('langAttribute'));
        assertTrue(upgradedModel.hasOwnProperty('langAttribute'));
    },

    'test given model with empty string modelIOS when upgradeModelWithLangAttribute called then keep empty string': function () {
        this.model['langAttribute'] = "";

        const upgradedModel = this.presenter.upgradeModelWithLangAttribute(this.model);

        assertEquals("", upgradedModel['langAttribute']);
    }
});
