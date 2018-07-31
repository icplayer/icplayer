import {Player} from "./player.jsm";

export class BasePlayer extends Player {

    constructor($view) {
        super();
        if (this.constructor === BasePlayer)
            throw new Error("Cannot create an instance of BasePlayer abstract class");

        this.$view = $view;

        this.$view.css("background-color", "black");
        this.mediaNode = this._getMediaNode();
        this.mediaNode.controls = false;
        this.mediaNode.style.display = "visible";
        this.$view.append(this.mediaNode);

        this._enableEventsHandling();
    }

    startPlaying() {
        this.mediaNode.play();
        this.onStartPlayingCallback(this.mediaNode.captureStream());
    }

    stopPlaying() {
        this.mediaNode.pause();
        this.mediaNode.currentTime = 0;
        this.mediaNode.muted = false;
        this.onStopPlayingCallback();
    }

    setRecording(source) {
        this.mediaNode.src = source;
    }

    startStreaming(stream) {
        this._disableEventsHandling();
        setSrcObject(stream, this.mediaNode);
        this.mediaNode.muted = true;
        this.mediaNode.play();
    }

    stopStreaming() {
        this.stopPlaying();
        this._enableEventsHandling();
    }

    _enableEventsHandling(){
        let self = this;

        this.mediaNode.ondurationchange = () => {
            // faster resolution then
            // this.mediaNode.ondurationchange = () => callback(this.mediaNode.duration)
            let playerMock = new Audio(this.mediaNode.src);
            playerMock.addEventListener("durationchange", function () {
                if (this.duration != Infinity) {
                    self.onDurationChangeCallback(this.duration);
                    playerMock.remove();
                }
            }, false);
            playerMock.load();
            playerMock.currentTime = 24 * 60 * 60; // fake big time
            playerMock.volume = 0;
        };

        this.mediaNode.onended = () => this.onEndedPlayingCallback();
        this.mediaNode.onloadstart = () => this.onStartLoadingCallback();
        this.mediaNode.oncanplay = () => this.onEndLoadingCallback();
    }

    _disableEventsHandling(){
        this.mediaNode.ondurationchange = () => {};
        this.mediaNode.onended = () => {};
        this.mediaNode.onloadstart = () => {};
        this.mediaNode.oncanplay = () => {};
    }

    _getMediaNode() {
        throw new Error("GetMediaNode accessor is not implemented");
    }
}