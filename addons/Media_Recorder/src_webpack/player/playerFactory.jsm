import {VideoPlayer} from "./videoPlayer.jsm";
import {AudioPlayer} from "./audioPlayer.jsm";

export function createPlayer(type, SUPPORTED_TYPES, ERROR_MESSAGE, $view) {
    switch (type) {
        case SUPPORTED_TYPES.AUDIO:
            return new AudioPlayer($view);
        case SUPPORTED_TYPES.VIDEO:
            return new VideoPlayer($view);
        default:
            throw Error(ERROR_MESSAGE);
    }
}