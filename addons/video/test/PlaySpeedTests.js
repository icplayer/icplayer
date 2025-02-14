TestCase('[Video] Playback Speed', {
    setUp: function() {
        this.presenter = Addonvideo_create();
        this.presenter.videoObject = {
            playbackRate: 1.0
        };
    },

    'test given default speed when speed is increased then set correct value': function() {

        this.presenter.changePlayingSpeed(1);

        assertEquals(1.25, this.presenter.videoObject.playbackRate);
    },

    'test given default speed when speed is decreased then set correct value': function() {

        this.presenter.changePlayingSpeed(-1);

        assertEquals(0.75, this.presenter.videoObject.playbackRate);
    },

    'test given max speed when speed is increased then do not increase value': function() {
        this.presenter.videoObject.playbackRate = 2.0;

        this.presenter.changePlayingSpeed(1);

        assertEquals(2.0, this.presenter.videoObject.playbackRate);
    },

    'test given max speed when speed is decreased then do not decrease value': function() {
        this.presenter.videoObject.playbackRate = 0.25;

        this.presenter.changePlayingSpeed(-1);

        assertEquals(0.25, this.presenter.videoObject.playbackRate);
    }
});