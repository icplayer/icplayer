import {Recorder} from "./Recorder.jsm";

export class BaseRecorder extends Recorder {

    constructor() {
        super();
        if (this.constructor === BaseRecorder)
            throw new Error("Cannot create an instance of Recorder abstract class");

        this.recorder = null;
    }

    startRecording(stream) {
        this._clearRecorder();
        this.recorder = RecordRTC(stream, this._getOptions());
        this.recorder.startRecording();
    }

    stopRecording() {
        return new Promise(
            resolve => this.recorder.stopRecording(
                () => resolve(this.recorder.getBlob()))
        )
    }

    destroy() {
        this.onAvailableRecordingCallback = blob => {
        };

        if (this.recorder) {
            this.recorder.stopRecording();
            this._clearRecorder();
        }
    }

    _clearRecorder() {
        if (this.recorder) {
            this.recorder.destroy();
            this.recorder = null;
        }
    }

    _getOptions() {
        throw new Error("GetOptions accessor is not implemented");
    }
}