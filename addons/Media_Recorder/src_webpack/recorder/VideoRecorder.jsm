import {BaseRecorder} from "./baseRecorder.jsm";

export class VideoRecorder extends BaseRecorder {

    _getOptions() {
        return {
            type: 'video'
        }
    }
}