import {SupportedTypes} from "../confiuration/SupportedTypes.jsm";
import {Errors} from "../validation/Errors.jsm";
import {AudioRecorder} from "./AudioRecorder.jsm";
import {VideoRecorder} from "./VideoRecorder.jsm";

export class RecorderFactory {

    static create({$view, type}) {
        switch (type) {
            case SupportedTypes.AUDIO:
                return new AudioRecorder($view);
            case SupportedTypes.VIDEO:
                return new VideoRecorder($view);
            default:
                throw Error(Errors.type_EV01);
        }
    }
}