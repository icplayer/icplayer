TestCase('[Audio] CallingCommands', {
    setUp: function () {
        this.presenter = AddonAudio_create();

        this.playSpy = sinon.spy();
        this.pauseSpy = sinon.spy();
        URL.createObjectURL = function (){return "XXX"};

        this.presenter.configuration = {
            forceLoadAudio: false,
            narration: "123"
        };
        this.presenter.audio = {
            src: "xxx",
            play: this.playSpy,
            pause: this.pauseSpy,
            paused: true,
            readyState: 4,
            duration: 20
        };

        this.eventData = {
            currentTarget: {
                status: 200,
                response: "xxx"
            }
        }
    },

    'test play command should be pushed to queue': function () {
        this.presenter.configuration.forceLoadAudio = true;
        this.presenter.play();
        assertTrue(this.presenter.audio.play.notCalled);

        this.presenter.loadAudioDataFromRequest(this.eventData);
        this.presenter.AddonAudio_onLoadedMetadataCallback();
        assertTrue(this.presenter.audio.play.calledOnce);
    },

    'test play command should be called instantly': function () {
        this.presenter.play();
        assertTrue(this.presenter.audio.play.calledOnce);
    },

    'test pause command should be pushed to queue': function () {
        this.presenter.audio.paused = false;
        this.presenter.configuration.forceLoadAudio = true;
        this.presenter.pause();

        assertTrue(this.presenter.audio.pause.notCalled);

        this.presenter.loadAudioDataFromRequest(this.eventData);
        this.presenter.AddonAudio_onLoadedMetadataCallback();
        assertTrue(this.presenter.audio.pause.calledOnce);
    },

    'test pause command should be called instantly' : function () {
        this.presenter.audio.paused = false;
        this.presenter.pause();
        assertTrue(this.presenter.audio.pause.calledOnce);
    },

    'test stop command should be pushed to queue' : function () {
        this.presenter.audio.paused = false;
        this.presenter.configuration.forceLoadAudio = true;
        this.presenter.stop();

        assertTrue(this.presenter.audio.pause.notCalled);

        this.presenter.loadAudioDataFromRequest(this.eventData);
        this.presenter.AddonAudio_onLoadedMetadataCallback();

        assertTrue(this.presenter.audio.pause.calledOnce);
    },

    'test stop command should be called instantly' : function () {
        this.presenter.audio.paused = false;
        this.presenter.stop();
        assertTrue(this.presenter.audio.pause.calledOnce);
    },

    'test given narration in config when getnarration called then returns the narration from config': function () {
        var expected = this.presenter.configuration.narration;
        var given = this.presenter.getNarration();

        assertEquals(expected, given);
    }
});