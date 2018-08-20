import {Player} from "./Player.jsm";

export class BasePlayer extends Player {

    constructor($view) {
        super();
        if (this.constructor === BasePlayer)
            throw new Error("Cannot create an instance of BasePlayer abstract class");

        this.$view = $view;
        this.mediaNode = this._createMediaNode();
        this.mediaNode.controls = false;
        this.$view.append(this.mediaNode);

        this._enableEventsHandling();
    }

    setRecording(source) {
        this.mediaNode.src = source;
        this._getDuration()
            .then(duration => this.onDurationChangeCallback(duration));
    }

    startPlaying() {
        return new Promise(resolve => {
            this.mediaNode.muted = false;
            resolve(this.mediaNode);
            this.mediaNode.play();
        });
    }

    stopPlaying() {
        return new Promise(resolve => {
            this.mediaNode.pause();
            this.mediaNode.currentTime = 0;
            resolve();
        });
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

    reset() {
        this.mediaNode.src = "";
    }

    destroy() {
        this.stopPlaying();
        this.mediaNode.src = "";
        this.mediaNode.remove();
        this.$view.remove();
        this.mediaNode = null;
        this.$view = null;
    }

    _enableEventsHandling() {
        this.mediaNode.onloadstart = () => this.onStartLoadingCallback();
        this.mediaNode.oncanplay = () => this.onEndLoadingCallback();
        this.mediaNode.onended = () => this.onEndPlayingCallback();
    }

    _disableEventsHandling() {
        this.mediaNode.onloadstart = null;
        this.mediaNode.oncanplay = null;
        this.mediaNode.onended = null;
    }

    _getDuration() {
        // faster resolution then
        // this.mediaNode.ondurationchange = () => this.onDurationChangeCallback(this.mediaNode.duration)
        return new Promise(resolve => {
                let playerMock = new Audio(this.mediaNode.src);
                playerMock.addEventListener("durationchange", function () {
                    if (this.duration != Infinity) {
                        resolve(this.duration);
                        playerMock.src = "";
                        playerMock.remove();
                    }
                }, false);
                playerMock.load();
                playerMock.currentTime = 24 * 60 * 60; // fake big time
                playerMock.volume = 0;
            }
        )
    }

    _createMediaNode() {
        throw new Error("GetMediaNode accessor is not implemented");
    }
}