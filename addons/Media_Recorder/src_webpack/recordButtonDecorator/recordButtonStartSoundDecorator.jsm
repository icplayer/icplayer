import {RecordButton} from "../recordButton.jsm";

export class RecordButtonStartSoundDecorator extends RecordButton {

    constructor(button, startRecordingSoundEffect) {
        super(button.$button, button.state, button.timer, button.recorder, button.recordTimerLimiter, button.soundIntensity, button.player);
        this.startRecordingSoundEffect = startRecordingSoundEffect;
        this.state = button.state;
    }

    onStartRecording(event) {
        this.startRecordingSoundEffect.onStartCallback = () => {
            super.deactivate();
            this.state.setRecording();
        };

        this.startRecordingSoundEffect.onStopCallback = () => {
            super.activate();
            super.onStartRecording(event);
        };

        this.startRecordingSoundEffect.playSound();
    }
}
