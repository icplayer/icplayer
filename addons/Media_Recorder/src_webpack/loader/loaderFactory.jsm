import {AudioLoader} from "./audioLoader";
import {VideoLoader} from "./videoLoader";

export function createLoader(type, SUPPORTED_TYPES, ERROR_MESSAGE, $view) {
    switch (type) {
        case SUPPORTED_TYPES.AUDIO:
            return new AudioLoader($view);
        case SUPPORTED_TYPES.VIDEO:
            return new VideoLoader($view);
        default:
            throw Error(ERROR_MESSAGE);
    }
}