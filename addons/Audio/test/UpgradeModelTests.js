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

UpgradeModelTests.prototype.testUpgradeForceLoadAudioShouldSetForceLoadAudioToFalse = function () {
    var upgradedModel = this.presenter.upgradeForceLoadAudio(this.model);
    assertEquals("False", upgradedModel["forceLoadAudio"]);
};

UpgradeModelTests.prototype.testUpgradeModelShouldCallAllUpgradeModelFunctions = function () {
    var upgradeEnableLoopFunction = sinon.mock();
    var upgradeForceLoadAudioFunction = sinon.mock();

    upgradeEnableLoopFunction.returns("A");
    upgradeForceLoadAudioFunction.returns("B");


    this.presenter.upgradeForceLoadAudio = upgradeForceLoadAudioFunction;
    this.presenter.upgradeEnableLoop = upgradeEnableLoopFunction;

    var result = this.presenter.upgradeModel(this.model);

    assertEquals("B", result[0]);

    assertTrue(upgradeEnableLoopFunction.calledOnce);
    assertTrue(upgradeForceLoadAudioFunction.calledOnce);

    assertTrue(upgradeEnableLoopFunction.calledWith(this.model));
    assertTrue(upgradeForceLoadAudioFunction.calledWith("A"));

};