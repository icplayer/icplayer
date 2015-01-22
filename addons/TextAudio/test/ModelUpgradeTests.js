var ModelUpgradeTests = AsyncTestCase('ModelUpgradeTests');

ModelUpgradeTests.prototype.setUp = function() {
    this.presenter = AddonTextAudio_create();
};

ModelUpgradeTests.prototype.tearDown = function() {
};

ModelUpgradeTests.prototype.testOldPropertyPlayPart = function() {
    var model = {
        'mp3': '/some/file.mp3',
        'ogg': '/some/file.ogg',
        'playPart': "True"
    };
    var upgratedModel = this.presenter.upgradeModel(model);
    assertEquals(upgratedModel.clickAction, 'Play the interval');
};


ModelUpgradeTests.prototype.testOldPropertyPlayTheInterval = function() {

    var model = {
        'mp3': '/some/file.mp3',
        'ogg': '/some/file.ogg',
        'playPart': "True",
        'playSeparateFiles': "False"
    };

    var upgratedModel = this.presenter.upgradeModel(model);

    assertEquals(upgratedModel.clickAction, 'Play the interval');
};


ModelUpgradeTests.prototype.testOldPropertyPlaySeparateFiles = function() {

    var model = {
        'mp3': '/some/file.mp3',
        'ogg': '/some/file.ogg',
        'playPart': "True",
        'playSeparateFiles': "True"
    };

    var upgratedModel = this.presenter.upgradeModel(model);

    assertEquals(upgratedModel.clickAction, 'Play vocabulary audio file');

    // even if playPart is False:
    model.playPart = "False";
    upgratedModel = this.presenter.upgradeModel(model);

    assertEquals(upgratedModel.clickAction, 'Play vocabulary audio file');
};


ModelUpgradeTests.prototype.testOldPropertyPlayFromTheMoment = function() {

    var model = {
        'mp3': '/some/file.mp3',
        'ogg': '/some/file.ogg',
        'playPart': "False",
        'playSeparateFiles': "False"
    };

    var upgratedModel = this.presenter.upgradeModel(model);

    assertEquals(upgratedModel.clickAction, 'Play from the moment');

    // even if addon was opened in Editor and got new properties
    model.clickAction = 'Play the interval from vocabulary file';
    upgratedModel = this.presenter.upgradeModel(model);

    assertEquals(upgratedModel.clickAction, 'Play from the moment');
};