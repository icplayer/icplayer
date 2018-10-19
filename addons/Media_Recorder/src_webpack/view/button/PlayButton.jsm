import {Button} from "./Button.jsm";

export class PlayButton extends Button {

    constructor({$view, state, isDefault}) {
        super($view);
        this.state = state;
        this.isDefault = isDefault;
    }

    destroy() {
        super.destroy();
        this.state = null;
    }

    _eventHandler() {
        if (this.state.isLoaded())
            this._startPlaying();
        else if ((this.state.isPlaying() && !this.isDefault) || (this.state.isPlayingDefault() && this.isDefault))
            this._stopPlaying()
    }

    _startPlaying() {
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