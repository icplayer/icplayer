import {AudioRecorder} from "./audioRecorder.jsm";

export class RecorderFactory {

    constructor(ERROR_CODES) {
        this.ERROR_CODES = ERROR_CODES;
    }

    createRecorder(type) {
        if (type === "audio") {
            return new AudioRecorder();
        } else {
            throw Error(this.ERROR_CODES.type_EV01);
        }
    }
}