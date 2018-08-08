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
            forceClick: sinon.stub()
        };
        this.mediaRecorder.playButton = {
            activate: sinon.stub(),
            deactivate: sinon.stub(),
            forceClick: sinon.stub()
        };
        this.mediaRecorder.addonWrapper = {
            activate: sinon.stub(),
            deactivate: sinon.stub()
        };
        this.mediaRecorder.state = {
            isRecording: sinon.stub(),
            isPlaying: sinon.stub()
        };
    },

    "test activation doesn't work when addon is active": function () {
        this.mediaRecorder.activationState.isInactive.returns(false);

        this.mediaRecorder.activate();

        assertTrue(this.mediaRecorder.activationState.setActive.notCalled);
        assertTrue(this.mediaRecorder.recordButton.activate.notCalled);
        assertTrue(this.mediaRecorder.playButton.activate.notCalled);
        assertTrue(this.mediaRecorder.addonWrapper.activate.notCalled);
    },

    "test activation works correctly when addon is inactive": function () {
        this.mediaRecorder.activationState.isInactive.returns(true);

        this.mediaRecorder.activate();

        assertTrue(this.mediaRecorder.activationState.setActive.calledOnce);
        assertTrue(this.mediaRecorder.recordButton.activate.calledOnce);
        assertTrue(this.mediaRecorder.playButton.activate.calledOnce);
        assertTrue(this.mediaRecorder.addonWrapper.activate.calledOnce);
    },

    "test deactivation works correctly when it is triggered": function () {
        this.mediaRecorder.deactivate();

        assertTrue(this.mediaRecorder.activationState.setInactive.calledOnce);
        assertTrue(this.mediaRecorder.recordButton.deactivate.calledOnce);
        assertTrue(this.mediaRecorder.playButton.deactivate.calledOnce);
        assertTrue(this.mediaRecorder.addonWrapper.deactivate.calledOnce);
    },

    "test buttons is triggered when deactivate addon and state is set to recording": function () {
        this.mediaRecorder.state.isRecording.returns(true);
        this.mediaRecorder.state.isPlaying.returns(false);

        this.mediaRecorder.deactivate();

        assertTrue(this.mediaRecorder.recordButton.forceClick.calledOnce);
        assertTrue(this.mediaRecorder.playButton.forceClick.notCalled);
    },

    "test buttons is triggered when deactivate addon and state is set to playing": function () {
        this.mediaRecorder.state.isRecording.returns(false);
        this.mediaRecorder.state.isPlaying.returns(true);

        this.mediaRecorder.deactivate();

        assertTrue(this.mediaRecorder.playButton.forceClick.calledOnce);
        assertTrue(this.mediaRecorder.recordButton.forceClick.notCalled);
    }
});