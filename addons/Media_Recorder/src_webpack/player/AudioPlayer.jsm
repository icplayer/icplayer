import {BasePlayer} from "./basePlayer.jsm";

export class AudioPlayer extends BasePlayer {

    constructor($view) {
        super($view);
        this.mediaNode.style.display = "hidden";
    }

    _createMediaNode() {
        return document.createElement("audio");
    }

    _enableEventsHandling() {
        this.mediaNode.onloadstart = () => this.onStartLoadingCallback();
        this.mediaNode.oncanplay = () => this.onEndLoadingCallback();
        this.mediaNode.onended = () => this.onEndPlayingCallback();
        this.mediaNode.onplay = () => this.onPlayCallback();
        this.mediaNode.onpause = () => this.onPausedCallback();
    }

    _disableEventsHandling() {
        this.mediaNode.onloadstart = () => null;
        this.mediaNode.oncanplay = () => null;
        this.mediaNode.onended = () => null;
        this.mediaNode.onplay = () => null;
        this.mediaNode.onpause = () => null;
    }

    onPlayCallback() {
        this._sendEventCallback(this.playerName,'playing');
    }

    onPausedCallback() {
        if (this.stopNextStopEvent) {
            this.stopNextStopEvent = false;
        } else {
            this._sendEventCallback(this.playerName, 'stop');
        }
    }

    _sendEventCallback(item, value) {
        if (this.eventBus) {
            var eventData = {
                'source': this.sourceID,
                'item': item,
                'value': value,
                'score': ''
            };
            this.eventBus.sendEvent('ValueChanged', eventData);
        }
    }
}