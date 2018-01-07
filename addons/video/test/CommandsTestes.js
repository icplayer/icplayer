TestCase("[Video] Commands", {
    setUp: function () {
        this.presenter = Addonvideo_create();

        this.presenter.configuration.files[0] = {

        };

        this.presenter.jumpTo = sinon.spy();
    },

    'test if setVideoURL will set properly values': function () {
        var data = {
            oggFormat: "ogg7",
            mp4Format: "mp46",
            webMFormat: "webm5",
            poster: "post4",
            subtitles: "sub3",
            id: "id2",
            altText: "alt1",
            loop: true
        }, expected = {
            "Ogg video": "ogg7",
            "MP4 video": "mp46",
            "WebM video": "webm5",
            "Poster": "post4",
            "Subtitles": "sub3",
            "ID": "id2",
            "AlternativeText": "alt1",
            "Loop video": true
        };

        this.presenter.setVideoURL(data);

        assertEquals(expected, this.presenter.configuration.files[0]);
        assertEquals(1, this.presenter.configuration.files.length);
        assertTrue(this.presenter.jumpTo.calledOnce);
    },

    'test if setVideoURL will set default properties': function () {
        var expected = {AlternativeText: undefined,
            ID: undefined,
            "Loop video": undefined,
            "MP4 video": undefined,
            "Ogg video": "format",
            Poster: undefined,
            Subtitles: undefined,
            "WebM video": undefined
        };

        this.presenter.setVideoURL({oggFormat: "format"});

        assertEquals(expected, this.presenter.configuration.files[0]);
        assertEquals(1, this.presenter.configuration.files.length);
        assertTrue(this.presenter.jumpTo.calledOnce);
    }
});