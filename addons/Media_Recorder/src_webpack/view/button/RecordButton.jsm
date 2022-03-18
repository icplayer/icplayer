import {Button} from "./Button.jsm";
import {CSS_CLASSES} from "../CssClasses.jsm";

export class RecordButton extends Button {

    _keyboardController = null;

    constructor({$view, state}) {
        super($view);
        this.state = state;
    }

    destroy() {
        super.destroy();
        this._keyboardController = null;
        this.state = null;
    }

    reset() {
        this.$view.removeClass(CSS_CLASSES.SELECTED);
        this.onResetCallback();
    }

    setUnclickView() {
        this.$view.removeClass(CSS_CLASSES.SELECTED);
    }

    _eventHandler() {
        if (this.state.isNew() || this.state.isLoaded() || this.state.isLoadedDefaultRecording() || this.state.isBlockedSafari())
            this._startRecording();
        else if (this.state.isRecording())
            this._stopRecording()
    }

    _startRecording() {
        this.$view.addClass(CSS_CLASSES.SELECTED);
        this.onStartRecordingCallback();
    }

    _stopRecording() {
        this.$view.removeClass(CSS_CLASSES.SELECTED);
        this.onStopRecordingCallback();
    }

    set onStartRecording(callback) {
        this.onStartRecordingCallback = callback;
    }

    set onStopRecording(callback) {
        this.onStopRecordingCallback = callback;
    }

    set onReset(callback) {
        this.onResetCallback = callback;
    }

    setKeyboardController(keyboardController) {
        this._keyboardController = keyboardController;
    }
}