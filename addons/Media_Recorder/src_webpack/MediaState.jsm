export class MediaState {

    values = {
        NEW: 0,
        BLOCKED: 1,         // waiting for a resources permit
        RECORDING: 2,
        LOADING: 3,
        LOADED: 4,
        PLAYING: 5
    };

    constructor() {
        this._value = this.values.NEW;
    };

    isNew() {
        return this._value === this.values.NEW;
    }

    isRecording() {
        return this._value === this.values.RECORDING;
    }

    isLoading() {
        return this._value === this.values.LOADING;
    }

    isLoaded() {
        return this._value === this.values.LOADED;
    }

    isPlaying() {
        return this._value === this.values.PLAYING;
    }

    isBlocked() {
        return this._value === this.values.BLOCKED;
    }

    setNew(){
        this._value = this.values.NEW;
    }

    setRecording() {
        this._value = this.values.RECORDING;
    }

    setLoading(){
        this._value = this.values.LOADING;
    }

    setLoaded() {
        this._value = this.values.LOADED;
    }

    setPlaying() {
        this._value = this.values.PLAYING;
    }

    setBlocked(){
        this._value = this.values.BLOCKED;
    }
}