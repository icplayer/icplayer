TestCase("[Slideshow] Commands show/hide", {
    setUp: function () {
        this.presenter = AddonSlideshow_create();
        this.stubs = {
            playAudioResource: sinon.stub(this.presenter, 'playAudioResource'),
            setVisibility: sinon.stub(this.presenter, 'setVisibility'),
            pauseAudioResource: sinon.stub(this.presenter, 'pauseAudioResource')
        };

        this.presenter.configuration.audioLoadComplete = true;
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
        this.presenter.playAudioResource.restore();
        this.presenter.pauseAudioResource.restore();
    },

    'test show command, when audio not playing': function () {
        this.presenter.configuration = {
            isVisible: true,
            audioState: this.presenter.AUDIO_STATE.STOP
        };

        this.presenter.show();


        assertTrue(this.stubs.setVisibility.called);
        assertTrue(this.stubs.setVisibility.called);
        assertTrue(this.presenter.configuration.isVisible);
    },

    'test show command, when audio is playing': function () {
        this.presenter.isPlaying = false;
        this.presenter.configuration = {
            isVisible: true,
            audioState: this.presenter.AUDIO_STATE.PLAY
        };

        this.presenter.show();

        assertTrue(this.stubs.playAudioResource.called);
        assertTrue(this.stubs.setVisibility.called);
        assertTrue(this.presenter.configuration.isVisible);
    },

    'test hide command, when audio is playing': function () {
        this.presenter.isPlaying = false;
        this.presenter.configuration = {
            isVisible: true,
            audioState: this.presenter.AUDIO_STATE.PLAY
        };

        this.presenter.hide();

        assertTrue(this.stubs.pauseAudioResource.called);
        assertTrue(this.stubs.setVisibility.called);
        assertFalse(this.presenter.configuration.isVisible);
    },

    'test hide command, when audio is not playing': function () {
        this.presenter.isPlaying = false;
        this.presenter.configuration = {
            isVisible: true,
            audioState: this.presenter.AUDIO_STATE.STOP
        };

        this.presenter.hide();

        assertFalse(this.stubs.pauseAudioResource.called);
        assertTrue(this.stubs.setVisibility.called);
        assertFalse(this.presenter.configuration.isVisible);
    }
});

TestCase("[Slideshow] Commands play/stop", {
    setUp: function () {
        this.presenter = AddonSlideshow_create();
        this.stubs = {
            stopPresentation: sinon.stub(this.presenter, 'stopPresentation'),
            switchSlideShowStopToPlay: sinon.stub(this.presenter, 'switchSlideShowStopToPlay'),
            switchSlideShowPauseToPlay: sinon.stub(this.presenter, 'switchSlideShowPauseToPlay'),
            switchSlideShowPlayToPause: sinon.stub(this.presenter, 'switchSlideShowPlayToPause'),
            playAudioAction: sinon.stub(this.presenter, 'playAudioAction')
        };

    },

    tearDown: function () {
        this.presenter.stopPresentation.restore();
        this.presenter.switchSlideShowStopToPlay.restore();
        this.presenter.playAudioAction.restore();
        this.presenter.switchSlideShowPauseToPlay.restore();
        this.presenter.switchSlideShowPlayToPause.restore();
    },

    'test stop command, when audio is not playing': function () {
        this.presenter.configuration = {
            isVisible: true,
            audioState: this.presenter.AUDIO_STATE.STOP,
            audioLoadComplete: true
        };

        this.presenter.stop();

        assertFalse(this.stubs.stopPresentation.called);
    },

    'test stop command, when audio is paused': function () {
        this.presenter.configuration = {
            isVisible: true,
            audioState: this.presenter.AUDIO_STATE.PAUSE,
            audioLoadComplete: true
        };

        this.presenter.stop();

        assertTrue(this.stubs.stopPresentation.called);
    },

    'test stop command, when audio is playing': function () {
        this.presenter.configuration = {
            isVisible: true,
            audioState: this.presenter.AUDIO_STATE.PLAY,
            audioLoadComplete: true
        };

        this.presenter.stop();

        assertTrue(this.stubs.stopPresentation.called);
    },

    'test play command, audio in stop state': function () {
        this.presenter.configuration = {
            audioState: this.presenter.AUDIO_STATE.STOP,
            audioLoadComplete: true
        };
        var readSlideStub = sinon.stub(this.presenter, 'readSlide');
        readSlideStub.returns(true);

        this.presenter.play();

        assertTrue(this.stubs.switchSlideShowStopToPlay.called);
        assertFalse(this.stubs.switchSlideShowPauseToPlay.called);
        assertFalse(this.stubs.playAudioAction.called);
    },

    'test play command, audio in pause state': function () {
        this.presenter.configuration = {
            audioState: this.presenter.AUDIO_STATE.PAUSE,
            audioLoadComplete: true
        };

        this.presenter.play();

        assertFalse(this.stubs.switchSlideShowStopToPlay.called);
        assertTrue(this.stubs.switchSlideShowPauseToPlay.called);
        assertFalse(this.stubs.playAudioAction.called);
    },

    'test play command, audio stop from navigation state': function () {
        this.presenter.configuration = {
            audioState: this.presenter.AUDIO_STATE.STOP_FROM_NAVIGATION,
            audioLoadComplete: true
        };
        var readSlideStub = sinon.stub(this.presenter, 'readSlide');
        readSlideStub.returns(true);

        this.presenter.play();

        assertTrue(this.stubs.playAudioAction.called);
        assertFalse(this.stubs.switchSlideShowPauseToPlay.called);
        assertFalse(this.stubs.switchSlideShowStopToPlay.called);
    },

    'test stop command wont be called if audio is not loaded': function () {
        this.presenter.configuration = {
            isVisible: true,
            audioState: this.presenter.AUDIO_STATE.PLAY,
            audioLoadComplete: false
        };

        this.presenter.stop();
        assertFalse(this.stubs.stopPresentation.called);

        this.presenter._internal_state.deferredQueue.resolve();
        assertTrue(this.stubs.stopPresentation.called);

        this.presenter.configuration.audioLoadComplete = true;

        this.presenter.stop();
        assertTrue(this.stubs.stopPresentation.calledTwice);
    },

    'test play command, wont be called if audio is not loaded': function () {
        this.presenter.configuration = {
            audioState: this.presenter.AUDIO_STATE.PAUSE,
            audioLoadComplete: false
        };

        this.presenter.play();
        assertFalse(this.stubs.switchSlideShowPauseToPlay.called);

        this.presenter._internal_state.deferredQueue.resolve();
        assertTrue(this.stubs.switchSlideShowPauseToPlay.called);

        this.presenter.configuration.audioLoadComplete = true;

        this.presenter.play();
        assertTrue(this.stubs.switchSlideShowPauseToPlay.calledTwice);
    },

    'test pause command wont be called if audio is not loaded': function () {
        this.presenter.configuration = {
            audioState: this.presenter.AUDIO_STATE.PLAY,
            audioLoadComplete: false
        };

        this.presenter.pause();
        assertFalse(this.stubs.switchSlideShowPlayToPause.called);

        this.presenter._internal_state.deferredQueue.resolve();
        assertTrue(this.stubs.switchSlideShowPlayToPause.calledOnce);

        this.presenter.configuration.audioLoadComplete = true;

        this.presenter.pause();
        assertTrue(this.stubs.switchSlideShowPlayToPause.calledTwice);
    }
});

TestCase("[Slideshow] Command next logic validation", {
    setUp: function () {
        this.presenter = AddonSlideshow_create();
        this.stubs = {
            goToSlide: sinon.stub(this.presenter, 'goToSlide'),
            setTimeFromSlideIndex: sinon.stub(this.presenter, 'setTimeFromSlideIndex'),
            getCurrentSlideIndex: sinon.stub(this.presenter, 'getCurrentSlideIndex')
        };
    },

    tearDown: function () {
        this.presenter.goToSlide.restore();
        this.presenter.setTimeFromSlideIndex.restore();
        this.presenter.getCurrentSlideIndex.restore();
    },

    'test nextSlide command, changing slide in play state': function () {
        this.stubs.getCurrentSlideIndex.returns(1);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.PLAY,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.next();

        assertTrue(this.stubs.goToSlide.called);
        assertTrue(this.stubs.goToSlide.calledWith(2, false));
        assertTrue(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PLAY, this.presenter.configuration.audioState);
    },

    'test nextSlide command, changing slide in pause state': function () {
        this.stubs.getCurrentSlideIndex.returns(1);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.PAUSE,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.next();

        assertTrue(this.stubs.goToSlide.called);
        assertTrue(this.stubs.goToSlide.calledWith(2, false));
        assertTrue(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PAUSE, this.presenter.configuration.audioState);
    },

    'test nextSlide command, changing slide in not playing state': function () {
        this.stubs.getCurrentSlideIndex.returns(1);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.STOP,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.next();

        assertTrue(this.stubs.goToSlide.called);
        assertTrue(this.stubs.goToSlide.calledWith(2, false));
        assertTrue(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PAUSE, this.presenter.configuration.audioState);
    },

    'test nextSlide command, not changing slide in playing state': function () {
        this.stubs.getCurrentSlideIndex.returns(2);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.PLAY,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.next();

        assertFalse(this.stubs.goToSlide.called);
        assertFalse(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PLAY, this.presenter.configuration.audioState);
    },

    'test nextSlide command, not changing slide in stop state': function () {
        this.stubs.getCurrentSlideIndex.returns(2);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.STOP,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.next();

        assertFalse(this.stubs.goToSlide.called);
        assertFalse(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PAUSE, this.presenter.configuration.audioState);
    },

    'test nextSlide command, not changing slide in pause state': function () {
        this.stubs.getCurrentSlideIndex.returns(2);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.STOP,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.next();

        assertFalse(this.stubs.goToSlide.called);
        assertFalse(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PAUSE, this.presenter.configuration.audioState);
    },
    'test nextSlide command wont be worked if audio is not loaded': function () {
        this.stubs.getCurrentSlideIndex.returns(1);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.PLAY,
            audio: {wasPlayed: true},
            audioLoadComplete: false
        };

        this.presenter.next();

        assertFalse(this.stubs.goToSlide.called);
        assertFalse(this.stubs.goToSlide.calledWith(2, false));
        assertFalse(this.stubs.setTimeFromSlideIndex.called);

        this.presenter._internal_state.deferredQueue.resolve();
        
        assertTrue(this.stubs.goToSlide.called);
        assertTrue(this.stubs.goToSlide.calledWith(2, false));
        assertTrue(this.stubs.setTimeFromSlideIndex.called);
    },
});

TestCase("[Slideshow] Command previous logic validation", {
    setUp: function () {
        this.presenter = AddonSlideshow_create();
        this.stubs = {
            goToSlide: sinon.stub(this.presenter, 'goToSlide'),
            setTimeFromSlideIndex: sinon.stub(this.presenter, 'setTimeFromSlideIndex'),
            getCurrentSlideIndex: sinon.stub(this.presenter, 'getCurrentSlideIndex')
        };

        this.presenter.configuration.audioLoadComplete = true;
    },

    tearDown: function () {
        this.presenter.goToSlide.restore();
        this.presenter.setTimeFromSlideIndex.restore();
        this.presenter.getCurrentSlideIndex.restore();
    },

    'test previousSlide command, changing slide in play state': function () {
        this.stubs.getCurrentSlideIndex.returns(2);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.PLAY,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.previous();

        assertTrue(this.stubs.goToSlide.called);
        assertTrue(this.stubs.goToSlide.calledWith(1, false));
        assertTrue(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PLAY, this.presenter.configuration.audioState);
    },

    'test previousSlide command, changing slide in stop state': function () {
        this.stubs.getCurrentSlideIndex.returns(2);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.STOP,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.previous();

        assertTrue(this.stubs.goToSlide.called);
        assertTrue(this.stubs.goToSlide.calledWith(1, false));
        assertTrue(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PAUSE, this.presenter.configuration.audioState);
    },

    'test previousSlide command, changing slide in pause state': function () {
        this.stubs.getCurrentSlideIndex.returns(2);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.PAUSE,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.previous();

        assertTrue(this.stubs.goToSlide.called);
        assertTrue(this.stubs.goToSlide.calledWith(1, false));
        assertTrue(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PAUSE, this.presenter.configuration.audioState);
    },

    'test previousSlide command, not changing slide in play state': function () {
        this.stubs.getCurrentSlideIndex.returns(0);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.PLAY,
            audio: {wasPlayed: true}
        };

        this.presenter.previous();

        assertFalse(this.stubs.goToSlide.called);
        assertFalse(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PLAY, this.presenter.configuration.audioState);
    },

    'test previousSlide command, not changing slide in pause state': function () {
        this.stubs.getCurrentSlideIndex.returns(0);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.PAUSE,
            audio: {wasPlayed: true}
        };

        this.presenter.previous();

        assertFalse(this.stubs.goToSlide.called);
        assertFalse(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PAUSE, this.presenter.configuration.audioState);
    },

    'test previousSlide command, not changing slide in stop state': function () {
        this.stubs.getCurrentSlideIndex.returns(0);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.STOP,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.previous();

        assertFalse(this.stubs.goToSlide.called);
        assertFalse(this.stubs.setTimeFromSlideIndex.called);

        assertEquals(this.presenter.AUDIO_STATE.PAUSE, this.presenter.configuration.audioState);
    },

    'test previous command wont work if audio is not loaded': function () {
        this.stubs.getCurrentSlideIndex.returns(2);

        this.presenter.configuration = {
            slides: {count: 3},
            audioState: this.presenter.AUDIO_STATE.PLAY,
            audio: {wasPlayed: true},
            audioLoadComplete: false
        };

        this.presenter.previous();

        assertFalse(this.stubs.goToSlide.called);
        assertFalse(this.stubs.goToSlide.calledWith(1, false));
        assertFalse(this.stubs.setTimeFromSlideIndex.called);

        this.presenter._internal_state.deferredQueue.resolve();

        assertTrue(this.stubs.goToSlide.called);
        assertTrue(this.stubs.goToSlide.calledWith(1, false));
        assertTrue(this.stubs.setTimeFromSlideIndex.called);
    }
});

TestCase("[Slideshow] Command move to slide logic validation", {
    setUp: function () {
        this.presenter = AddonSlideshow_create();
        this.stubs = {
            goToSlide: sinon.stub(this.presenter, 'goToSlide'),
            setTimeFromSlideIndex: sinon.stub(this.presenter, 'setTimeFromSlideIndex'),
            getCurrentSlideIndex: sinon.stub(this.presenter, 'getCurrentSlideIndex')
        };
    },

    tearDown: function () {
        this.presenter.goToSlide.restore();
        this.presenter.setTimeFromSlideIndex.restore();
        this.presenter.getCurrentSlideIndex.restore();
    },

    'test moveToSlide command, changing slide in stop audio state': function () {
        this.stubs.getCurrentSlideIndex.returns(0);

        this.presenter.configuration = {
            slides: {count: 4},
            audioState: this.presenter.AUDIO_STATE.STOP,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.moveToCommand(["2"]);

        assertTrue(this.stubs.goToSlide.called);
        assertTrue(this.stubs.goToSlide.calledWith(1, false));
        assertEquals(this.presenter.AUDIO_STATE.PAUSE, this.presenter.configuration.audioState);
    },

    'test moveToSlide command, changing slide in play audio state': function () {
        this.stubs.getCurrentSlideIndex.returns(0);

        this.presenter.configuration = {
            slides: {count: 4},
            audioState: this.presenter.AUDIO_STATE.PLAY,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.moveToCommand(["2"]);

        assertTrue(this.stubs.goToSlide.called);
        assertTrue(this.stubs.goToSlide.calledWith(1, false));
        assertEquals(this.presenter.AUDIO_STATE.PLAY, this.presenter.configuration.audioState);
    },

    'test moveToSlide command, changing slide in pause audio state': function () {
        this.stubs.getCurrentSlideIndex.returns(0);

        this.presenter.configuration = {
            slides: {count: 4},
            audioState: this.presenter.AUDIO_STATE.PAUSE,
            audio: {wasPlayed: true},
            audioLoadComplete: true
        };

        this.presenter.moveToCommand(["2"]);

        assertTrue(this.stubs.goToSlide.called);
        assertTrue(this.stubs.goToSlide.calledWith(1, false));
        assertEquals(this.presenter.AUDIO_STATE.PAUSE, this.presenter.configuration.audioState);
    },

    'test moveToSlide command, not changing slide in stop audio state': function () {
        this.stubs.getCurrentSlideIndex.returns(1);

        this.presenter.configuration = {
            slides: {count: 4},
            audioState: this.presenter.AUDIO_STATE.STOP,
            audio: {wasPlayed: true}
        };

        this.presenter.moveToCommand(["6"]);

        assertFalse(this.stubs.goToSlide.called);
        assertEquals(this.presenter.AUDIO_STATE.STOP, this.presenter.configuration.audioState);
    },

    'test moveToSlide command, not changing slide in play audio state': function () {
        this.stubs.getCurrentSlideIndex.returns(1);

        this.presenter.configuration = {
            slides: {count: 4},
            audioState: this.presenter.AUDIO_STATE.PLAY,
            audio: {wasPlayed: true}
        };

        this.presenter.moveToCommand(["6"]);

        assertFalse(this.stubs.goToSlide.called);
        assertEquals(this.presenter.AUDIO_STATE.PLAY, this.presenter.configuration.audioState);
    },

    'test moveToSlide command, not changing slide in pause audio state': function () {
        this.stubs.getCurrentSlideIndex.returns(1);

        this.presenter.configuration = {
            slides: {count: 4},
            audioState: this.presenter.AUDIO_STATE.PAUSE,
            audio: {wasPlayed: true}
        };

        this.presenter.moveToCommand(["6"]);

        assertFalse(this.stubs.goToSlide.called);
        assertEquals(this.presenter.AUDIO_STATE.PAUSE, this.presenter.configuration.audioState);
    },

    'test moveToCommand wont be played if audio is not loaded': function () {
        this.presenter.configuration = {
            slides: {count: 4},
            audioState: this.presenter.AUDIO_STATE.STOP,
            audio: {wasPlayed: true},
            audioLoadComplete: false
        };

        this.presenter.moveToCommand(["2"]);

        assertFalse(this.stubs.goToSlide.called);

        this.presenter._internal_state['deferredQueue'].resolve();

        assertTrue(this.stubs.goToSlide.called);
        this.presenter.configuration.audioLoadComplete = true;

        this.presenter.moveToCommand(["2"]);
        assertTrue(this.stubs.goToSlide.calledTwice);
    }
});
