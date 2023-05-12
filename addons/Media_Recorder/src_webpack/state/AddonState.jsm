import {BlobService} from "./service/BlobService.jsm";

export class AddonState {

    constructor() {
        this.recording = null;
        this.visibility = null;
        this.enabled = null;
        this.mp3ConvertHandler = null;
    }

    setMP3ConvertHandler(handler) {
        this.mp3ConvertHandler = handler;
    }

    setRecordingBlob(blob) {
        BlobService.serialize(blob)
            .then(recording => this.recording = recording);
    }

    setRecordingBase64(recording) {
        this.recording = recording;
    }

    getRecordingBlob() {
        return new Promise(resolve => {
            if (this.recording)
                resolve(BlobService.deserialize(this.recording));
        });
    }

    isEmpty() {
        return this.recording == null;
    }

    isMP3Format(blob) {
        return !this.isEmpty() && blob.type.includes("audio/mpeg");
    }

    isWAVFormat(blob) {
        return !this.isEmpty() && blob.type.includes("audio/wav");
    }

    getMP3File() {
        return this.getMP3Blob()
        .then(mp3Blob => {
            return new File([mp3Blob], "recording.mp3");
        });
    }

    getMP3Blob() {
        return this.getRecordingBlob()
        .then(blob => {
            if (this.isMP3Format(blob)) {
                return blob;
            }
            if (!!this.mp3ConvertHandler && this.mp3ConvertHandler.wasCreated()) {
                return this.convertWavBlobToMP3BlobByWorker(blob);
            }
            return this.convertWavBlobToMP3Blob(blob);
        })
    }

    convertWavBlobToMP3BlobByWorker(wavBlob) {
        return this.decodeVawBlobData(wavBlob)
        .then(decodedData => {
            return BlobService.getMp3BlobFromDecodedDataByWorker(this.mp3ConvertHandler, decodedData);
        })
    }

    convertWavBlobToMP3Blob(wavBlob) {
        return this.decodeVawBlobData(wavBlob)
        .then(decodedData => {
            return BlobService.getMp3BlobFromDecodedData(decodedData);
        })
    }

    decodeVawBlobData(wavBlob) {
        return new Promise(resolve => {
            resolve(wavBlob);
        }).then(wavBlob => {
            File.prototype.arrayBuffer = File.prototype.arrayBuffer || this._fixArrayBuffer;
            Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || this._fixArrayBuffer;

            return blob.arrayBuffer();
        })
        .then(arrayBuffer => {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            var context = new AudioContext();
            return context.decodeAudioData(arrayBuffer);
        })
    }

    setVisibility(isVisible) {
        this.visibility = isVisible ? true : false;
    }

    getVisibility() {
        var self = this;
        return new Promise(resolve => {
            if (self.visibility != null)
                resolve(self.visibility);
        });
    }

    setEnabled(isEnable) {
        this.enabled = isEnable ? true : false;
    }

    getEnabled(){
        var self = this;
        return new Promise(resolve => {
            if (self.enabled != null)
                resolve(self.enabled);
        });
    }

    getState() {
        let state = {
            recording: this.recording,
            visibility: this.visibility,
            enabled: this.enabled,
        }
        return JSON.stringify(state);
    }

    reset() {
        this.recording = null;
        this.visibility = null;
        this.enabled = null;
    }

    destroy() {
        this.recording = null;
        this.visibility = null;
        this.enabled = null;
        this.mp3ConvertHandler = null;
    }
}