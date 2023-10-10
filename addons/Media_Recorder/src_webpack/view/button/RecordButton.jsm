import {Button} from "./Button.jsm";
import {CSS_CLASSES} from "../CssClasses.jsm";

export class RecordButton extends Button {

    _keyboardController = null;
    _timeoutID = null;

    constructor({$view, state}) {
        super($view);
        this.state = state;
    }

    destroy() {
        super.destroy();
        this._keyboardController = null;
        this.state = null;
        this._clearTimeout();
    }

    reset() {
        this.$view.removeClass(CSS_CLASSES.SELECTED);
        this.onResetCallback();
        this._clearTimeout();
    }

    setUnclickView() {
        this.$view.removeClass(CSS_CLASSES.SELECTED);
    }

    _eventHandler() {
        if (this.state.isNew() || this.state.isLoaded() || this.state.isLoadedDefaultRecording() || this.state.isBlockedSafari())
            this._startRecording();
        else if (this.state.isRecording())
            this._stopRecording();
    }

    _startRecording() {
        this.$view.addClass(CSS_CLASSES.SELECTED);
        this.onStartRecordingCallback();
        this._handleDisablingRecordButton();
    }

    _stopRecording() {
        if (!this._timeoutID) {
            this.$view.removeClass(CSS_CLASSES.SELECTED);
            this.onStopRecordingCallback();
        }
    }

    _handleDisablingRecordButton() {
        this._disableRecordButton();
        _self = this;
        this._timeoutID = setTimeout(() => {
            _self._enableRecordButton();
        }, 1000);
    }

    _disableRecordButton() {
        this.$view.addClass(CSS_CLASSES.DISABLE_RECORD_BUTTON);
    }

    _enableRecordButton() {
        this.$view.removeClass(CSS_CLASSES.DISABLE_RECORD_BUTTON);
        this._clearTimeout();
    }

    _clearTimeout() {
        if (this._timeoutID) {
            clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
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
