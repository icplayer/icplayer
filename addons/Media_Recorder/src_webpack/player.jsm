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

    setResources(resources){
        throw new Error("SetResources method is not implemented");
    }

    set onEndedPlaying(callback){
        throw new Error("OnEndedPlaying mutator is not implemented");
    }
}