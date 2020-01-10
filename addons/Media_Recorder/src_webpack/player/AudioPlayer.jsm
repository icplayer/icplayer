import {BasePlayer} from "./BasePlayer.jsm";

export class AudioPlayer extends BasePlayer {

    constructor($view) {
        super($view);
        this.mediaNode.style.display = "hidden";
    }

    _createMediaNode() {
        return document.createElement("audio");
    }
}