import {AudioPlayer} from "./audioPlayer.jsm";
import {VideoPlayer} from "./videoPlayer.jsm";

export class PlayerFactory {
    constructor($player, ERROR_MESSAGE) {
        this.$player = $player;
        this.ERROR_MESSAGE = ERROR_MESSAGE;
    }

    createPlayer(type) {
        switch (type) {
            case "audio":
                return new AudioPlayer(this.$player);
            case "video":
                return new VideoPlayer(this.$player);
            default:
                throw Error(this.ERROR_MESSAGE);
        }
    }
}