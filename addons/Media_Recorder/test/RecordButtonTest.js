TestCase("[Media Recorder] Record Button", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.$view = $('<div></div>');
        this.stream = sinon.stub();
        this.state = {
            setBlocked: sinon.stub(),
            setRecording: sinon.stub(),
            setLoading: sinon.stub()
        };
        this.player = {
            startStreaming: sinon.stub(),
            stopStreaming: sinon.stub()
        };
        this.timer = {
            reset: sinon.stub(),
            startCountdown: sinon.stub(),
            stopCountdown: sinon.stub()
        };
        this.mediaResources = {
            getMediaResources: callback => callback(this.stream)
        };
        this.recorder = {
            startRecording: sinon.stub(),
            stopRecording: sinon.stub()
        };
        this.soundIntensity = {
            openStream: sinon.stub(),
            closeStream: sinon.stub()
        };
        this.recordingTimer = {
            startCountdown: sinon.stub(),
            stopCountdown: sinon.stub()
        };

        this.recordButton = new internalElements.RecordButton(this.$view, this.state, this.mediaResources, this.recorder, this.player, this.timer, this.soundIntensity, this.recordingTimer);
    },

    "test view style is correct when button is initialized": function () {
        let zIndexStyle = "100";

        assertEquals(zIndexStyle, this.$view[0].style.zIndex);
    },

    "test start recording when button has been triggered and media state is set to new": function () {
        this.state.isNew = () => true;
        this.state.isLoaded = () => false;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertTrue(this.state.setBlocked.calledOnce);
        assertTrue(this.state.setRecording.calledOnce);
        assertTrue(this.timer.reset.calledOnce);
        assertTrue(this.timer.startCountdown.calledOnce);
        assertTrue(this.recordingTimer.startCountdown.calledOnce);
        assertTrue(this.player.startStreaming.calledOnce);
        assertTrue(this.recorder.startRecording.calledOnce);
        assertTrue(this.soundIntensity.openStream.calledOnce);
    },

    "test start recording when button has been triggered and media state is set to loaded": function () {
        this.state.isNew = () => false;
        this.state.isLoaded = () => true;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertTrue(this.state.setBlocked.calledOnce);
        assertTrue(this.state.setRecording.calledOnce);
        assertTrue(this.timer.reset.calledOnce);
        assertTrue(this.timer.startCountdown.calledOnce);
        assertTrue(this.recordingTimer.startCountdown.calledOnce);
        assertTrue(this.player.startStreaming.calledOnce);
        assertTrue(this.recorder.startRecording.calledOnce);
        assertTrue(this.soundIntensity.openStream.calledOnce);
    },

    "test media stream is used when button has been triggered and media state is set to new": function () {
        this.state.isNew = () => true;
        this.state.isLoaded = () => false;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertEquals(this.stream, this.player.startStreaming.getCall(0).args[0]);
        assertEquals(this.stream, this.recorder.startRecording.getCall(0).args[0]);
        assertEquals(this.stream, this.soundIntensity.openStream.getCall(0).args[0]);
    },

    "test media stream is used when button has been triggered and media state is set to loaded": function () {
        this.state.isNew = () => false;
        this.state.isLoaded = () => true;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertEquals(this.stream, this.player.startStreaming.getCall(0).args[0]);
        assertEquals(this.stream, this.recorder.startRecording.getCall(0).args[0]);
        assertEquals(this.stream, this.soundIntensity.openStream.getCall(0).args[0]);
    },

    "test stop recording is not called when button has been triggered and media state is set to new": function () {
        this.state.isNew = () => true;
        this.state.isLoaded = () => false;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertTrue(this.recorder.stopRecording.notCalled);
        assertTrue(this.player.stopStreaming.notCalled);
        assertTrue(this.state.setLoading.notCalled);
        assertTrue(this.timer.stopCountdown.notCalled);
        assertTrue(this.recordingTimer.stopCountdown.notCalled);
        assertTrue(this.soundIntensity.closeStream.notCalled);
    },

    "test stop recording is not called when button has been triggered and media state is set to loaded": function () {
        this.state.isNew = () => false;
        this.state.isLoaded = () => true;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertTrue(this.recorder.stopRecording.notCalled);
        assertTrue(this.player.stopStreaming.notCalled);
        assertTrue(this.state.setLoading.notCalled);
        assertTrue(this.timer.stopCountdown.notCalled);
        assertTrue(this.recordingTimer.stopCountdown.notCalled);
        assertTrue(this.soundIntensity.closeStream.notCalled);
    },

    "test view style is correct when button has been triggered and media state is set to new": function () {
        let styleClass = "selected";
        this.state.isNew = () => true;
        this.state.isLoaded = () => false;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertEquals(styleClass, this.$view[0].className);
    },

    "test view style is correct when button has been triggered and media state is set to loaded": function () {
        let styleClass = "selected";
        this.state.isNew = () => false;
        this.state.isLoaded = () => true;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertEquals(styleClass, this.$view[0].className);
    },

    "test stop recording when button has been triggered and media state is set to recording": function () {
        this.state.isNew = () => false;
        this.state.isLoaded = () => false;
        this.state.isRecording = () => true;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertTrue(this.recorder.stopRecording.calledOnce);
        assertTrue(this.player.stopStreaming.calledOnce);
        assertTrue(this.state.setLoading.calledOnce);
        assertTrue(this.timer.stopCountdown.calledOnce);
        assertTrue(this.recordingTimer.stopCountdown.calledOnce);
        assertTrue(this.soundIntensity.closeStream.calledOnce);
    },

    "test start recording is not called when button has been triggered and media state is set to recording": function () {
        this.state.isNew = () => false;
        this.state.isLoaded = () => false;
        this.state.isRecording = () => true;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertTrue(this.state.setBlocked.notCalled);
        assertTrue(this.state.setRecording.notCalled);
        assertTrue(this.timer.reset.notCalled);
        assertTrue(this.timer.startCountdown.notCalled);
        assertTrue(this.recordingTimer.startCountdown.notCalled);
        assertTrue(this.player.startStreaming.notCalled);
        assertTrue(this.recorder.startRecording.notCalled);
        assertTrue(this.soundIntensity.openStream.notCalled);
    },

    "test view style is correct when button has been triggered and media state is set to recording": function () {
        this.state.isNew = () => false;
        this.state.isLoaded = () => false;
        this.state.isRecording = () => true;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertEquals("", this.$view[0].className);
    }
});