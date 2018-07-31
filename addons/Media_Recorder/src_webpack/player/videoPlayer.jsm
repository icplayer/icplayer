import {BasePlayer} from "./basePlayer.jsm";

export class VideoPlayer extends BasePlayer {

    constructor($view) {
        super($view);
        this.$view.css("background-color", "black");
        this.mediaNode.style.display = "visible";
    }

    _createMediaNode() {
        return document.createElement("video");
    }
}