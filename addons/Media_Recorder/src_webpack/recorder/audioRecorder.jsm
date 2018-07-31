import {BaseRecorder} from "./baseRecorder.jsm";

export class AudioRecorder extends BaseRecorder {

    _getOptions() {
        return {
            type: 'audio',
            numberOfAudioChannels: 2,
            checkForInactiveTracks: true,
            bufferSize: 16384
        }
    }
}