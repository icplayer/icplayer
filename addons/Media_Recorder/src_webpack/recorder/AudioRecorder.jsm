import {BaseRecorder} from "./BaseRecorder.jsm";

export class AudioRecorder extends BaseRecorder {

    _getOptions() {
        const isEdge = DevicesUtils.isEdge();
        const isSafari = DevicesUtils.getBrowserVersion().toLowerCase().indexOf("safari") > -1;

        let options = {
            type: 'audio',
            numberOfAudioChannels: isEdge ? 1 : 2,
            checkForInactiveTracks: true,
            bufferSize: 16384,
            disableLogs: true,
        };

        if (isSafari) {
            options.recorderType = StereoAudioRecorder;
            options.bufferSize = 4096;
            options.sampleRate = 44100;
        }

        return options;
    }
}