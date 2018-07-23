import {Player} from "./player.jsm";

export class AudioPlayer extends Player {
    constructor(mediaRecorderPlayerWrapper) {
        super();
        this.mediaRecorderPlayerWrapper = mediaRecorderPlayerWrapper;
        this.audioNode = document.createElement("audio");
        this.audioNode.controls = true;
        this.audioNode.style.display = "none";
        this.mediaRecorderPlayerWrapper.append(this.audioNode);
        this.startPlayingCallback = null;
    }


    play() {
        this.startPlayingCallback(this.audioNode);
        this.audioNode.play();
    }

    stop() {
        this.audioNode.pause();
        this.audioNode.currentTime = 0;
    }

    setRecording(source) {
        this.audioNode.src = source;
    }

    set onStartPlaying(startPlayingCallback){
        this.startPlayingCallback = startPlayingCallback;
    }

    set onEndedPlaying(callback) {
        this.audioNode.onended = () => callback();
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