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

    setRecording(recording){
        throw new Error("SetRecording method is not implemented");
    }

    set onEndedPlaying(callback){
        throw new Error("OnEndedPlaying mutator is not implemented");
    }

    set onDurationChanged(callback){
        throw new Error("OnDurationChange mutator is not implemented");
    }
}