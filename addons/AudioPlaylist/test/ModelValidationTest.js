TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonAudioPlaylist_create();
        this.model = {
            "Is Visible": "True",
            "ID": "Audio Playlist 1",
            "Items": [
                {
                    "Mp3": "/file/mock/mp3",
                    "Name": "1",
                    "Ogg": ""
                }
            ],
            "Stop playing": "False",
            "Enable audio speed controller": "False",
            "langAttribute": ""
        };
    },

    'test given model when validation was called then return validated model': function () {
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.value.enableAudioSpeedController);
        assertEquals(validatedModel.value.ID, 'Audio Playlist 1');
        assertTrue(validatedModel.value.isVisible);
        assertFalse(validatedModel.value.stopPlaying);
    },

    'test given model with language attribute when validation was called then return validated model': function () {
        this.model["langAttribute"] = "en";

        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.value.hasOwnProperty('langAttribute'));
        assertEquals(validatedModel.value.langAttribute, 'en');
    }
});

TestCase("Upgrade model", {
    setUp: function () {
        this.presenter = AddonAudioPlaylist_create();
        this.model = {
            "Is Visible": "True",
            "ID": "Audio Playlist 1",
            "Items": [
                {
                    "Mp3": "/file/mock/mp3",
                    "Name": "1",
                    "Ogg": ""
                }
            ],
            "Stop playing": "False",
        };
    },

    'test given model without audio speed controller property when upgrade was called then return model with the property on False': function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(upgradedModel["Enable audio speed controller"], "False");
    },

    'test given model with audio speed controller property when upgrade was called then return model with the unchanged property': function () {
        this.model["Enable audio speed controller"] = "True";

        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(upgradedModel["Enable audio speed controller"], "True");
    },

    'test given model without language attribute property when upgrade was called then return model with the empty property': function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertTrue(upgradedModel.hasOwnProperty('langAttribute'));
        assertEquals(upgradedModel["langAttribute"], "");
    },

    'test given model with language attribute property when upgrade was called then return model with the the unchanged property': function () {
        this.model['langAttribute'] = 'en';

        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(upgradedModel["langAttribute"], "en");
    },

    'test given model without speech text property when upgrade was called then return model with the empty property': function () {
        var defaultSpeechTexts = {
            "play":{"play":""},
            "pause":{"pause":""},
            "prev":{"prev":""},
            "next":{"next":""},
            "audioSpeedController":{"audioSpeedController":""},
            "volume":{"volume":""},
            "timer":{"timer":""},
            "audioItem":{"audioItem":""},
        }

        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertTrue(upgradedModel.hasOwnProperty('speechTexts'));
        assertEquals(upgradedModel["speechTexts"], defaultSpeechTexts);
    },

    'test given model with language speech text property when upgrade was called then return model with the the unchanged property': function () {
        var speechTexts = {
            "play":{"play":"Graj"},
            "pause":{"pause":"Stop"},
            "prev":{"prev":"Poprzedni"},
            "next":{"next":"Nastepny"},
            "audioSpeedController":{"audioSpeedController":"Szybkosc odtwarzania"},
            "volume":{"volume":"Glosnosc"},
            "timer":{"timer":"Czas"},
            "audioItem":{"audioItem":"Utwor"},
        }
        this.model['speechTexts'] = speechTexts;

        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(upgradedModel["speechTexts"], speechTexts);
    }
});
