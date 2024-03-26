UpgradeModelTests = TestCase("[Video] Upgrade Model Video");

UpgradeModelTests.prototype.setUp = function() {
    this.presenter = Addonvideo_create();

    this.model = {
        "Files": [{
            "Ogg video": "",
            "MP4 video": "",
            "WebM video": "",
            "Subtitles": "",
            ID : ""
        }],
        "Show video": ""
    };

};

UpgradeModelTests.prototype.testUpgradePoster = function() {
    var expectedFilesAfterUpgradePoster = [{
        "Ogg video": "",
        "MP4 video": "",
        "WebM video": "",
        "Subtitles": "",
        "Poster": "",
        ID : ""
    }];

    var upgradedModel = this.presenter.upgradePoster(this.model);

    assertEquals(expectedFilesAfterUpgradePoster, upgradedModel["Files"]);
    assertNotEquals(this.model, upgradedModel); // Ensure that changes were made on copy
};


UpgradeModelTests.prototype.testUpgradeTimeLabels = function () {
    var expectedFilesAfterUpgradePoster = [{
        "Ogg video": "",
        "MP4 video": "",
        "WebM video": "",
        "Subtitles": "",
        ID : "",
        "time_labels": ""
    }];

    var upgradedModel = this.presenter.upgradeTimeLabels(this.model);
    assertEquals(expectedFilesAfterUpgradePoster, upgradedModel["Files"]);
    assertTrue(this.model != upgradedModel);  //Different object, this is copy
};

UpgradeModelTests.prototype.testUpgradeSpeechTexts = function () {
    var expectedModelAfterUpgrade = {
        "Files": [{
            "Ogg video": "",
            "MP4 video": "",
            "WebM video": "",
            "Subtitles": "",
            ID : "",
            "Audio Description": ""
        }],
        "Show video": "",
        "speechTexts": {
            AudioDescriptionEnabled: {AudioDescriptionEnabled: "Audio description enabled"},
            AudioDescriptionDisabled: {AudioDescriptionDisabled: "Audio description disabled"}
        }
    };

    var upgradedModel = this.presenter.upgradeSpeechTexts(this.model);
    assertEquals(expectedModelAfterUpgrade, upgradedModel);
    assertTrue(this.model != upgradedModel);  //Different object, this is copy
};

UpgradeModelTests.prototype.testUpgradeToCurrentVersion = function() {
    var expectedModel = {
        "Files": [{
            "Ogg video": "",
            "MP4 video": "",
            "WebM video": "",
            "Subtitles": "",
            "Poster": "",
            ID : "",
            "time_labels": "",
            "Audio Description": ""
        }],
        "Show video": "",
        'Show play button': 'False',
        "speechTexts": {
            AudioDescriptionEnabled: {AudioDescriptionEnabled: "Audio description enabled"},
            AudioDescriptionDisabled: {AudioDescriptionDisabled: "Audio description disabled"}
        },
        "offlineMessage":"This video is not available offline. Please connect to the Internet to watch it.",
        "enableVideoSpeedController":"False",
        "Base width": "",
        "Base height": ""
    };

    var upgradedModel = this.presenter.upgradeModel(this.model);

    assertEquals(expectedModel, upgradedModel);
    assertNotEquals(this.model, upgradedModel);
};

UpgradeModelTests.prototype.testUpgradeModelForShowPlayButtonShouldAddPropertyIfDoesNotExist = function () {
    var upgradedModel = this.presenter.upgradeModel(this.model);

    assertEquals('False', upgradedModel['Show play button']);
};


UpgradeModelTests.prototype.testUpgradeModelForShowPlayButtonShouldNotChangePropertyIsExists = function () {
    this.model['Show play button'] = 'lorem ipsum dolor sit amet';

    var upgradedModel = this.presenter.upgradeModel(this.model);

    assertEquals('lorem ipsum dolor sit amet', upgradedModel['Show play button']);
};

UpgradeModelTests.prototype.testGivenModelWithOfflineMessageWhenUpgradeIsCalledThenIsNotChangingIt = function () {
    var expected = 'different message';
    this.model['offlineMessage'] = expected;

    var upgradedModel = this.presenter.upgradeModel(this.model);

    assertEquals(expected, upgradedModel['offlineMessage']);
};

UpgradeModelTests.prototype.testAddPropertyEnableVideoSpeedController = function () {
    var result = this.presenter.upgradeModel(this.model);

    assertTrue(result.hasOwnProperty('enableVideoSpeedController'));
    assertEquals(result['enableVideoSpeedController'], 'False');
};

UpgradeModelTests.prototype.testDoNotChangePropertyEnableVideoSpeedController = function () {
    this.model['enableVideoSpeedController'] = 'True';

    var result = this.presenter.upgradeModel(this.model);

    assertEquals(result['enableVideoSpeedController'], 'True');
};