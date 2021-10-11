import {Button} from "./Button.jsm";

export class PlayButton extends Button {

    constructor({$view, state}) {
        super($view);
        this.state = state;
    }

    destroy() {
        super.destroy();
        this.state = null;
    }

    activate() {
            console.log("ACTIVATE");
            this.$view.click(() => this._eventHandler());
        }

    _eventHandler() {
        console.log("event handler play button");
        if (this.state.isLoaded())
            this._startPlaying();
        else if (this.state.isPlaying())
            this._stopPlaying()
    }

    _startPlaying() {
        console.log("_start playing");
        this.$view.addClass("selected");
        this.onStartPlayingCallback();
    }

    _stopPlaying() {
        this.$view.removeClass("selected");
        this.onStopPlayingCallback();
    }

    set onStartPlaying(callback) {
        this.onStartPlayingCallback = callback;
    }

    set onStopPlaying(callback) {
        this.onStopPlayingCallback = callback;
    }
}