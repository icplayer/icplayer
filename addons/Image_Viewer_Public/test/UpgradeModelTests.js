UpgradeModelTests = TestCase("Upgrade Model Tests");

UpgradeModelTests.prototype.setUp = function() {
    this.presenter = AddonImage_Viewer_Public_create();
    this.model = {
        "test" : "test"
    };
};

UpgradeModelTests.prototype.testUpgradeFrom_01 = function() {
    // Given
    var expectedModel = {
        "test" : "test",
        'Do not reset' : false
    };

    // When
    var upgradedModel = this.presenter.upgradeFrom_01(this.model);

    // Then
    assertEquals("", expectedModel, upgradedModel);
};

UpgradeModelTests.prototype.testUpgradeFrom_02 = function() {
    // Given
    var expectedModel = {
        "test" : "test",
        'Random frame' : false,
        'Initial frame' : ""
    };

    // When
    var upgradedModel = this.presenter.upgradeFrom_02(this.model);

    // Then
    assertEquals("", expectedModel, upgradedModel);
};

UpgradeModelTests.prototype.testUpgradeModel = function() {
    // Given
    var expectedModel = {
        "test" : "test",
        'Do not reset' : false,
        'Random frame' : false,
        'Initial frame' : "",
        "langAttribute": "",
        "Alternative texts": [{
            "Alternative text": "",
            "frame": ""
        }],
        "Base width": "",
        "Base height": ""

    };

    // When
    var upgradedModel = this.presenter.upgradeModel(this.model);

    // Then
    assertEquals("", expectedModel, upgradedModel);
};