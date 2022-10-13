TestCase("[Media Recorder] Reset Test", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        this.mediaRecorder = this.presenter.mediaRecorder;

        this.mediaRecorder.model = {};

        this.mediaRecorder.resetRecording = sinon.stub();
        this.mediaRecorder.activate = sinon.stub();
        this.mediaRecorder.deactivate = sinon.stub();
        this.mediaRecorder.setVisibility = sinon.stub();
        this.mediaRecorder._setEnableState = sinon.stub();
    },

    "test reset recording is not triggered when reset addon and isResetRemovesRecording false": function () {
        this.mediaRecorder.model.isResetRemovesRecording = false;

        this.mediaRecorder.reset();

        assertFalse(this.mediaRecorder.resetRecording.called);
    },

    "test reset recording is triggered when reset addon and isResetRemovesRecording true": function () {
        this.mediaRecorder.model.isResetRemovesRecording = true;

        this.mediaRecorder.reset();

        assertTrue(this.mediaRecorder.resetRecording.calledOnce);
    }
});
