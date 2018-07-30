export class State {
    constructor() {
        this.mediaSource = null;
    }

    setMediaSource(mediaSource) {
        this.mediaSource = mediaSource;
    }

    serialize() {
        return JSON.stringify({
            mediaSource: this.mediaSource
        })
    }

    deserialize(state) {
        let deserializedState = JSON.parse(state);
        if (deserializedState.mediaSource)
            this.mediaSource = deserializedState.mediaSource;
    }
}