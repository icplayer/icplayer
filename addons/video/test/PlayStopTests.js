TestCase("Play Stop and Pause Commands Tests", {
    setUp: function() {
        this.presenter = Addonvideo_create();
        this.presenter.video = document.createElement('video');
        sinon.stub(this.presenter, 'seek');
    },

    'test play when video is paused': function() {
        assertTrue('Make sure that video is in pause state', this.presenter.video.paused);

        this.presenter.play();

        assertFalse('Play command should change video state to playing', this.presenter.video.paused);
    },

    'test play when video is playing': function() {
        this.presenter.video.play();
        assertFalse('Make sure that video is playing', this.presenter.video.paused);

        sinon.stub(this.presenter.video, 'play');

        this.presenter.play();

        assertFalse('Make sure that play method was NOT executed', this.presenter.video.play.called);
    },

    'test stop when video is playing': function() {
        this.presenter.video.play();
        assertFalse('Make sure that video is playing', this.presenter.video.paused);

        this.presenter.stop();

        assertTrue('Stop command should change video state to paused', this.presenter.video.paused);
        assertTrue('Seek command should be executed with parameter 0', this.presenter.seek.calledWith(0));
    },

    'test stop when video is paused': function() {
        assertTrue('Make sure that video is paused', this.presenter.video.paused);
        sinon.stub(this.presenter.video, 'pause');

        this.presenter.stop();

        assertFalse('Stop method should NOT be executed', this.presenter.video.pause.called);
        assertFalse('Seek command should NOT be executed', this.presenter.seek.called);
    },

    'test pause when video is playing': function() {
        this.presenter.video.play();

        assertFalse('Make sure that video is playing', this.presenter.video.paused);
        sinon.stub(this.presenter.video, 'pause');

        this.presenter.pause();

        assertTrue('Pause method should be executed', this.presenter.video.pause.calledOnce);
    },

    'test pause when video is paused': function() {
        assertTrue('Make sure that video is paused', this.presenter.video.paused);
        sinon.stub(this.presenter.video, 'pause');

        this.presenter.pause();

        assertFalse('Pause method should NOT be executed', this.presenter.video.pause.called);
    }
});