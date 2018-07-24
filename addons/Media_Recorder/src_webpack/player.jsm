export class Player {
    constructor() {
        this.onPlayCallback = () => {};
        this.onStopCallback = () => {};

        if (this.constructor === Player)
            throw new Error("Cannot create an instance of abstract class");
    }

    set onPlay(callback){
        this.onPlayCallback = callback;
    }

    set onStop(callback){
        this.onStopCallback = callback;
    }

    play() {
        throw new Error("Play method is not implemented");
    }

    stop() {
        throw new Error("Stop method is not implemented");
    }

    set recording(recording) {
        throw new Error("Recording mutator is not implemented");
    }

    set onEndedPlaying(callback){
        throw new Error("OnEndedPlaying mutator is not implemented");
    }
}