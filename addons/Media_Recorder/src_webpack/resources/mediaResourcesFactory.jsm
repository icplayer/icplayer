import {AudioMediaResources} from "./audioMediaResources.jsm";
import {VideoMediaResources} from "./videoMediaResources.jsm";

export function createMediaResources(type, view, SUPPORTED_TYPES, ERROR_MESSAGE) {
    switch (type) {
        case SUPPORTED_TYPES.AUDIO:
            return new AudioMediaResources(view);
        case SUPPORTED_TYPES.VIDEO:
            return new VideoMediaResources(view);
        default:
            throw Error(ERROR_MESSAGE);
    }
}