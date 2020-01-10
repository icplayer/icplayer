import {Loader} from "./Loader.jsm";

export class AudioLoader extends Loader {

    constructor($view) {
        super($view);
    }

    show() {
        this.$view.addClass("audio-loader");
    }

    hide() {
        this.$view.removeClass("audio-loader");
    }
}