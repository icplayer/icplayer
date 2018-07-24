export class Player {
    constructor() {
        if (this.constructor === Player)
            throw new Error("Cannot create an instance of abstract class");
    }

    play() {
        throw new Error("Play method is not implemented");
    }

    stop() {
        throw new Error("Stop method is not implemented");
    }

    set onStartPlaying(callback){
        throw new Error("OnStartPlaying mutator is not implemented");
    }

    set onStopPlaying(callback){
        throw new Error("OnStopPlaying mutator is not implemented");
    }

    set recording(recording) {
        throw new Error("Recording mutator is not implemented");
    }

    set onDurationChange(callback){
        throw new Error("OnDurationChange mutator is not implemented");
    }
}