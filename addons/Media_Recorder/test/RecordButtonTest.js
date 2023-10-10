TestCase("[Media Recorder] Record Button", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.$view = $('<div></div>');
        this.state = {
            setBlocked: sinon.stub(),
            setRecording: sinon.stub(),
            setLoading: sinon.stub(),
            isLoadedDefaultRecording: sinon.stub()
        };

        this.recordButton = new internalElements.RecordButton({$view: this.$view, state: this.state});
        this.recordButton.onStartRecordingCallback = sinon.stub();
        this.recordButton.onStopRecordingCallback = sinon.stub();
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

        assertTrue(this.recordButton.onStartRecordingCallback.calledOnce);
    },

    "test start recording when button has been triggered and media state is set to loaded": function () {
        this.state.isNew = () => false;
        this.state.isLoaded = () => true;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertTrue(this.recordButton.onStartRecordingCallback.calledOnce);
    },

    "test stop recording is not called when button has been triggered and media state is set to new": function () {
        this.state.isNew = () => true;
        this.state.isLoaded = () => false;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertTrue(this.recordButton.onStopRecordingCallback.notCalled);
    },

    "test stop recording is not called when button has been triggered and media state is set to loaded": function () {
        this.state.isNew = () => false;
        this.state.isLoaded = () => true;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertTrue(this.recordButton.onStopRecordingCallback.notCalled);
    },

    "test view style is correct when button has been triggered and media state is set to new": function () {
        let styleClass = "selected disable-record-button";
        this.state.isNew = () => true;
        this.state.isLoaded = () => false;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertEquals(styleClass, this.$view[0].className);
    },

    "test view style is correct when button has been triggered and media state is set to loaded": function () {
        let styleClass = "selected disable-record-button";
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
        this.state.isLoadedDefaultRecording = () => false;
        this.state.isBlockedSafari = () => false;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertTrue(this.recordButton.onStopRecordingCallback.calledOnce);
    },

    "test start recording is not called when button has been triggered and media state is set to recording": function () {
        this.state.isNew = () => false;
        this.state.isLoaded = () => false;
        this.state.isRecording = () => true;
        this.state.isLoadedDefaultRecording = () => false;
        this.state.isBlockedSafari = () => false;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertTrue(this.recordButton.onStartRecordingCallback.notCalled);
    },

    "test view style is correct when button has been triggered and media state is set to recording": function () {
        this.state.isNew = () => false;
        this.state.isLoaded = () => false;
        this.state.isRecording = () => true;
        this.state.isLoadedDefaultRecording = () => false;
        this.state.isBlockedSafari = () => false;

        this.recordButton.activate();
        this.$view.trigger("click");

        assertEquals("", this.$view[0].className);
    }
});