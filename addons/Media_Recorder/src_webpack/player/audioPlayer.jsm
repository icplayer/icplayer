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
        this.startPlayingCallback(this.audioNode);
        this.audioNode.play();
    }

    stop() {
        this.audioNode.pause();
        this.audioNode.currentTime = 0;
        this.videoNode.muted = false;
        this.onStopCallback();
    }

    set recording(source) {
        this.audioNode.src = source;
    }

    set onStartPlaying(callback) {
        this.onPlayCallback = callback;
    }

    set onStopPlaying(callback) {
        this.videoNode.onended = () => callback();
        this.onStopCallback = callback;
    }

    set onDurationChanged(callback) {
        // faster resolution then
        // this.audioNode.ondurationchange = () => callback(this.audioNode.duration)
        this.audioNode.ondurationchange = () => {
            let playerMock = new Audio(this.audioNode.src);
            playerMock.addEventListener("durationchange", function (e) {
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