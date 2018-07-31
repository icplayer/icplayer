import {MediaResources} from "./mediaResources.jsm";

export class AudioMediaResources extends MediaResources {

    _getOptions() {
        return {
            audio: true
        }
    }
}