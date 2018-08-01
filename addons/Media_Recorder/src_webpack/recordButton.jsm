export class RecordButton {

    constructor($view, state, mediaResources, recorder, player, timer, soundIntensity, recordingTimer) {
        this.$view = $view;
        this.state = state;
        this.mediaResources = mediaResources;
        this.recorder = recorder;
        this.player = player;
        this.timer = timer;
        this.soundIntensity = soundIntensity;
        this.recordingTimer = recordingTimer;

        this.recordingTimer.onTimeExpired = () => this.forceClick();
    }

    activate() {
        console.log("ACTIVATE RECORD BUTTON");
        this.$view.click(() => this._eventHandler());
    }

    deactivate() {
        console.log("DEACTIVATE RECORD BUTTON");
        this.$view.unbind();
    }

    forceClick() {
        this.$view.click();
    }

    destroy() {
        this.deactivate();
        this.$view.remove();
        this.$view = null;
        this.state = null;
        this.mediaResources = null;
        this.recorder = null;
        this.player = null;
        this.timer = null;
        this.soundIntensity = null;
        this.recordingTimer.onTimeExpired = null;
        this.recordingTimer = null;
    }

    _eventHandler() {
        if (this.state.isNew() || this.state.isLoaded())
            this._onStartRecording();
        else if (this.state.isRecording())
            this._onStopRecording()
    }

    _onStartRecording() {
        this.state.setBlocked();
        this.mediaResources.getMediaResources(stream => this._record(stream));
    }

    _record(stream) {
        this.recorder.startRecording(stream);
        this.player.startStreaming(stream);
        this.state.setRecording();
        this.$view.addClass("selected");
        this.timer.reset();
        this.timer.startCountdown();
        this.recordingTimer.startCountdown();
        this.soundIntensity.openStream(stream);
    }

    _onStopRecording() {
        this.recorder.stopRecording();
        this.player.stopStreaming();
        this.state.setLoading();
        this.$view.removeClass("selected");
        this.timer.stopCountdown();
        this.recordingTimer.stopCountdown();
        this.soundIntensity.closeStream();
    }
}