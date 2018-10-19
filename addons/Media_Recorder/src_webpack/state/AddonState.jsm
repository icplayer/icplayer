import {BlobService} from "./service/BlobService.jsm";

export class AddonState {

    constructor() {
        this.recording = null;
        this.visibility = null;
    }

    setRecordingBlob(blob) {
        BlobService.serialize(blob)
            .then(recording => this.recording = recording);
    }

    getRecordingBlob() {
        return new Promise(resolve => {
            if (this.recording)
                resolve(BlobService.deserialize(this.recording));
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

    reset() {
        this.recording = null;
        this.visibility = null;
    }

    destroy() {
        this.recording = null;
        this.visibility = null;
    }
}