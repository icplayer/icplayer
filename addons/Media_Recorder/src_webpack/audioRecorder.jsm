import {Recorder} from "./recorder.jsm";

export class AudioRecorder extends Recorder {
    constructor() {
        super();
        this.options = {
            type: 'audio',
            numberOfAudioChannels: 2,
            checkForInactiveTracks: true,
            bufferSize: 16384
        };
    }

    startRecording(startRecordingCallback) {
        this.startRecordingCallback = startRecordingCallback;
        this.captureMicrophone();
    }

    stopRecording() {
        this.recorder.stopRecording(() =>
            this.callbackRecording(this.recorder.getBlob())
        );
    }

    captureMicrophone() {
        let self = this;
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(function (mic) {
            self.microphone = mic;
            self.clearRecorder();
            self.recorder = RecordRTC(self.microphone, self.options);
            self.recorder.startRecording();
            self.callbackResources(self.microphone);
            self.startRecordingCallback();
        }).catch(function (error) {
            console.error("captureMicrophone error");
            console.error(error);
        });
    }

    clearRecorder() {
        if (this.recorder) {
            this.recorder.destroy();
            this.recorder = null;
        }
    }

    set onAvailableResources(callbackResources) {
        this.callbackResources = callbackResources;
    }

    set onAvailableRecording(callbackRecording) {
        this.callbackRecording = callbackRecording;
    }
}