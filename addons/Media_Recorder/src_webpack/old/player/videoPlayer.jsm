import {Player} from "./player.jsm";

export class VideoPlayer extends Player {
    constructor($playerView) {
        super();
        this.$playerView = $playerView;
        this.$playerView.css("background-color", "black");
        this.mediaNode = document.createElement("video");
        this.mediaNode.controls = false;
        this.mediaNode.style.display = "visible";
        this.$playerView.append(this.mediaNode);
    }

    play() {
        this.mediaNode.play();
        this.onStartPlayingCallback(this.mediaNode);
    }

    stop() {
        this.mediaNode.pause();
        this.mediaNode.currentTime = 0;
        this.mediaNode.muted = false;
        this.onStopPlayingCallback();
    }

    setRecording(source) {
        this.mediaNode.src = source;
    }

    setStream(stream) {
        setSrcObject(stream, this.mediaNode);
        this.mediaNode.muted = true;
        this.mediaNode.play();
    }

    set onStartPlaying(callback) {
        this.onStartPlayingCallback = callback;
    }

    set onStopPlaying(callback) {
        this.onStopPlayingCallback = callback;
    }

    set onEndedPlaying(eventHandler) {
        this.mediaNode.onended = () => eventHandler();
    }

    set onStartLoading(eventHandler) {
        this.mediaNode.onloadstart = () => eventHandler;
    }

    set onEndLoading(eventHandler) {
        this.mediaNode.oncanplay = () => eventHandler;
    }

    set onLoadedData(eventHandler) {
        this.mediaNode.onloadeddata = () => eventHandler;
    }

    set onDurationChanged(callback) {
        this.mediaNode.ondurationchange = () => {
            // faster resolution then
            // this.mediaNode.ondurationchange = () => callback(this.mediaNode.duration)
            let playerMock = new Audio(this.mediaNode.src);
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