TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonAudioPlaylist_create();
    },

    'test given model when validation was called then return validated model': function () {
        var model = {
            "Is Visible": "True",
            ID: "Audio Playlist 1",
            Items: [
                {
                    Mp3: "/file/mock/mp3",
                    Name: "1",
                    Ogg: ""
                }
            ],
            "Stop playing": "False",
            "Enable audio speed controller": "False"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.value.enableAudioSpeedController);
        assertEquals(validatedModel.value.ID, 'Audio Playlist 1');
        assertTrue(validatedModel.value.isVisible);
        assertFalse(validatedModel.value.stopPlaying);
    }
});

TestCase("Upgrade model", {
    setUp: function () {
        this.presenter = AddonAudioPlaylist_create();
    },

    'test given model without audio speed controller property when upgrade was called then return model with the property on False': function () {
        var model = {
            "Is Visible": "True",
            ID: "Audio Playlist 1",
            Items: [
                {
                    Mp3: "/file/mock/mp3",
                    Name: "1",
                    Ogg: ""
                }
            ],
            "Stop playing": "False"
        };

        var upgradedModel = this.presenter.upgradeModel(model);

        assertEquals(upgradedModel["Enable audio speed controller"], "False");
    },

    'test given model with audio speed controller property when upgrade was called then return model with the unchanged property': function () {
        var model = {
            "Is Visible": "True",
            ID: "Audio Playlist 1",
            Items: [
                {
                    Mp3: "/file/mock/mp3",
                    Name: "1",
                    Ogg: ""
                }
            ],
            "Stop playing": "False",
            "Enable audio speed controller": "True"
        };

        var upgradedModel = this.presenter.upgradeModel(model);

        assertEquals(upgradedModel["Enable audio speed controller"], "True");
    }
});
