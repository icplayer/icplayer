export class Player {

    constructor() {
        if (this.constructor === Player)
            throw new Error("Cannot create an instance of Player abstract class");
    }

    setRecording(source) {
        throw new Error("SetRecording method is not implemented");
    }

    startPlaying() {
        throw new Error("StartPlaying method is not implemented");
    }

    stopPlaying() {
        throw new Error("StopPlaying method is not implemented");
    }

    startStreaming(stream) {
        throw new Error("StartStreaming method is not implemented");
    }

    stopStreaming() {
        throw new Error("StopStreaming method is not implemented");
    }

    reset() {
        throw new Error("Reset method is not implemented");
    }

    destroy() {
        throw new Error("Destroy method is not implemented");
    }

    setEventBus(sourceID, itemName, eventBus) {
        throw new Error("setEventBus method is not implemented");
    }

    getDuration() {
        throw new Error("getDuration method is not implemented");
    }

    set onStartLoading(callback) {
        this.onStartLoadingCallback = () => callback();
    }

    set onEndLoading(callback) {
        this.onEndLoadingCallback = () => callback();
    }

    set onEndPlaying(callback) {
        this.onEndPlayingCallback = () => callback();
    }

    set onDurationChange(callback) {
        this.onDurationChangeCallback = duration => callback(duration);
    }
}