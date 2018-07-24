import {AudioRecorder} from "./audioRecorder.jsm";
import {VideoRecorder} from "./videoRecorder.jsm";

export class RecorderFactory {
    constructor(ERROR_MESSAGE) {
        this.ERROR_MESSAGE = ERROR_MESSAGE;
    }

    createRecorder(type) {
        if (type === "audio") {
            return new AudioRecorder();
        } else if (type === "video") {
            return new VideoRecorder();
        } else {
            throw Error(this.ERROR_MESSAGE);
        }
    }
}