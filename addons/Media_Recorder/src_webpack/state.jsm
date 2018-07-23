export class State {
    constructor() {
        this.NEW = 0;
        this.RECORDING = 1;
        this.LOADED = 2;
        this.PLAYING = 3;
        this._state = 0;
    };

    isNew(){
        return this._state === this.NEW;
    }

    isRecording(){
        return this._state === this.RECORDING;
    }

    isLoaded(){
        return this._state === this.LOADED;
    }

    isPlaying(){
        return this._state === this.PLAYING;
    }

    setRecording(){
        this._state = this.RECORDING;
    }

    setLoaded(){
        this._state = this.LOADED;
    }

    setPlaying(){
        this._state = this.PLAYING;
    }
}