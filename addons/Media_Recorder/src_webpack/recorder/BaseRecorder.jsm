import {Recorder} from "./Recorder.jsm";

export class BaseRecorder extends Recorder {

    constructor() {
        super();
        if (this.constructor === BaseRecorder)
            throw new Error("Cannot create an instance of Recorder abstract class");

        this.recorder = null;
        this.eventBus = null;
        this.sourceID = '';
    }

    startRecording(stream) {
        this._clearRecorder();
        this.recorder = RecordRTC(stream, this._getOptions());
        this.recorder.startRecording();
        this._onStartRecordingCallback();
    }

    stopRecording() {
        let promise = new Promise(
            resolve => this.recorder.stopRecording(
                () => resolve(this.recorder.getBlob()))
        );
        let self = this;
        promise.then(() => self._onStopRecordingCallback(self));

        return promise;
    }

    setEventBus(eventBus, sourceID) {
        this.eventBus = eventBus;
        this.sourceID = sourceID;
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

    _onStartRecordingCallback() {
        this._sendEventCallback(this, 'start');
    }

    _onStopRecordingCallback(self) {
        self._sendEventCallback(self, 'stop');
    }

    _sendEventCallback(self, value) {
        if (self.eventBus) {
            var eventData = {
                'source': self.sourceID,
                'item': 'recorder',
                'value': value,
                'score': ''
            };
            self.eventBus.sendEvent('ValueChanged', eventData);
        }
    }

    _getOptions() {
        throw new Error("GetOptions accessor is not implemented");
    }
}