import {Loader} from "./Loader.jsm";
import {CSS_CLASSES} from "../CssClasses.jsm";

export class AudioLoader extends Loader {

    constructor($view) {
        super($view);
    }

    show() {
        this.$view.addClass(CSS_CLASSES.AUDIO_LOADER);
    }

    hide() {
        this.$view.removeClass(CSS_CLASSES.AUDIO_LOADER);
    }
}
