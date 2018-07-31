import {MediaResources} from "./mediaResources.jsm";

export class VideoMediaResources extends MediaResources {

    _getOptions() {
        return {
            audio: true,
            video: true
        }
    }
}