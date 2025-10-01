import {Recorder} from "./Recorder.jsm";

export class BaseRecorder extends Recorder {

    constructor() {
        super();
        if (this.constructor === BaseRecorder)
            throw new Error("Cannot create an instance of Recorder abstract class");

        this.recorder = null;
        this.eventBus = null;
        this.sourceID = '';
        this.gainNodeValue = 1;
    }

    setGainNodeValue(value) {
        this.gainNodeValue = value;
    }

    startRecording(originalStream) {
        this._clearRecorder();

        const audioContext = AudioContextSingleton.getOrCreate();
        return audioContext.resume().then(() => {
            const stream =
                this._shouldIncreaseAmplitude()
                    ? this._createStreamWithAdjustedAmplitude(originalStream, audioContext)
                    : originalStream;
            this.recorder = RecordRTC(stream, this._getOptions());
            this.recorder.startRecording();
            this._onStartRecordingCallback();
            console.log("stream", stream);
            return stream;
        });
    }

    _createStreamWithAdjustedAmplitude(stream, audioContext) {
        console.log("Execute _createStreamWithAdjustedAmplitude");
        const source = audioContext.createMediaStreamSource(stream);
        const gainNode = audioContext.createGain();
        const destination = audioContext.createMediaStreamDestination();

        const gainValue = this.gainNodeValue;
        gainNode.gain.value = gainValue;

        source.connect(gainNode);
        gainNode.connect(destination);

        return destination.stream;
    }

    /**
    * Check if stream have
    *
    * Note on iOS compatibility: The autoGainControl setting is not supported on iOS and some microphones.
    * As a result, recording volume is not automatically adjusted, which may cause recordings to be too quiet
    * on these devices.
    */
    _shouldIncreaseAmplitude() {
        console.log("shouldIncreaseAmplitude: " + !navigator.mediaDevices.getSupportedConstraints().autoGainControl);
        return !navigator.mediaDevices.getSupportedConstraints().autoGainControl && this.gainNodeValue !== 1;
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

    sendValueChangedEmptyEvent() {
        this._sendValueChangedEventCallback(this, 'empty');
    }

    sendPreDestroyedEmptyEvent() {
        if (!this.eventBus) {
            return;
        }

        const eventData = {
            'source': this.sourceID,
            'item': 'recorder',
            'value': 'empty',
        };
        this.eventBus.sendEvent('PreDestroyed', eventData);
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
        if (!self.eventBus) {
            return;
        }

        const eventData = {
            'source': self.sourceID,
            'item': 'recorder',
            'value': value,
            'score': ''
        };
        self.eventBus.sendEvent('ValueChanged', eventData);
    }

    _getOptions() {
        throw new Error("GetOptions accessor is not implemented");
    }
}
