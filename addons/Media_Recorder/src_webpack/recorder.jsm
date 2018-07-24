export class Recorder {
    constructor() {
        this.onAvailableResourcesCallback = () => {};
        this.onAvailableRecordingCallback = () => {};

        if (this.constructor === Recorder)
            throw new Error("Cannot create an instance of abstract class");
    }

    set onAvailableResources(callback) {
        this.onAvailableResourcesCallback = callback;
    }

    set onAvailableRecording(callback) {
        this.onAvailableRecordingCallback = callback;
    }

    startRecording(mediaRecorderPlayerWrapper) {
        throw new Error("StartRecording method is not implemented");
    }

    stopRecording(mediaRecorderPlayerWrapper) {
        throw new Error("StopRecording Recording method is not implemented");
    }
}