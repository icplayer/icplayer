import {BaseRecorder} from "./baseRecorder.jsm";

export class AudioRecorder extends BaseRecorder {

    _getOptions() {
        return {
            type: 'audio',
            numberOfAudioChannels: 2,
            sampleRate: 48000,
            bufferSize: 16384,
            disableLogs: true
        }
    }
}