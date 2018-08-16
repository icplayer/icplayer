import {SupportedTypes} from "../confiuration/SupportedTypes.jsm";
import {Errors} from "../validation/Errors.jsm";
import {AudioPlayer} from "./AudioPlayer.jsm";
import {VideoPlayer} from "./VideoPlayer.jsm";

export class PlayerFactory {

    static create({$view, type}) {
        switch (type) {
            case SupportedTypes.AUDIO:
                return new AudioPlayer($view);
            case SupportedTypes.VIDEO:
                return new VideoPlayer($view);
            default:
                throw Error(Errors.type_EV01);
        }
    }
}