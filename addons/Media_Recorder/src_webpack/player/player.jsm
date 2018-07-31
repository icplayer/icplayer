export class Player {

    constructor() {
        if (this.constructor === Player)
            throw new Error("Cannot create an instance of Player abstract class");

        this.onStartPlayingCallback = stream => {};
        this.onStopPlayingCallback = () => {};
        this.onDurationChangeCallback = duration => {};
        this.onEndedPlayingCallback = () => {};
        this.onStartLoadingCallback = () => {};
        this.onEndLoadingCallback = () => {};
    }

    startPlaying() {
        throw new Error("StartPlaying method is not implemented");
    }

    stopPlaying() {
        throw new Error("StopPlaying method is not implemented");
    }

    setRecording(source) {
        throw new Error("SetRecording method is not implemented");
    }

    startStreaming(stream) {
        throw new Error("StartStreaming method is not implemented");
    }

    stopStreaming() {
        throw new Error("StopStreaming method is not implemented");
    }

    set onStartPlaying(callback) {
        this.onStartPlayingCallback = stream => callback(stream);
    }

    set onStopPlaying(callback) {
        this.onStopPlayingCallback = () => callback();
    }

    set onDurationChange(callback) {
        this.onDurationChangeCallback = duration => callback(duration);
    }

    set onEndedPlaying(callback) {
        this.onEndedPlayingCallback = () => callback();
    }

    set onStartLoading(callback) {
        this.onStartLoadingCallback = () => callback();
    }

    set onEndLoading(callback) {
        this.onEndLoadingCallback = () => callback();
    }
}