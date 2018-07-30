import {AudioRecorder} from "./audioRecorder.jsm";
import {VideoRecorder} from "./videoRecorder.jsm";

export class RecorderFactory {
    constructor(ERROR_MESSAGE) {
        this.ERROR_MESSAGE = ERROR_MESSAGE;
    }

    createRecorder(type) {
        switch (type) {
            case "audio":
                return new AudioRecorder();
            case "video":
                return new VideoRecorder();
            default:
                throw Error(this.ERROR_MESSAGE);
        }
    }
}