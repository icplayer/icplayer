import {Recorder} from "./recorder.jsm";

export class VideoRecorder extends Recorder {
    constructor() {
        super();
        this.recorderOptions = {
            type: 'video'
        };
        this.resourcesOptions = {
            audio: true,
            video: true
        };
    }

    startRecording(startRecordingCallback) {
        let self = this;
        navigator.mediaDevices.getUserMedia(this.resourcesOptions)
            .then(stream => {
                startRecordingCallback();
                self.onAvailableResourcesCallback(stream);
                self.record(stream)
            })
            .catch(error => console.error(error));
    }

    stopRecording(stopRecordingCallback) {
        let self = this;
        this.recorder.stopRecording(() => {
            stopRecordingCallback();
            self.onAvailableRecordingCallback(this.recorder.getBlob());
        });
    }

    record(stream) {
        this.clearRecorder();
        this.recorder = RecordRTC(stream, this.recorderOptions);
        this.recorder.startRecording();
    }

    clearRecorder() {
        if (this.recorder) {
            this.recorder.destroy();
            this.recorder = null;
        }
    }

    set onAvailableResources(callback) {
        this.onAvailableResourcesCallback = callback;
    }

    set onAvailableRecording(callback) {
        this.onAvailableRecordingCallback = callback;
    }
}