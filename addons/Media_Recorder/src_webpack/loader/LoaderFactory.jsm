import {AudioLoader} from "./AudioLoader";
import {VideoLoader} from "./VideoLoader";
import {SupportedTypes as SUPPORTED_TYPES} from "../SupportedTypes.jsm";
import {Errors} from "../validation/Errors.jsm";

export class LoaderFactory {

    static create({$view, type}) {
        switch (type) {
            case SUPPORTED_TYPES.AUDIO:
                return new AudioLoader($view);
            case SUPPORTED_TYPES.VIDEO:
                return new VideoLoader($view);
            default:
                throw Error(Errors.type_EV01);
        }
    }
}