import {BasePlayer} from "./basePlayer.jsm";

export class AudioPlayer extends BasePlayer {

    constructor($view) {
        super($view);
        this.mediaNode.style.display = "hidden";
    }

    _createMediaNode() {
        return document.createElement("audio");
    }
}