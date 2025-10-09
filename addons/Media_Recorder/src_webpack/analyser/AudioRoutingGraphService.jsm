import {AnalyserProvider} from "./AnalyserProvider.jsm";

export class AudioRoutingGraphService {

    constructor() {
        this.mediaStreamSource = null;
        this.mediaElementSource = null;
        this.gainNode = null;
        this.analyser = null;

        this.gainNodeValue = 2.5;
    }

    createGraphToRecord(stream) {
        return new Promise(resolve => {
            // on Chrome when user hasn't interacted with the page before AudioContext was created it will be created in suspended state
            // this will happen if MediaRecorder is on the first page user visits (constructor call will happen before user interaction)
            // resume is then needed to unblock AudioContext (see https://goo.gl/7K7WLu)
            const audioContext = AudioContextSingleton.getOrCreate();
            audioContext.resume().then(
                () => {
                    this.mediaStreamSource = audioContext.createMediaStreamSource(stream);
                    this._ensureAnalyserExist(audioContext);

                    if (this._shouldAddAutoGainNode()) {
                        this._ensureGainNodeExist(audioContext);
                        this.mediaStreamSource.connect(this.gainNode);
                        this.gainNode.connect(this.analyser);
                    } else {
                        this.mediaStreamSource.connect(this.analyser);
                    }

                    const destination = audioContext.createMediaStreamDestination();
                    this.analyser.connect(destination);

                    resolve(destination.stream);
                }
            );
        })
    }

    _ensureGainNodeExist(audioContext) {
        if (!this.gainNode) {
            this.gainNode = audioContext.createGain();
            this.gainNode.gain.value = this.gainNodeValue;
        }
    }

    _ensureAnalyserExist(audioContext) {
        if (!this.analyser) {
            this.analyser = AnalyserProvider.create(audioContext);
        }
    }

    getAnalyser() {
        return this.analyser;
    }

    /**
    * Check if auto gain node should be added to adjust recording volume
    *
    * Note on iOS compatibility: The autoGainControl setting is not supported on Safari and some microphones.
    * As a result, recording volume is not automatically adjusted, which may cause recordings to be too quiet
    * on these devices.
    */
    _shouldAddAutoGainNode() {
        return !navigator.mediaDevices.getSupportedConstraints().autoGainControl;
    }

    createGraphToListen(htmlAudioElement) {
        return new Promise(resolve => {
            // on Chrome when user hasn't interacted with the page before AudioContext was created it will be created in suspended state
            // this will happen if MediaRecorder is on the first page user visits (constructor call will happen before user interaction)
            // resume is then needed to unblock AudioContext (see https://goo.gl/7K7WLu)
            const audioContext = AudioContextSingleton.getOrCreate();
            audioContext.resume().then(
                () => {
                    if (!this.mediaElementSource) {
                        this.mediaElementSource = audioContext.createMediaElementSource(htmlAudioElement);
                    }

                    this._ensureAnalyserExist(audioContext);
                    this.mediaElementSource.connect(this.analyser);
                    this.analyser.connect(audioContext.destination);

                    resolve(this.analyser);
                }
            );
        })
    }

    disconnectGraph() {
        if (this.mediaStreamSource) {
            this.mediaStreamSource.disconnect();
        }
        if (this.mediaElementSource) {
            this.mediaElementSource.disconnect();
        }
        if (this.analyser) {
            this.analyser.disconnect();
        }
        if (this.gainNode) {
            this.gainNode.disconnect();
        }
    }

    destroy() {
        this.disconnectGraph();
        AudioContextSingleton.close();
        this.mediaElementSource = null;
        this.mediaStreamSource = null;
        this.analyser = null;
    }
}
