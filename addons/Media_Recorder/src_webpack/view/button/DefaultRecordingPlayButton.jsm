import {Button} from "./Button.jsm";
import {CSS_CLASSES} from "../CssClasses.jsm";

export class DefaultRecordingPlayButton extends Button {

    constructor({$view, state, defaultRecording}) {
        super($view);
        this.state = state;
        this.defaultRecording = defaultRecording;
    }

    destroy() {
        super.destroy();
        this.state = null;
    }

    _eventHandler() {
        if ((this.state.isLoaded() || this.state.isLoadedDefaultRecording()) && this.defaultRecording != "")
            this._startPlaying();
        else if (this.state.isPlayingDefaultRecording())
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