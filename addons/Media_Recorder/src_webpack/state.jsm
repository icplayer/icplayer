export class State {
    constructor() {
        this.NEW = 0;
        this.RECORDING = 1;
        this.LOADED = 2;
        this.PLAYING = 3;
        this.state = 0;
        this.mediaSource;
    };

    isNew() {
        return this.state === this.NEW;
    }

    isRecording() {
        return this.state === this.RECORDING;
    }

    isLoaded() {
        return this.state === this.LOADED;
    }

    isPlaying() {
        return this.state === this.PLAYING;
    }

    setRecording() {
        this.state = this.RECORDING;
    }

    setLoaded() {
        this.state = this.LOADED;
    }

    setPlaying() {
        this.state = this.PLAYING;
    }

    setMediaSource(mediaSource) {
        this.mediaSource = mediaSource;
    }

    serialize() {
        return JSON.stringify({
            state : this.state,
            mediaSource : this.mediaSource
        })
    }

    deserialize(state) {
        let deserializedState = JSON.parse(state);
        if (deserializedState.mediaSource) {
            this.mediaSource = deserializedState.mediaSource;
        }
    }
}