import {MediaMediator} from "./mediaMediaMediator.jsm";

export class MediaMediatorFactory {
    constructor(player, recorder, timer, soundIntensity, ERROR_MESSAGE) {
        this.player = player;
        this.recorder = recorder;
        this.timer = timer;
        this.soundIntensity = soundIntensity;
        this.ERROR_MESSAGE = ERROR_MESSAGE;
    }

    createMediaMediator() {
        return new MediaMediator(this.player, this.recorder, this.timer, this.soundIntensity);
    }
}