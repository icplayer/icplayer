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
    }

    setRecording() {
        this._value = this.values.RECORDING;
    }

    setLoading() {
        this._value = this.values.LOADING;
    }

    setLoaded() {
        this._value = this.values.LOADED;
    }

    setPlaying() {
        this._value = this.values.PLAYING;
    }

    setPlayingDefaultRecording() {
        this._value = this.values.PLAYING_DEFAULT_RECORDING;
    }

    setLoadedDefaultRecording() {
        this._value = this.values.LOADED_DEFAULT_RECORDING;
    }

    setBlocked() {
        this._value = this.values.BLOCKED;
    }

    destroy() {
        this._value = null;
        this.values = null;
    }
}