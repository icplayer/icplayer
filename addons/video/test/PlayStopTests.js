TestCase("[Video] Play Stop and Pause Commands Tests", {
    setUp: function() {
        this.presenter = Addonvideo_create();
        this.presenter.videoObject = document.createElement('video');
        this.presenter.videoObject['paused'] = true;
        this.presenter.videoObject.src = "https://www.mauthor.com/file/serve/4963160974426112\n";

        this.presenter.isVideoLoaded = true;
        this.presenter.posterPlayButton = $(document.createElement("div"));
        this.presenter.$view = $(document.createElement("div"));

        sinon.stub(this.presenter, 'seek');
        sinon.stub(this.presenter, 'removeWaterMark');
    },

    tearDown: function () {
        this.presenter.videoObject.src = '';
    },

    'test play when video is paused': function () {
        this.presenter.usedStop = true;
        this.presenter.playTriggered = false;
        assertFalse('The video has not "playing" class.', this.presenter.$view[0].classList.contains('playing'));
        var playSpy = sinon.spy(this.presenter.videoObject, 'play');

        this.presenter.play();

        assertTrue('The playing video has "playing" class.', this.presenter.$view[0].classList.contains('playing'));
        assertTrue(playSpy.called);
        assertFalse(this.presenter.usedStop);
        assertTrue(this.presenter.playTriggered);
    },

    'test do not play when video is playing': function() {
        var playSpy = sinon.spy(this.presenter.videoObject, 'play');
        this.presenter.videoObject = {
            play: sinon.mock(),
            paused: false
        };

        this.presenter.play();

        assertFalse('Make sure that play method was NOT executed', playSpy.called);
    },

    'test stop when video is playing': function() {
        this.presenter.play();
        assertTrue('The  video is playing.', this.presenter.$view[0].classList.contains('playing'));
        var showPlayButtonSpy = sinon.spy(this.presenter, 'showPlayButton');
        var pauseSpy = sinon.spy(this.presenter.videoObject, 'pause');

        this.presenter.stop();

        assertTrue('The video has been stopped.', pauseSpy.called);
        assertTrue(showPlayButtonSpy.called);
        assertFalse('The video has not "playing" class.', this.presenter.$view[0].classList.contains('playing'));
    },

    'test stop when video is paused': function() {
        assertTrue('Make sure that video is paused', this.presenter.videoObject.paused);
        sinon.stub(this.presenter.videoObject, 'pause');

        this.presenter.stop();

        assertTrue('Stop method should be executed', this.presenter.videoObject.pause.called);
        assertTrue('Seek command should be executed', this.presenter.seek.called);
    },

    'test pause when video is playing': function() {
        this.presenter.play();
        assertTrue('The video is playing.', this.presenter.$view[0].classList.contains('playing'));
        sinon.stub(this.presenter.videoObject, 'pause');
        this.presenter.videoObject = {
            pause: sinon.mock(),
            paused: false
        };

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
        sinon.stub(this.presenter, 'removeClassFromView');

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
        sinon.stub(this.presenter, 'removeClassFromView');
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
