import {Button} from "./Button.jsm";
import {CSS_CLASSES} from "../CssClasses.jsm";

export class PlayButton extends Button {

    constructor({$view, state}) {
        super($view);
        this.state = state;
    }

    destroy() {
        super.destroy();
        this.state = null;
    }

    _eventHandler() {
        if (this.state.isLoaded())
            this._startPlaying();
        else if (this.state.isPlaying())
            this._stopPlaying()
    }

    _startPlaying() {
        this.$view.addClass(CSS_CLASSES.SELECTED);
        this.onStartPlayingCallback();
    }

    _stopPlaying() {
        this.$view.removeClass(CSS_CLASSES.SELECTED);
        this.onStopPlayingCallback();
    }

    set onStartPlaying(callback) {
        this.onStartPlayingCallback = callback;
    }

    set onStopPlaying(callback) {
        this.onStopPlayingCallback = callback;
    }
}