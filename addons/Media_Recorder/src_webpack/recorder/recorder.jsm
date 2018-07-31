export class Recorder {

    constructor() {
        if (this.constructor === Recorder)
            throw new Error("Cannot create an instance of Recorder abstract class");

        this.onAvailableRecordingCallback = blob => {};
    }

    startRecording(stream) {
        throw new Error("StartRecording method is not implemented");

    }

    stopRecording() {
        throw new Error("StopRecording method is not implemented");
    }

    set onAvailableRecording(callback) {
        this.onAvailableRecordingCallback = blob => callback(blob);
    }
}