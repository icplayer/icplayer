TestCase("[Media Recorder] Activation Test", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        this.mediaRecorder = this.presenter.mediaRecorder;

        this.mediaRecorder.activationState = {
            isInactive: sinon.stub(),
            setActive: sinon.stub(),
            setInactive: sinon.stub()
        };
        this.mediaRecorder.recordButton = {
            activate: sinon.stub(),
            deactivate: sinon.stub(),
            forceClick: sinon.stub(),
            reset: sinon.stub(),
        };
        this.mediaRecorder.playButton = {
            activate: sinon.stub(),
            deactivate: sinon.stub(),
            forceClick: sinon.stub()
        };
        this.mediaRecorder.defaultRecordingPlayButton = {
            activate: sinon.stub(),
            deactivate: sinon.stub(),
            forceClick: sinon.stub()
        };
        this.mediaRecorder.addonViewService = {
            activate: sinon.stub(),
            deactivate: sinon.stub()
        };
        this.mediaRecorder.mediaState = {
            isRecording: sinon.stub(),
            isPlaying: sinon.stub(),
            isLoaded: sinon.stub(),
            isPlayingDefaultRecording: sinon.stub(),
        };
        this.mediaRecorder.resetRecording = sinon.stub();
        this.mediaRecorder.model = {};
        this.mediaRecorder.timer = {
            setTime: sinon.stub()
        };
    },

    "test activation doesn't work when addon is active": function () {
        this.mediaRecorder.activationState.isInactive.returns(false);

        this.mediaRecorder.activate();

        assertTrue(this.mediaRecorder.activationState.setActive.notCalled);
        assertTrue(this.mediaRecorder.recordButton.activate.notCalled);
        assertTrue(this.mediaRecorder.playButton.activate.notCalled);
        assertTrue(this.mediaRecorder.addonViewService.activate.notCalled);
    },

    "test activation works correctly when addon is inactive": function () {
        this.mediaRecorder.activationState.isInactive.returns(true);

        this.mediaRecorder.activate();

        assertTrue(this.mediaRecorder.activationState.setActive.calledOnce);
        assertTrue(this.mediaRecorder.recordButton.activate.calledOnce);
        assertTrue(this.mediaRecorder.playButton.activate.calledOnce);
        assertTrue(this.mediaRecorder.defaultRecordingPlayButton.activate.calledOnce);
        assertTrue(this.mediaRecorder.addonViewService.activate.calledOnce);
    },

    "test deactivation works correctly when it is triggered": function () {
        this.mediaRecorder.deactivate();

        assertTrue(this.mediaRecorder.activationState.setInactive.calledOnce);
        assertTrue(this.mediaRecorder.recordButton.deactivate.calledOnce);
        assertTrue(this.mediaRecorder.playButton.deactivate.calledOnce);
        assertTrue(this.mediaRecorder.addonViewService.deactivate.calledOnce);
    },

    "test buttons is triggered when deactivate addon and state is set to recording": function () {
        this.mediaRecorder.mediaState.isRecording.returns(true);
        this.mediaRecorder.mediaState.isPlaying.returns(false);
        this.mediaRecorder.model.isResetRemovesRecording = false;

        this.mediaRecorder.deactivate();

        assertTrue(this.mediaRecorder.recordButton.reset.notCalled);
        assertTrue(this.mediaRecorder.recordButton.forceClick.calledOnce);
    },

    "test buttons is triggered when deactivate addon and state is set to playing": function () {
        this.mediaRecorder.mediaState.isRecording.returns(false);
        this.mediaRecorder.mediaState.isPlaying.returns(true);

        this.mediaRecorder.deactivate();

        assertTrue(this.mediaRecorder.playButton.forceClick.calledOnce);
        assertTrue(this.mediaRecorder.recordButton.forceClick.notCalled);
    },
});
