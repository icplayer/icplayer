import {AudioPlayer} from "./audioPlayer.jsm";
import {VideoPlayer} from "./videoPlayer.jsm";

export class PlayerFactory {
    constructor($player, ERROR_MESSAGE) {
        this.$player = $player;
        this.ERROR_MESSAGE = ERROR_MESSAGE;
    }

    createPlayer(type) {
        if (type === "audio") {
            return new AudioPlayer(this.$player);
        } else if (type === "video") {
            return new VideoPlayer(this.$player);
        } else {
            throw Error(this.ERROR_MESSAGE);
        }
    }
}