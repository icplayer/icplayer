TestCase("[Video] Play Stop and Pause Commands Tests", {
    setUp: function() {
        this.presenter = Addonvideo_create();
        this.presenter.video = document.createElement('video');

        this.presenter.isVideoLoaded = true;
        this.presenter.commandsQueue = {
            addTask: function () {}
        };

        sinon.stub(this.presenter, 'seek');
        sinon.stub(this.presenter.commandsQueue, 'addTask');
        sinon.stub(this.presenter, 'removeWaterMark')
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
    },

    'test play called before video is loaded': function () {
        this.presenter.isVideoLoaded = false;

        this.presenter.play();

        assertTrue(this.presenter.commandsQueue.addTask.calledWith('play', []));
    },

    'test pause called before video is loaded': function () {
        this.presenter.isVideoLoaded = false;

        this.presenter.pause();

        assertTrue(this.presenter.commandsQueue.addTask.calledWith('pause', []));
    },

    'test stop called before video is loaded': function () {
        this.presenter.isVideoLoaded = false;

        this.presenter.stop();

        assertTrue(this.presenter.commandsQueue.addTask.calledWith('stop', []));
    },

    'test seek called before video is loaded': function () {
        this.presenter.isVideoLoaded = false;
        this.presenter.seek.restore();

        this.presenter.seek(10);

        assertTrue(this.presenter.commandsQueue.addTask.calledWith('seek', [10]));
    }
});