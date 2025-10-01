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
        BLOCKED_SAFARI: 8
    };

    constructor() {
        console.log("Set NEW");
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

    isBlockedSafari() {
        return this._value === this.values.BLOCKED_SAFARI;
    }

    isBlocked() {
        return this._value === this.values.BLOCKED;
    }

    setNew() {
        console.log("Set NEW");
        this._value = this.values.NEW;
    }

    setRecording() {
        console.log("Set setRecording");
        this._value = this.values.RECORDING;
    }

    setLoading() {
        console.log("Set setLoading");
        this._value = this.values.LOADING;
    }

    setLoaded() {
        console.log("Set setLoaded");
        this._value = this.values.LOADED;
    }

    setPlaying() {
        console.log("Set setPlaying");
        this._value = this.values.PLAYING;
    }

    setPlayingDefaultRecording() {
        console.log("Set setPlayingDefaultRecording");
        this._value = this.values.PLAYING_DEFAULT_RECORDING;
    }

    setLoadedDefaultRecording() {
        console.log("Set setLoadedDefaultRecording");
        this._value = this.values.LOADED_DEFAULT_RECORDING;
    }

    setBlocked() {
        console.log("Set setBlocked");
        this._value = this.values.BLOCKED;
    }

    setBlockedSafari() {
        console.log("Set setBlockedSafari");
        this._value = this.values.BLOCKED_SAFARI;
    }

    destroy() {
        this._value = null;
        this.values = null;
    }
}