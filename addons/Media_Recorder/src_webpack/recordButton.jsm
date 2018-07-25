export class RecordButton {
    constructor($button, state, timer, recorder, recordTimerLimiter, startRecordingSoundEffect, stopRecordingSoundEffect) {
        this.$button = $button;
        this.state = state;
        this.timer = timer;
        this.recorder = recorder;
        this.recordTimerLimiter = recordTimerLimiter;
        this.startRecordingSoundEffect = startRecordingSoundEffect;
        this.stopRecordingSoundEffect = stopRecordingSoundEffect;

        this.startRecordingSoundEffect.onStartCallback = () => {
            this.deactivate();
            this.state.setRecording();
        };

        this.startRecordingSoundEffect.onStopCallback = () => {
            this.activate();
            this.startRecording(event);
        };

        this.stopRecordingSoundEffect.onStartCallback = () => {
            this.deactivate();
            this.stopRecording(event);
            this.state.setRecording();
        };

        this.stopRecordingSoundEffect.onStopCallback = () => {
            this.activate();
            this.state.setLoaded();
        };
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
        if (this.startRecordingSoundEffect.isValid())
            this.startRecordingSoundEffect.playSound();
        else
            this.startRecording();
    }

    onStopRecording() {
        console.log("CLICK");

        if (this.stopRecordingSoundEffect.isValid())
            this.stopRecordingSoundEffect.playSound();
        else
            this.stopRecording();
    }

    stopRecording() {
        this.recorder.stopRecording(() => {
            this.$button.removeClass("selected");
            this.state.setLoaded();
            this.timer.stopCountdown();
            this.recordTimerLimiter.stopCountdown();
        });
    }

    startRecording() {
        this.recorder.startRecording(() => {
            this.$button.addClass("selected");
            this.state.setRecording();
            this.timer.reset();
            this.timer.startCountdown();
            this.recordTimerLimiter.startCountdown();
        });
    }
}