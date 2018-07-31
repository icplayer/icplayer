import {BasePlayer} from "./basePlayer.jsm";

export class AudioPlayer extends BasePlayer {

    constructor($view) {
        super($view);
    }

    _getMediaNode() {
        return document.createElement("audio");
    }
}