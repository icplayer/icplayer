export class RecordingState{

    constructor() {
        this.mediaSource = null;
    }

    setMediaSource(mediaSource) {
        this.mediaSource = mediaSource;
    }

    getMediaSource() {
        return this.mediaSource;
    }

    reset(){
        this.mediaSource = null;
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