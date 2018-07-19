import {RecordButton} from "../recordButton.jsm";

export class RecordButtonStopSoundDecorator extends RecordButton {

    constructor(button, stopRecordingSoundEffect) {
        super(button.$button, button.state, button.timer, button.recorder, button.recordTimerLimiter);
        this.stopRecordingSoundEffect = stopRecordingSoundEffect;
        this.state = button.state;
    }

    onStopRecording(event) {
        this.stopRecordingSoundEffect.onStartCallback = () => {
            super.deactivate();
            super.onStopRecording(event);
            this.state.setRecording();
        };

        this.stopRecordingSoundEffect.onStopCallback = () => {
            super.activate();
            this.state.setLoaded();
        };

        this.stopRecordingSoundEffect.playSound()
    }
}
