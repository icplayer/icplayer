import {RecordButton} from "./recordButton.jsm";

export class RecordButtonSoundEffect extends RecordButton {

    constructor(recordButton, startRecordingSoundEffect, stopRecordingSoundEffect) {
        super(recordButton.$view, recordButton.state, recordButton.mediaResources, recordButton.recorder, recordButton.player, recordButton.timer, recordButton.soundIntensity, recordButton.recordingTimer);
        this.startRecordingSoundEffect = startRecordingSoundEffect;
        this.stopRecordingSoundEffect = stopRecordingSoundEffect;
    }

    _record(stream) {
        if (this.startRecordingSoundEffect.isValid())
            this._recordWithSoundEffect(stream);
        else
            super._record(stream);
    }

    _recordWithSoundEffect(stream) {
        super._record(stream);
        this.startRecordingSoundEffect.playSound();
    }

    _onStopRecording() {
        if (this.stopRecordingSoundEffect.isValid())
            this._onStopRecordingWithSoundEffect();
        else
            super._onStopRecording();
    }

    _onStopRecordingWithSoundEffect() {
        this.stopRecordingSoundEffect.onStartCallback = () => {
            super._onStopRecording();
            this.deactivate();
        };
        this.stopRecordingSoundEffect.onStopCallback = () => {
            this.activate()
        };
        this.stopRecordingSoundEffect.playSound();
    }
}