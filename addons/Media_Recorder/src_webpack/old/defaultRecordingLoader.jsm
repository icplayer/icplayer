export class DefaultRecordingLoader {
    constructor($loaderView, player, timer, recordingState) {
        this.$loaderView = $loaderView;
        this.player = player;
        this.timer = timer;
        this.recordingState = recordingState;
    }

    isValid(recording) {
        return recording != "" && recording != null && typeof recording != "undefined";
    }

    loadDefaultRecording(recording) {
        this.player.onLoadStart = () => {
            this.$loaderView.removeClass("hidden");
            this.recordingState.setLoading();
            console.log("onLoadStart")
        };

        this.player.onCanPlay = () => {
            this.$loaderView.addClass("hidden");
            console.log("onCanPlay")
        };

        if (this.isValid(recording)) {
            this.player.recording = recording;
            this.recordingState.setLoaded();
        }
    }
}