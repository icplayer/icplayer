import {Button} from "./Button.jsm";

export class ResetButton extends Button {

    constructor($view) {
        super($view);
    }

    _eventHandler() {
        if (this.onResetCallback != null) {
            this.onResetCallback();
        }
    }

    set onReset(callback) {
        this.onResetCallback = callback;
    }
}