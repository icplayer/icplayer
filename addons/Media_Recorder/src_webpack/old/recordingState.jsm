export class RecordingState {
    constructor() {
        this.values = {
            NEW: 0,
            RECORDING: 1,
            LOADING: 2,
            LOADED: 3,
            PLAYING: 4
        };
        this.value = this.values.NEW;
    };

    isNew() {
        return this.value === this.values.NEW;
    }

    isRecording() {
        return this.value === this.values.RECORDING;
    }

    isLoading() {
        return this.value === this.values.LOADING;
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

    setLoading(){
        this.value = this.values.LOADING;
    }

    setLoaded() {
        this.value = this.values.LOADED;
    }

    setPlaying() {
        this.value = this.values.PLAYING;
    }


}