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

    setResources(resources) {
        this.audioNode.src = resources;
    }

    set onEndedPlaying(callback) {
        this.audioNode.onended = () => callback();
    }
}