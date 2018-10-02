import {RecordButton} from "../RecordButton.jsm";

export class RecordButtonSoundEffect extends RecordButton {

    constructor(recordButton, startRecordingSoundEffect, stopRecordingSoundEffect) {
        super({$view: recordButton.$view, state: recordButton.state});
        this.startRecordingSoundEffect = startRecordingSoundEffect;
        this.stopRecordingSoundEffect = stopRecordingSoundEffect;
    }

    _startRecording() {
        if (this.startRecordingSoundEffect.isValid())
            this._recordWithSoundEffect();
        else
            super._startRecording();
    }

    _recordWithSoundEffect() {
        this.startRecordingSoundEffect.onStartCallback = () => {
        };
        this.startRecordingSoundEffect.onStopCallback = () => {
        };
        super._startRecording();
        this.startRecordingSoundEffect.playSound();
    }

    _stopRecording() {
        if (this.stopRecordingSoundEffect.isValid())
            this._onStopRecordingWithSoundEffect();
        else
            super._stopRecording();
    }

    _onStopRecordingWithSoundEffect() {
        this.stopRecordingSoundEffect.onStartCallback = () => {
            super._stopRecording();
            this.deactivate();
        };
        this.stopRecordingSoundEffect.onStopCallback = () => {
            this.activate()
        };
        this.stopRecordingSoundEffect.playSound();
    }
}