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
                                "01:00:00 End :P"
            }, {
                Poster: "ok",
                Subtitles: "okdaokdoa",
                ID: "some id",
                "Loop video": "False",
                "WebM video": "some path",
                "MP4 video": "else path",
                "Ogg video": "that should be something different",
                "AlternativeText": "B",
                "time_labels":  "00:00:00 Start2\n" +
                                "00:00:20"
            }]
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
                    {isValid: true, title: "End :P", time: 3600}
                ]
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
                    {isValid: true, title: "Start2", time:0},
                    {isValid: true, title: "2. 00:00:20", time: 20}
                ]
            }],
            height: 22
        };

        var result = this.presenter.validateModel(this.model);

        assertEquals(expected, result);
    }
});
