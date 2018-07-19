export class Recorder {
    constructor() {
        if (this.constructor === Recorder)
            throw new Error("Cannot create an instance of abstract class");
    }

    record(mediaRecorderPlayerWrapper) {
        throw new Error("Record method is not implemented");
    }

    stopRecording(mediaRecorderPlayerWrapper) {
        throw new Error("Stop Recording method is not implemented");
    }

    set onAvailableResources(callback){
        throw new Error("OnAvailableResources mutator is not implemented");
    }
}