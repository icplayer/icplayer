import {Button} from "./Button.jsm";

export class RecordButton extends Button {

    constructor({$view, state}) {
        super($view);
        this.state = state;
    }

    destroy() {
        super.destroy();
        this.state = null;
    }

    _eventHandler() {
        if (this.state.isNew() || this.state.isLoaded())
            this._startRecording();
        else if (this.state.isRecording())
            this._stopRecording()
    }

    _startRecording() {
        this.$view.addClass("selected");
        this.onStartRecordingCallback();
    }

    _stopRecording() {
        this.$view.removeClass("selected");
        this.onStopRecordingCallback();
    }

    set onStartRecording(callback) {
        this.onStartRecordingCallback = callback;
    }

    set onStopRecording(callback) {
        this.onStopRecordingCallback = callback;
    }
}