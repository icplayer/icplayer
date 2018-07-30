import {Player} from "./player.jsm";

export class AudioPlayer extends Player {
    constructor($player) {
        super();
        this.$player = $player;

        this.audioNode = document.createElement("audio");
        this.audioNode.controls = true;
        this.audioNode.style.display = "none";
        this.$player.append(this.audioNode);
    }

    play() {
        this.onPlayCallback(this.audioNode);
        this.audioNode.play();
    }

    stop() {
        this.audioNode.pause();
        this.audioNode.currentTime = 0;
        this.audioNode.muted = false;
        this.onStopCallback();
    }

    set recording(source) {
        this.audioNode.src = source;
    }

    set onStartPlaying(callback) {
        this.onPlayCallback = callback;
    }

    set onStopPlaying(callback) {
        this.onStopCallback = callback;
    }

    set onEndedPlaying(callback){
        this.audioNode.onended = () => callback();
    }

    set onDurationChanged(callback) {
        // faster resolution then
        // this.audioNode.ondurationchange = () => callback(this.audioNode.duration)
        this.audioNode.ondurationchange = () => {
            let playerMock = new Audio(this.audioNode.src);
            playerMock.addEventListener("durationchange", function () {
                if (this.duration != Infinity) {
                    callback(this.duration);
                    playerMock.remove();
                }
            }, false);
            playerMock.load();
            playerMock.currentTime = 24 * 60 * 60; // fake big time
            playerMock.volume = 0;
        }
    }
}