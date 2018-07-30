export class RecordButton {
    constructor($button, state, timer, recorder, recordTimerLimiter) {
        this.$button = $button;
        this.state = state;
        this.timer = timer;
        this.recorder = recorder;
        this.recordTimerLimiter = recordTimerLimiter;
    }

    activate() {
        this.$button.click(() => this.eventHandler());
    }

    deactivate() {
        this.$button.unbind();
    }

    forceClick() {
        this.$button.click();
    }

    eventHandler() {
        if (this.state.isNew() || this.state.isLoaded())
            this.onStartRecording();
        else if (this.state.isRecording())
            this.onStopRecording()
    }

    onStartRecording() {
        this.recorder.onStartRecording = () => this.startRecordingCallback();
        this.recorder.startRecording();
    }

    onStopRecording() {
        this.recorder.onStopRecording = () => this.stopRecordingCallback();
        this.recorder.stopRecording()
    };

    startRecordingCallback() {
        this.$button.addClass("selected");
        this.state.setRecording();
        this.timer.reset();
        this.timer.startCountdown();
        this.recordTimerLimiter.startCountdown();
    }

    stopRecordingCallback() {
        this.$button.removeClass("selected");
        this.state.setLoaded();
        this.timer.stopCountdown();
        this.recordTimerLimiter.stopCountdown();
    }
}