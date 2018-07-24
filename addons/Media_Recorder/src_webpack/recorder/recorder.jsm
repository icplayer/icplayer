export class Recorder {
    constructor() {
        if (this.constructor === Recorder)
            throw new Error("Cannot create an instance of abstract class");
    }

    startRecording(startRecordingCallback) {
        throw new Error("StartRecording method is not implemented");
    }

    stopRecording(stopRecordingCallback) {
        throw new Error("StopRecording Recording method is not implemented");
    }

    set onAvailableResources(callback) {
        throw new Error("OnAvailableResources mutator is not implemented");
    }

    set onAvailableRecording(callback) {
        throw new Error("OnAvailableRecording mutator is not implemented");
    }
}