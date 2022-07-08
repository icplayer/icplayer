TestCase('[TextAudio] Upgrade model for click action', {
    setUp: function () {
        this.presenter = AddonTextAudio_create();
    },

    'test both playPart and playSeparateFiles option are deselected but present': function () {
        var model = {
            playPart: 'False',
            playSeparateFiles: 'False'
        };

        var upgradedModel = this.presenter.upgradeClickAction(model);

        assertEquals(this.presenter.ALLOWED_CLICK_BEHAVIOUR.play_from_the_moment, upgradedModel.clickAction);
    },

    'test only playPart option is selected': function () {
        var model = {
            playPart: 'True',
            playSeparateFiles: 'False'
        };

        var upgradedModel = this.presenter.upgradeClickAction(model);

        assertEquals(this.presenter.ALLOWED_CLICK_BEHAVIOUR.play_interval, upgradedModel.clickAction);
    },

    'test only playSeparateFiles option is selected': function () {
        var model = {
            playPart: 'False',
            playSeparateFiles: 'True'
        };

        var upgradedModel = this.presenter.upgradeClickAction(model);

        assertEquals(this.presenter.ALLOWED_CLICK_BEHAVIOUR.play_vocabulary_file, upgradedModel.clickAction);
    },

    'test both playPart and playSeparateFiles option are selected': function () {
        var model = {
            playPart: 'True',
            playSeparateFiles: 'True'
        };

        var upgradedModel = this.presenter.upgradeClickAction(model);

        assertEquals(this.presenter.ALLOWED_CLICK_BEHAVIOUR.play_interval_or_vocabulary, upgradedModel.clickAction);
    },

    'test both playPart and playSeparateFiles are not present in model but separateFiles list is': function () {
        var model = {
            separateFiles: []
        };

        var upgradedModel = this.presenter.upgradeClickAction(model);

        assertEquals(this.presenter.ALLOWED_CLICK_BEHAVIOUR.play_from_the_moment, upgradedModel.clickAction);
    }
});

TestCase('[TextAudio] Upgrade model for audio controls', {
    setUp: function () {
        this.presenter = AddonTextAudio_create();
    },
    
    'test both defaultControls and Controls properties are undefined': function () {
        var model = {};

        var upgradedModel = this.presenter.upgradeControls(model);

        assertEquals("None", upgradedModel.controls);
    },

    'test property controls is undefined in model and default controls is deselected': function () {
        var model = {
            defaultControls: 'False'
        };

        var upgradedModel = this.presenter.upgradeControls(model);

        assertEquals("None", upgradedModel.controls);
    },

    'test property controls is undefined in model and default controls is selected': function () {
        var model = {
            defaultControls: 'True'
        };

        var upgradedModel = this.presenter.upgradeControls(model);

        assertEquals("Browser", upgradedModel.controls);
    },

    'test property controls is Custom but defaultControls is deselected': function () {
        var model = {
            defaultControls: 'False',
            controls: "Custom"
        };

        var upgradedModel = this.presenter.upgradeControls(model);

        assertEquals("Custom", upgradedModel.controls);
    },

    'test property controls is None but defaultControls is selected': function () {
        var model = {
            defaultControls: 'True',
            controls: "None"
        };

        var upgradedModel = this.presenter.upgradeControls(model);

        assertEquals("None", upgradedModel.controls);
    }
});

TestCase('[TextAudio] Upgrade model for is Disabled', {
    setUp: function () {
        this.presenter = AddonTextAudio_create();
    },

    'test given model without is Disabled when upgradeModel is called then will return model with default value': function () {
        var model = {
        };

        var upgradedModel = this.presenter.upgradeModel(model);

        assertEquals('False', upgradedModel['isDisabled']);
    },

    'test given model with is Disabled as true when upgradeModel is called then will return is Disabled with true value': function () {
        var model = {
            'isDisabled': 'False'
        };

        var upgradedModel = this.presenter.upgradeModel(model);

        assertEquals('False', upgradedModel['isDisabled']);
    },

    'test given model with is Disabled as false when upgradeModel is called then will return is Disabled with false value': function () {
        var model = {
            'isDisabled': 'True'
        };

        var upgradedModel = this.presenter.upgradeModel(model);

        assertEquals('True', upgradedModel['isDisabled']);
    }
});

TestCase("[TextAudio] Upgrade model for Lang attribute", {

    setUp: function () {
        this.presenter = AddonTextAudio_create();

        this.model = {
          "ID": "TextAudio1",
        }
    },

    "test given model without set langAttribute when upgradeModel is called then langAttribute is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals('', upgradedModel["langAttribute"]);
    },

    "test given model with set langAttribute when upgradeModel is called then langAttribute value remains unchanged": function () {
        this.model["langAttribute"] = "pl-PL";

        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("pl-PL", upgradedModel["langAttribute"]);
    },
});

TestCase("[TextAudio] Upgrade model for speech texts", {

    setUp: function () {
        this.presenter = AddonTextAudio_create();
    },

    "test given model without set speech texts when upgrading model using empty object then set empty values to speech texts": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        const expectedSpeechTexts = {
            Play: {Play: ""},
            Pause: {Pause: ""},
            Stop: {Stop: ""},
            AudioSpeedController: {AudioSpeedController: ""},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },

    "test given model without set speech texts when upgrading model using object with defined speech texts then speech texts have values form given model": function () {
        var inputModel = {
            speechTexts: {
                Play: {Play: "Play button"},
                Pause: {Pause: "Pause button"},
                Stop: {Stop: "Stop button"},
            }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        const expectedSpeechTexts = {
            Play: {Play: "Play button"},
            Pause: {Pause: "Pause button"},
            Stop: {Stop: "Stop button"},
            AudioSpeedController: {AudioSpeedController: ""},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },

    "test given model without set speech texts when upgrading model with full defined speech texts then all speech texts have values from given model": function () {
        var inputModel = {
            speechTexts: {
                Play: {Play: "Play button"},
                Pause: {Pause: "Pause button"},
                Stop: {Stop: "Stop button"},
                AudioSpeedController: {AudioSpeedController: "Audio speed controller"},
            }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, inputModel.speechTexts);
    },
});
