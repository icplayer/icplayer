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
        this.$view.click(() => this._eventHandler());
    }

    deactivate() {
        this.$view.unbind();
    }

    forceClick() {
        this.$view.click();
    }

    _eventHandler() {
        if (this.state.isNew() || this.state.isLoaded())
            this._onStartRecording();
        else if (this.state.isRecording())
            this._onStopRecording()
    }

    _onStartRecording() {
        this.state.setBlocked();
        debugger;
        this.mediaResources.getMediaResources(stream => this._record(stream));
    }

    _record(stream) {
        debugger;
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