import {BlobService} from "./service/BlobService.jsm";

export class AddonState {

    constructor() {
        this.recording = null;
        this.visibility = null;
        this.enabled = null;
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

    getMP3File() {
        return this.getRecordingBlob().then(blob => {
            File.prototype.arrayBuffer = File.prototype.arrayBuffer || this._fixArrayBuffer;
            Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || this._fixArrayBuffer;

            return blob.arrayBuffer();
        })
        .then(arrayBuffer => {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            var context = new AudioContext();
            return context.decodeAudioData(arrayBuffer);
        })
        .then(decodedData => {
            const mp3Blob = BlobService.getMp3BlobFromDecodedData(decodedData);
            return new File([mp3Blob], "recording.mp3");
        });
    }

    //for some reason there is a bug in some lower Safari versions <14, it cause arrayBuffer() undefined
    //https://gist.github.com/hanayashiki/8dac237671343e7f0b15de617b0051bd
    _fixArrayBuffer() {
        return new Promise((resolve) => {
            let fr = new FileReader();
            fr.onload = () => {
              resolve(fr.result);
            };
            fr.readAsArrayBuffer(this);
          });
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

    reset() {
        this.recording = null;
        this.visibility = null;
        this.enabled = null;
    }

    destroy() {
        this.recording = null;
        this.visibility = null;
        this.enabled = null;
    }
}