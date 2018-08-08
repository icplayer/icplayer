TestCase("[Media Recorder] Reset Integration Test", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        this.mediaRecorder = this.presenter.mediaRecorder;

        this.model = createModel();
        this.view = createView();

        this.mediaRecorder.run(this.view, this.model);
    },

    "test 1": function () {
        // this.mediaRecorder.player.setRecording("/file/666666");
        // let source = this.mediaRecorder.viewHandlers.$playerView.find('audio')[0];
        //
        // this.mediaRecorder.reset();

        // todo

    }
});