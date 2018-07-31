import {BasePlayer} from "./basePlayer.jsm";

export class VideoPlayer extends BasePlayer {

    constructor($view) {
        super($view);
    }

    _getMediaNode() {
        return document.createElement("video");
    }
}