import {RecordButton} from "./recordButton.jsm";

export class RecordButtonSoundEffect extends RecordButton {
    constructor(recordButton, startRecordingSoundEffect, stopRecordingSoundEffect) {
        super(recordButton.$button, recordButton.state, recordButton.timer, recordButton.recorder, recordButton.recordTimerLimiter);
        this.startRecordingSoundEffect = startRecordingSoundEffect;
        this.stopRecordingSoundEffect = stopRecordingSoundEffect;
        this.initSoundEffectLogic();
    }

    startRecordingCallback() {
        if (this.startRecordingSoundEffect.isValid()){
            this.startRecordingSoundEffect.playSound();
            super.startRecordingCallback();
        }
        else
            super.startRecordingCallback();
    }

    stopRecordingCallback(){
        if (this.stopRecordingSoundEffect.isValid())
            this.stopRecordingSoundEffect.playSound();
        else
            super.stopRecordingCallback();
    }

    initSoundEffectLogic() {
        this.startRecordingSoundEffect.onStartCallback = () => {
        };

        this.startRecordingSoundEffect.onStopCallback = () => {
        };

        this.stopRecordingSoundEffect.onStartCallback = () => {
            this.deactivate();
            super.stopRecordingCallback();
            this.state.setRecording();
        };

        this.stopRecordingSoundEffect.onStopCallback = () => {
            this.activate();
            this.state.setLoaded();
        };
    }
}