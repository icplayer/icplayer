import {VideoMediaMediator} from "./videoMediaMediator.jsm";
import {AudioMediaMediator} from "./audioMediaMediator.jsm";

export class MediaMediatorFactory {
    constructor(player, recorder, timer, soundIntensity, ERROR_MESSAGE) {
        this.player = player;
        this.recorder = recorder;
        this.timer = timer;
        this.soundIntensity = soundIntensity;
        this.ERROR_MESSAGE = ERROR_MESSAGE;
    }

    createMediaMediator(type) {
        if (type === "audio") {
            return new AudioMediaMediator(this.player, this.recorder, this.timer, this.soundIntensity);
        } else if (type === "video") {
            return new VideoMediaMediator(this.player, this.recorder, this.timer, this.soundIntensity);
        } else {
            throw Error(this.ERROR_MESSAGE);
        }
    }
}