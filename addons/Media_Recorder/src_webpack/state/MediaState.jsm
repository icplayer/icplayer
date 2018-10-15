export class MediaState {

    values = {
        NEW: 0,
        BLOCKED: 1,         // waiting for a resources permit
        RECORDING: 2,
        LOADING: 3,
        LOADED: 4,
        PLAYING: 5,
        PLAYING_DEFAULT_RECORDING: 6,
        LOADED_DEFAULT_RECORDING: 7,
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

    isPlayingDefaultRecording() {
        return this._value === this.values.PLAYING_DEFAULT_RECORDING;
    }

    isLoadedDefaultRecording() {
        return this._value === this.values.LOADED_DEFAULT_RECORDING;
    }

    isBlocked() {
        return this._value === this.values.BLOCKED;
    }

    setNew() {
        this._value = this.values.NEW;
        this._logState();
    }

    setRecording() {
        this._value = this.values.RECORDING;
        this._logState();
    }

    setLoading() {
        this._value = this.values.LOADING;
        this._logState();
    }

    setLoaded() {
        this._value = this.values.LOADED;
        this._logState();
    }

    setPlaying() {
        this._value = this.values.PLAYING;
        this._logState();
    }

    setPlayingDefaultRecording() {
        this._value = this.values.PLAYING_DEFAULT_RECORDING;
        this._logState();
    }

    setLoadedDefaultRecording() {
        this._value = this.values.LOADED_DEFAULT_RECORDING;
        this._logState();
    }

    setBlocked() {
        this._value = this.values.BLOCKED;
        this._logState();
    }

    destroy() {
        this._value = null;
        this.values = null;
    }

    _logState(){
        console.log(this._value)
    }
}