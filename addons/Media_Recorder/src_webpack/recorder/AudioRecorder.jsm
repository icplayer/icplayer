import {BaseRecorder} from "./BaseRecorder.jsm";

export class AudioRecorder extends BaseRecorder {

    _getOptions() {
        const isEdge = DevicesUtils.isEdge();

        return {
            type: 'audio',
            mimeType: 'audio/wav',
            numberOfAudioChannels: 1,
            checkForInactiveTracks: true,
            bufferSize: 16384,
            disableLogs: true,
            recorderType: RecordRTC.StereoAudioRecorder,
            desiredSampRate: 22050
        };
    }
}
