import {AudioPlayer} from "./audioPlayer.jsm";

export class PlayerFactory {

    constructor($player, ERROR_CODES) {
        this.ERROR_CODES = ERROR_CODES;
        this.$player = $player;
    }

    createPlayer(type) {
        if (type === "audio") {
            return new AudioPlayer(this.$player);
        } else {
            throw Error(this.ERROR_CODES.type_EV01);
        }
    }
}