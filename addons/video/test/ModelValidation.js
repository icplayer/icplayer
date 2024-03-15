TestCase("[Video] Model validation", {
    setUp: function () {
        this.presenter = Addonvideo_create();

        this.model = {
            Width: "20",
            Height: "22",
            ID: "someAddon",
            "Is Visible": "True",
            "Is Tabindex Enabled": "True",
            "Hide subtitles": "False",
            'Hide default controls': "True",
            'Show play button': "True",
            'offlineMessage': 'offline',
            Files: [{
                Poster: "ok",
                Subtitles: "okdaokdoa",
                ID: "some id",
                "Loop video": "True",
                "WebM video": "some path",
                "MP4 video": "else path",
                "Ogg video": "and another path",
                "AlternativeText": "A",
                "time_labels":  "00:00:00 Start\n" +
                                "20 End :P",
                "Audio Description": "5|100|100|red|pl|test"
            }, {
                Poster: "ok",
                Subtitles: "okdaokdoa",
                ID: "some id",
                "Loop video": "False",
                "WebM video": "some path",
                "MP4 video": "else path",
                "Ogg video": "that should be something different",
                "AlternativeText": "B",
                "time_labels":  "02:01:01 Start2\n" +
                                "02:20",
                "Audio Description": "5|100|100|red|pl|test2"
            }],
            speechTexts: {
                AudioDescriptionEnabled: {AudioDescriptionEnabled: "Audio description enabled2"},
                AudioDescriptionDisabled: {AudioDescriptionDisabled: "Audio description disabled2"}
            },
            "Base width": "",
            "Base height": ""
        }
    },

    'test model return value should be the same as input value': function () {
        var expected = {
            isValid: true,
            addonSize: {
                width: 20,
                height: 22
            },
            addonID: "someAddon",
            isVisibleByDefault: true,
            isTabindexEnabled: true,
            shouldHideSubtitles: false,
            defaultControls: false,
            showPlayButton: true,
            offlineMessage: 'offline',
            files: [{
                Poster: "ok",
                Subtitles: "okdaokdoa",
                ID: "some id",
                "Loop video": true,
                "WebM video": "some path",
                "MP4 video": "else path",
                "Ogg video": "and another path",
                "AlternativeText": "A",
                "timeLabels": [
                    {isValid: true, title: "Start", time:0},
                    {isValid: true, title: "End :P", time: 20}
                ],
                Audiodescription: "5|100|100|red|pl|test"
            }, {
                Poster: "ok",
                Subtitles: "okdaokdoa",
                ID: "some id",
                "Loop video": false,
                "WebM video": "some path",
                "MP4 video": "else path",
                "Ogg video": "that should be something different",
                "AlternativeText": "B",
                "timeLabels": [
                    {isValid: true, title: "2. 02:20", time: 140},
                    {isValid: true, title: "Start2", time:7261}
                ],
                Audiodescription: "5|100|100|red|pl|test2"
            }],
            height: 22,
            enableVideoSpeedController: false,
            baseDimensions: {
                width: 0,
                height: 0
            }
        };

        var expectedSpeechTexts = {
            audioDescriptionEnabled: "Audio description enabled2",
            audioDescriptionDisabled: "Audio description disabled2"
        };
        var result = this.presenter.validateModel(this.model);

        assertEquals(expected, result);
        assertEquals(expectedSpeechTexts, this.presenter.speechTexts);
    }
});
