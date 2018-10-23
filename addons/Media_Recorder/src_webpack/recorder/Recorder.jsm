export class Recorder {

    constructor() {
        if (this.constructor === Recorder)
            throw new Error("Cannot create an instance of Recorder abstract class");
    }

    startRecording(stream) {
        throw new Error("StartRecording method is not implemented");

    }

    stopRecording() {
        throw new Error("StopRecording method is not implemented");
    }

    setEventBus(eventBus, sourceID) {
        throw new Error("setEventBus method is not implemented");
    }

    destroy() {
        throw new Error("Destroy method is not implemented");
    }
}