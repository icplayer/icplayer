import {BlobService} from "../service/BlobService.jsm";

export class AddonState {

    constructor() {
        this.recording = null;
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

    reset() {
        this.recording = null;
    }
}