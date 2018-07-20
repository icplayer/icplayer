import {Player} from "./player.jsm";

export class AudioPlayer extends Player {
    constructor(mediaRecorderPlayerWrapper) {
        super();
        this.mediaRecorderPlayerWrapper = mediaRecorderPlayerWrapper;
        this.audioNode = document.createElement("audio");
        this.audioNode.controls = true;
        this.audioNode.style.display = "none";
        this.mediaRecorderPlayerWrapper.append(this.audioNode);
    }


    play() {
        this.audioNode.play();
    }

    stop() {
        this.audioNode.pause();
        this.audioNode.currentTime = 0;
    }

    setRecording(source) {
        this.audioNode.src = source;
    }

    set onEndedPlaying(callback) {
        this.audioNode.onended = () => callback();
    }

    set onDurationChanged(callback) {
        // faster resolution then
        // this.audioNode.ondurationchange = () => callback(this.audioNode.duration)
        this.audioNode.ondurationchange = () => {
            let _player = new Audio(this.audioNode.src);
            _player.addEventListener("durationchange", function (e) {
                if (this.duration != Infinity) {
                    callback(this.duration);
                    _player.remove();
                }
            }, false);
            _player.load();
            _player.currentTime = 24 * 60 * 60; // fake big time
            _player.volume = 0;
        }
    }
}