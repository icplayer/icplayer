export class RecordingState {
    constructor() {
        this.values = {
            NEW: 0,
            RECORDING: 1,
            LOADED: 2,
            PLAYING: 3
        };
        this.value = this.values.NEW;
    };

    isNew() {
        return this.value === this.values.NEW;
    }

    isRecording() {
        return this.value === this.values.RECORDING;
    }

    isLoaded() {
        return this.value === this.values.LOADED;
    }

    isPlaying() {
        return this.value === this.values.PLAYING;
    }

    setRecording() {
        this.value = this.values.RECORDING;
    }

    setLoaded() {
        this.value = this.values.LOADED;
    }

    setPlaying() {
        this.value = this.values.PLAYING;
    }
}