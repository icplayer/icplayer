export class State {

    constructor() {
        this._values = {
            NEW: 0,
            BLOCKED: 1,         // waiting for a resources permit
            RECORDING: 2,
            LOADING: 3,
            LOADED: 4,
            PLAYING: 5
        };
        this._value = this._values.NEW;
    };

    isNew() {
        return this._value === this._values.NEW;
    }

    isRecording() {
        return this._value === this._values.RECORDING;
    }

    isLoading() {
        return this._value === this._values.LOADING;
    }

    isLoaded() {
        return this._value === this._values.LOADED;
    }

    isPlaying() {
        return this._value === this._values.PLAYING;
    }

    isBlocked() {
        return this._value === this._values.BLOCKED;
    }

    setRecording() {
        this._value = this._values.RECORDING;
    }

    setLoading(){
        this._value = this._values.LOADING;
    }

    setLoaded() {
        this._value = this._values.LOADED;
    }

    setPlaying() {
        this._value = this._values.PLAYING;
    }

    setBlocked(){
        this._value = this._values.BLOCKED;
    }
}