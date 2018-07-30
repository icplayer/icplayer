import {Recorder} from "./recorder.jsm";

export class AudioRecorder extends Recorder {
    constructor() {
        super();
        this.recorderOptions = {
            type: 'audio',
            numberOfAudioChannels: 2,
            checkForInactiveTracks: true,
            bufferSize: 16384
        };
        this.resourcesOptions = {
            audio: true
        };
    }

    startRecording(startRecordingCallback) {
        let self = this;
        navigator.mediaDevices.getUserMedia(this.resourcesOptions)
            .then(stream => {
                self.onStartRecordingCallback();
                self.onAvailableResourcesCallback(stream);
                self.record(stream);
            })
            .catch(error => console.error(error));
    }

    stopRecording(stopRecordingCallback) {
        let self = this;
        this.recorder.stopRecording(() => {
            self.onStopRecordingCallback();
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

    set onStartRecording(callback){
        this.onStartRecordingCallback = callback;
    }

    set onStopRecording(callback){
        this.onStopRecordingCallback = callback;
    }

    set onAvailableResources(callback) {
        this.onAvailableResourcesCallback = callback;
    }

    set onAvailableRecording(callback) {
        this.onAvailableRecordingCallback = callback;
    }
}