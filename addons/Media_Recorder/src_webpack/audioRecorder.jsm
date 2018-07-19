import {Recorder} from "./recorder.jsm";

export class AudioRecorder extends Recorder {

    constructor() {
        super();
        this.microphone = null;
        this.recorder = null;
        this.options = {
            type: 'audio',
            numberOfAudioChannels: 2,
            checkForInactiveTracks: true,
            bufferSize: 16384
        };
        this.resources = new Promise(resolve => resolve(null));
        this.callback;
    }

    record() {
        this.captureMicrophone();
    }

    stopRecording() {
        this.recorder.stopRecording(() => {
                let blob = this.recorder.getBlob();
                this.callback(blob)
            }
        )
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
        }).catch(function (error) {
            console.error(error);
        });
    }

    clearRecorder() {
        if (this.recorder) {
            this.recorder.destroy();
            this.recorder = null;
        }
    }

    set onAvailableResources(callback) {
        this.callback = callback;
    }
}