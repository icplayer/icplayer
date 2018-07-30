export class VideoRecorder {

    constructor() {
        this.recorder = null;
        this.options = {
            type: 'video'
        };

        this.onAvailableRecording = blob => {};
    }

    startRecording(stream) {
        this._clearRecorder();
        this.recorder = RecordRTC(stream, this.options);
        this.recorder.startRecording();
    }

    stopRecording() {
        let self = this;
        this.recorder.stopRecording(() => {
            self.onAvailableRecording(this.recorder.getBlob());
        });
    }

    _clearRecorder() {
        if (this.recorder) {
            this.recorder.destroy();
            this.recorder = null;
        }
    }
}