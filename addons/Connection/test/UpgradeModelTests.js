UpgradeModelTests = TestCase("Upgrade tasks tests");

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
        "enableTabindex": false
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

UpgradeModelTests.prototype.testUpgradeEnableTabindex = function() {
    var upgradedModel = this.presenter.upgradeModel(this.model);

    assertEquals(this.currentModel, upgradedModel);
    assertNotEquals(this.model, upgradedModel);
    assertFalse(upgradedModel["enableTabindex"]);
};

UpgradeModelTests.prototype.testUpgradeEnableTabindexShouldLeaveProperValue = function() {
    this.model["enableTabindex"] = true;
    var upgradedModel = this.presenter.upgradeModel(this.model);

    assertTrue(upgradedModel["enableTabindex"])
};