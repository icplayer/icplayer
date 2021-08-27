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

    'test given paused video when play was called then should start to play': function () {
        this.presenter.usedStop = true;
        this.presenter.playTriggered = false;
        var playSpy = sinon.spy(this.presenter.videoObject, 'play');

        this.presenter.play();

        assertTrue('The playing video has "playing" class.', this.presenter.$view[0].classList.contains('playing'));
        assertTrue(playSpy.called);
        assertFalse(this.presenter.usedStop);
        assertTrue(this.presenter.playTriggered);
    },

    'test given playing video when play was called then should not start to play': function() {
        var playSpy = sinon.spy(this.presenter.videoObject, 'play');
        this.presenter.videoObject = {
            play: sinon.mock(),
            paused: false
        };

        this.presenter.play();

        assertFalse('Make sure that play method was NOT executed', playSpy.called);
    },

    'test given playing video when stop was called then should stop playing': function() {
        var showPlayButtonSpy = sinon.spy(this.presenter, 'showPlayButton');
        var pauseSpy = sinon.spy(this.presenter.videoObject, 'pause');

        this.presenter.play();
        this.presenter.stop();

        assertTrue('The video has been stopped.', pauseSpy.called);
        assertTrue(showPlayButtonSpy.called);
        assertFalse('The video has not "playing" class.', this.presenter.$view[0].classList.contains('playing'));
    },

    'test given paused video when stop was called then should change status to stopped': function() {
        sinon.stub(this.presenter.videoObject, 'pause');

        this.presenter.stop();

        assertTrue('Stop method should be executed', this.presenter.videoObject.pause.called);
        assertTrue('Seek command should be executed', this.presenter.seek.called);
    },

    'test given playing video when pause was called should pause playing': function() {
        this.presenter.play();
        sinon.stub(this.presenter.videoObject, 'pause');
        this.presenter.videoObject = {
            pause: sinon.mock(),
            paused: false
        };

        this.presenter.pause();

        assertTrue('Pause method should be executed', this.presenter.videoObject.pause.calledOnce);
    },

    'test given paused video when pause was called then should not call pause function': function() {
        assertTrue('Make sure that video is paused', this.presenter.videoObject.paused);
        sinon.stub(this.presenter.videoObject, 'pause');

        this.presenter.pause();

        assertFalse('Pause method should NOT be executed', this.presenter.videoObject.pause.called);
    },

    'test given paused video when play was called then should call play before video is loaded': function () {
        this.presenter.isVideoLoaded = false;

        this.presenter.play();
        this.presenter.callTasksFromDeferredQueue();

        assertTrue(this.presenter.removeWaterMark.calledOnce);
    },

    'test given paused video when pause was called then should call pause before video is loaded': function () {
        this.presenter.isVideoLoaded = false;
        sinon.stub(this.presenter, 'removeClassFromView');

        this.presenter.videoObject = {
            pause: sinon.mock(),
            paused: false
        };

        this.presenter.pause();
        this.presenter.callTasksFromDeferredQueue();

        assertTrue(this.presenter.removeClassFromView.calledOnce);
    },

    'test given paused video when stop was called then should call stop before video is loaded': function () {
        this.presenter.isVideoLoaded = false;
        sinon.stub(this.presenter, 'removeClassFromView');
        this.presenter.videoObject = {
            pause: sinon.mock(),
            paused: false
        };

        this.presenter.stop();
        this.presenter.callTasksFromDeferredQueue();

        assertTrue(this.presenter.removeClassFromView.calledOnce);
    },

    'test given paused video when seek was called then should call seek before video is loaded': function () {
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
