TestCase("[Connection] Upgrade tasks tests", {
    setUp: function () {
        this.presenter = AddonConnection_create();

        this.model = {
            "Left column": [{
                id: "",
                content: "",
                "connects to": "",
                "additional class": ""
            }],
            "Right column": [{
                id: "",
                content: "",
                "connects to": "",
                "additional class": ""
            }],
            "Default connection color": "",
            "Correct connection color": "",
            "Incorrect connection color": "",
            "Connection thickness, string": ""
        };

        this.currentModel = {
            "Left column": [{
                id: "",
                content: "",
                "connects to": "",
                "additional class": ""
            }],
            "Right column": [{
                id: "",
                content: "",
                "connects to": "",
                "additional class": ""
            }],
            "Columns width": [{
                left: "",
                middle: "",
                right: ""
            }],
            "Default connection color": "",
            "Correct connection color": "",
            "Incorrect connection color": "",
            "Connection thickness, string": "",
            "disabledConnectionColor": "",
            "initialConnections": []
        };
    },

    'test given simple model when upgradeFromV_01 is called then will return upgraded model': function () {
        var expectedColumnsWidth = [{
            left: "",
            middle: "",
            right: ""
        }];

        var upgradedModel = this.presenter.upgradeFrom_01(this.model);

        assertEquals(expectedColumnsWidth, upgradedModel["Columns width"]);
        assertNotEquals(this.model, upgradedModel); // Ensure that changes were made on copy
    },

    'test given simple model when upgradeModel is called then will return newest version of model': function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(this.currentModel, upgradedModel);
        assertNotEquals(this.model, upgradedModel);
    },

    'test given empty model when upgrade start values is called then returns upgraded model': function () {
        var emptyModel = {};
        var expectedModel = {
            "disabledConnectionColor": "",
            "initialConnections": []
        };
        var upgradedModel = this.presenter.upgradeStartValues(emptyModel);

        assertNotEquals(emptyModel, upgradedModel);
        assertEquals(expectedModel, upgradedModel);
    },

    'test given model with filled disabled fields when upgrade model is called then will return the same object': function () {
        var modelToUpgrade = {
            "disabledConnectionColor": "abc",
            "initialConnections": ["a", "b", "C"]
        };

        var upgradedModel = this.presenter.upgradeStartValues(modelToUpgrade);

        assertEquals(modelToUpgrade, upgradedModel);
    }
});