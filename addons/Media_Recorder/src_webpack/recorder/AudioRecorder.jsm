import {BaseRecorder} from "./baseRecorder.jsm";

export class AudioRecorder extends BaseRecorder {

    _getOptions() {
        return {
            type: 'audio',
            numberOfAudioChannels: DevicesUtils.isEdge() ? 1 : 2,
            checkForInactiveTracks: true,
            bufferSize: 16384,
            disableLogs: true,
        }
    }
}