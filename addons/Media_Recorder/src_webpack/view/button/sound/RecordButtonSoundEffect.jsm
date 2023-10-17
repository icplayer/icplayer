import {RecordButton} from "../RecordButton.jsm";

export class RecordButtonSoundEffect extends RecordButton {

    constructor(recordButton, startRecordingSoundEffect, stopRecordingSoundEffect) {
        super({$view: recordButton.$view, state: recordButton.state});
        this.startRecordingSoundEffect = startRecordingSoundEffect;
        this.stopRecordingSoundEffect = stopRecordingSoundEffect;
    }

    _startRecording() {
        if (this.startRecordingSoundEffect.isValid()) {
            this._recordWithSoundEffect();
        } else if (this._isKeyboardControllerNavigationActive()) {
            this._recordWithTTS();
        } else {
            super._startRecording();
        }
    }

    _recordWithSoundEffect() {
        this.startRecordingSoundEffect.onStartCallback = () => {
        };
        this.startRecordingSoundEffect.onStopCallback = () => {
        };
        super._startRecording();
        this._playStartRecordingSoundEffect();

        if (this._isKeyboardControllerNavigationActive()) {
            this._keyboardController.onStartRecordingWhenSoundEffect();
        }
    }

    _playStartRecordingSoundEffect() {
        if (this.startRecordingSoundEffect.isBrowserRequiredReloadNode())
            setTimeout(() => this.startRecordingSoundEffect.playSound(), 1000);
        else
            this.startRecordingSoundEffect.playSound()
    }

    _recordWithTTS() {
        const callbackFunction = super._startRecording.bind(this);
        this._keyboardController.onStartRecording(callbackFunction);
    }

    _stopRecording() {
        if (this._keyboardController.isCurrentElementDisabled()) return;

        if (this.stopRecordingSoundEffect.isValid()) {
            this._onStopRecordingWithSoundEffect();
        } else if (this._isKeyboardControllerNavigationActive()) {
            this._onStopRecordingWithTTS();
        } else {
            super._stopRecording();
        }
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

        if (this._isKeyboardControllerNavigationActive()) {
            this._keyboardController.onStopRecordingWhenSoundEffect();
        }
    }

    _onStopRecordingWithTTS() {
        super._stopRecording();
        this._keyboardController.onStopRecording();
    }

    _isKeyboardControllerNavigationActive () {
        return this._keyboardController.keyboardNavigationActive === true;
    }
}
