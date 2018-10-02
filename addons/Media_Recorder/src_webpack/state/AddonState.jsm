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
        debugger;
        return new Promise(resolve => {
            if (this.visibility != null)
                resolve(this.visibility);
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