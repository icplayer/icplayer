import {Recorder} from "./recorder.jsm";

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
        let self = this;
        this.recorder.stopRecording(() => {
            self.onAvailableRecordingCallback(this.recorder.getBlob());
        });
    }

    _clearRecorder() {
        if (this.recorder) {
            this.recorder.destroy();
            this.recorder = null;
        }
    }

    _getOptions(){
        throw new Error("GetOptions accessor is not implemented");
    }
}