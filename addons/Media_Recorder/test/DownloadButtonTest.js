TestCase("[Media Recorder] Download Button", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.$view = $('<div></div>');
        this.state = {
            recording: "",
        };

        this.downloadButton = new internalElements.DownloadButton({$view: this.$view, addonState: this.state});
    },

    "test given state without recording when button is pressed then downloadRecording method is not called": function () {
        this.downloadButton.downloadRecording = sinon.stub();

        this.downloadButton.activate();
        this.$view.trigger("click");

        assertTrue(this.downloadButton.downloadRecording.notCalled);
    },

    "test given state with recording when button is pressed then downloadRecording method is called": function () {
        this.state.recording = "12345";
        this.downloadButton.downloadRecording = sinon.stub();

        this.downloadButton.activate();
        this.$view.trigger("click");

        assertTrue(this.downloadButton.downloadRecording.calledOnce);
    }
});