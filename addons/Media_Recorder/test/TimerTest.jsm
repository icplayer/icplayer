TestCase("[Media Recorder] Timer", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();

        this.model = {
            ID: "mediaRecorder_1",
            "Is Visible": "True",
            maxTime: "10",
            type: "audio",
            defaultRecording: "/file/666666666",
            startRecordingSound: "/file/666666666",
            stopRecordingSound: "/file/666666666"
        };

        this.view = $('<div></div>');
        this.presenter.mediaRecorder.run(this.model, this.view);
        this.timer = this.presenter.mediaRecorder.timer;
        this.timer.$view = null;
    },

    // todo
    // "test model is valid when the whole data is correct": function () {
    "test timer": function () {
        console.log()
    }
});