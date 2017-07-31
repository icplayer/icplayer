UpgradeModelTests = TestCase("[Audio] Upgrade Model Audio");

UpgradeModelTests.prototype.setUp = function() {
    this.presenter = AddonAudio_create();

    this.model = {
        "mp3" : "",
        "ogg" : "",
        "defaultControls" : "",
        "displayTime" : ""
    };

    this.modelWithLoop = {
        "mp3" : "",
        "ogg" : "",
        "defaultControls" : "",
        "displayTime" : "",
        "enableLoop" : ""
    };
};

UpgradeModelTests.prototype.testUpgradeEnableLoop = function() {
    var upgradedModel = this.presenter.upgradeEnableLoop(this.model);

    assertEquals(this.modelWithLoop, upgradedModel);
    assertNotEquals(this.model, upgradedModel); // Ensure that changes were made on copy
};
