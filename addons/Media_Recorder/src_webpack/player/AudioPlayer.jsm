import {BasePlayer} from "./BasePlayer.jsm";

export class AudioPlayer extends BasePlayer {

    constructor($view, isMlibro) {
        super($view, isMlibro);
        this.mediaNode.style.display = "hidden";
    }

    _createMediaNode() {
        return document.createElement("audio");
    }
}