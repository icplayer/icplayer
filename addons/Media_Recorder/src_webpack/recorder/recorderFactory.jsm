import {VideoRecorder} from "./videoRecorder.jsm";
import {AudioRecorder} from "./audioRecorder.jsm";

export function createRecorder(type, SUPPORTED_TYPES, ERROR_MESSAGE) {
    switch (type) {
        case SUPPORTED_TYPES.AUDIO:
            return new AudioRecorder();
        case SUPPORTED_TYPES.VIDEO:
            return new VideoRecorder();
        default:
            throw Error(ERROR_MESSAGE);
    }
}