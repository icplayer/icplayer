import {Player} from "./Player.jsm";

export class BasePlayer extends Player {

    eventBus = null;
    sourceID = '';
    mediaDuration = 0;
    playerName = '';

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
        var promise = this._getDuration();
        promise.then(duration => this.onDurationChangeCallback(duration));
        promise.then(duration => this.mediaDuration = duration);
    }

    startPlaying() {
        return new Promise(resolve => {
            this.mediaNode.muted = false;
            if (this._isNotOnlineResources(this.mediaNode.src))
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
        if (!this.mediaNode.paused)
            this.stopNextStopEvent = true;
        this.stopPlaying();
        this._enableEventsHandling();
    }

    reset() {
        this._disableEventsHandling();
        this.mediaNode.src = "";
        this.mediaNode.remove();

        this.mediaNode = this._createMediaNode();
        this.mediaNode.controls = false;
        this.$view.append(this.mediaNode);
        this._enableEventsHandling();
    }

    destroy() {
        this._disableEventsHandling();
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

    getDuration() {
        return this.mediaDuration;
    }

    _isNotOnlineResources(source) {
        return !(source.startsWith("www.")
            || source.startsWith("http://")
            || source.startsWith("https://"));
    }

    _createMediaNode() {
        throw new Error("GetMediaNode accessor is not implemented");
    }

    setEventBus(sourceID, itemName, eventBus) {
        this.eventBus = eventBus;
        this.sourceID = sourceID;
        this.playerName = itemName;
    }
}