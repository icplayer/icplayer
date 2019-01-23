UpgradeModelTests = TestCase("[Connection] Upgrade tasks tests");

UpgradeModelTests.prototype.setUp = function() {
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
};

UpgradeModelTests.prototype.testFromV_01 = function() {
    var expectedColumnsWidth = [{
        left: "",
        middle: "",
        right: ""
    }];

    var upgradedModel = this.presenter.upgradeFrom_01(this.model);

    assertEquals(expectedColumnsWidth, upgradedModel["Columns width"]);
    assertNotEquals(this.model, upgradedModel); // Ensure that changes were made on copy
};

UpgradeModelTests.prototype.testUpgradeToCurrentVersion = function() {
    var upgradedModel = this.presenter.upgradeModel(this.model);

    assertEquals(this.currentModel, upgradedModel);
    assertNotEquals(this.model, upgradedModel);
};

UpgradeModelTests.prototype.testGivenEmptyModelWhenUpgradeStartValuesIsCalledThenReturnsUpgradedModel = function () {
    var emptyModel = {};
    var expectedModel = {
        "disabledConnectionColor": "",
        "initialConnections": []
    };
    var upgradedModel = this.presenter.upgradeStartValues(emptyModel);

    assertNotEquals(emptyModel, upgradedModel);
    assertEquals(expectedModel, upgradedModel);
};

UpgradeModelTests.prototype.testGivenModelWithFilledDisabledFieldsWhenUpgradeModelIsCalledThenWillReturnTheSameObject = function () {
    var modelToUpgrade = {
        "disabledConnectionColor": "abc",
        "initialConnections": ["a", "b", "C"]
    };

    var upgradedModel = this.presenter.upgradeStartValues(modelToUpgrade);

    assertEquals(modelToUpgrade, upgradedModel);
};