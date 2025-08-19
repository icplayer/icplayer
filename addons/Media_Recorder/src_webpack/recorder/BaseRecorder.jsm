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
        const audioContext = AudioContextSingleton.getOrCreate();
        this.recorder = RecordRTC(stream, this._getOptions());
        audioContext.resume().then(() => {
            this.recorder.startRecording();
            this._onStartRecordingCallback();
        });
    }

    stopRecording() {
        const self = this;
        let promise = new Promise(
            resolve => self.recorder.stopRecording(
                () => resolve(self.recorder.getBlob())
            )
        );
        promise.then(() => self._onStopRecordingCallback(self));

        return promise;
    }

    setEventBus(eventBus, sourceID) {
        this.eventBus = eventBus;
        this.sourceID = sourceID;
    }

    sendEmptyRecorderValueChangedEvent() {
        this._sendValueChangedEventCallback(this, 'empty');
    }

    sendEmptyRecorderPreDestroyedEvent() {
        if (this.eventBus) {
            var eventData = {
                'source': this.sourceID,
                'item': 'recorder',
                'value': 'empty',
            };
            this.eventBus.sendEvent('PreDestroyed', eventData);
        }
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
        this._sendValueChangedEventCallback(this, 'start');
    }

    _onStopRecordingCallback(self) {
        self._sendValueChangedEventCallback(self, 'stop');
    }

    _sendValueChangedEventCallback(self, value) {
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