TestCase("[Video] Play Stop and Pause Commands Tests", {
    setUp: function() {
        this.presenter = Addonvideo_create();
        this.presenter.videoObject = document.createElement('video');

        this.presenter.isVideoLoaded = true;
        this.presenter.posterPlayButton = $(document.createElement("div"));

        sinon.stub(this.presenter, 'seek');
        sinon.stub(this.presenter, 'removeWaterMark');

        sinon.stub(this.presenter, 'removeClassFromView');
        sinon.stub(this.presenter, 'addClassToView');
    },

    tearDown: function () {
        this.presenter.removeClassFromView.restore();
        this.presenter.addClassToView.restore();
    },

    'test play when video is paused': function() {
        assertTrue('Make sure that video is in pause state', this.presenter.videoObject.paused);

        this.presenter.play();

        assertFalse('Play command should change video state to playing', this.presenter.videoObject.paused);
    },

    'test play when video is playing': function() {
        this.presenter.videoObject.play();
        assertFalse('Make sure that video is playing', this.presenter.videoObject.paused);

        sinon.stub(this.presenter.videoObject, 'play');

        this.presenter.play();

        assertFalse('Make sure that play method was NOT executed', this.presenter.videoObject.play.called);
    },

    'test stop when video is playing': function() {
        this.presenter.videoObject.play();
        assertFalse('Make sure that video is playing', this.presenter.videoObject.paused);

        this.presenter.stop();

        assertTrue('Stop command should change video state to paused', this.presenter.videoObject.paused);
        assertTrue('Seek command should be executed with parameter 0', this.presenter.seek.calledWith(0));
    },

    'test stop when video is paused': function() {
        assertTrue('Make sure that video is paused', this.presenter.videoObject.paused);
        sinon.stub(this.presenter.videoObject, 'pause');

        this.presenter.stop();

        assertTrue('Stop method should be executed', this.presenter.videoObject.pause.called);
        assertTrue('Seek command should be executed', this.presenter.seek.called);
    },

    'test pause when video is playing': function() {
        this.presenter.videoObject.play();

        assertFalse('Make sure that video is playing', this.presenter.videoObject.paused);
        sinon.stub(this.presenter.videoObject, 'pause');

        this.presenter.pause();

        assertTrue('Pause method should be executed', this.presenter.videoObject.pause.calledOnce);
    },

    'test pause when video is paused': function() {
        assertTrue('Make sure that video is paused', this.presenter.videoObject.paused);
        sinon.stub(this.presenter.videoObject, 'pause');

        this.presenter.pause();

        assertFalse('Pause method should NOT be executed', this.presenter.videoObject.pause.called);
    },

    'test play called before video is loaded': function () {
        this.presenter.isVideoLoaded = false;

        this.presenter.play();
        this.presenter.callTasksFromDeferredQueue();

        assertTrue(this.presenter.removeWaterMark.calledOnce);
    },

    'test pause called before video is loaded': function () {
        this.presenter.isVideoLoaded = false;

        this.presenter.videoObject = {
            pause: sinon.mock(),
            paused: false
        };

        this.presenter.pause();

        assertTrue(this.presenter.removeClassFromView.notCalled);

        this.presenter.callTasksFromDeferredQueue();

        assertTrue(this.presenter.removeClassFromView.calledOnce);
    },

    'test stop called before video is loaded': function () {
        this.presenter.isVideoLoaded = false;
        this.presenter.videoObject = {
            pause: sinon.mock(),
            paused: false
        };

        this.presenter.stop();

        assertTrue(this.presenter.removeClassFromView.notCalled);

        this.presenter.callTasksFromDeferredQueue();

        assertTrue(this.presenter.removeClassFromView.calledOnce);
    },

    'test seek called before video is loaded': function () {
        this.presenter.isVideoLoaded = false;
        this.presenter.seek.restore();

        this.presenter.videoObject = {
            pause: sinon.mock(),
            paused: false,
            currentTime: 0
        };

        this.presenter.seek(10);
        this.presenter.callTasksFromDeferredQueue();

        assertEquals(10, this.presenter.videoObject.currentTime);
    }
});