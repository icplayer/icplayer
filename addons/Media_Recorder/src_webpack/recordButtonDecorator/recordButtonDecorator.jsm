import {SoundEffect} from "../soundEffect.jsm";
import {RecordButtonStartSoundDecorator} from "./recordButtonStartSoundDecorator.jsm";
import {RecordButtonStopSoundDecorator} from "./recordButtonStopSoundDecorator.jsm";

export class RecordButtonDecorator {

    constructor(startRecordingSound, stopRecordingSound, $recordingWrapper) {
        this.startRecordingSound = startRecordingSound;
        this.stopRecordingSound = stopRecordingSound;
        this.$recordingWrapper = $recordingWrapper;
    }

    decorateStartRecordingSoundEffect(recordButton) {
        this.startRecordingSoundEffect = new SoundEffect(this.startRecordingSound, this.$recordingWrapper);
        return this.startRecordingSoundEffect.isValid()
            ? new RecordButtonStartSoundDecorator(recordButton, this.startRecordingSoundEffect, this.stopRecordingSoundEffect)
            : recordButton;
    }

    decorateStopRecordingSoundEffect(recordButton) {
        this.stopRecordingSoundEffect = new SoundEffect(this.stopRecordingSound, this.$recordingWrapper);
        return this.stopRecordingSoundEffect.isValid()
            ? new RecordButtonStopSoundDecorator(recordButton, this.startRecordingSoundEffect, this.stopRecordingSoundEffect)
            : recordButton;
    }
}