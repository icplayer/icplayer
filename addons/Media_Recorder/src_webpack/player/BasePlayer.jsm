import {Player} from "./Player.jsm";

export class BasePlayer extends Player {

    constructor($view, isMlibro) {
        super();
        if (this.constructor === BasePlayer)
            throw new Error("Cannot create an instance of BasePlayer abstract class");
        this.isMlibro = isMlibro;
        this.$view = $view;
        this.hasRecording = false;
        this.duration = null;
        this.mediaNode = this._createMediaNode();
        this.mediaNode.controls = false;
        this.$view.append(this.mediaNode);
        this.eventBus = null;
        this.sourceID = '';
        this.item = '';

        this._enableEventsHandling();
    }

    setRecording(source) {
        this.mediaNode.src = source;
        this.hasRecording = true;
        this._getDuration()
            .then(duration => {
                this.onDurationChangeCallback(duration);
                this.duration = duration;
            }).catch(e => {
                this.hasRecording = false
            });
    }

    startPlaying() {
        return new Promise(resolve => {
            this.mediaNode.muted = false;
            if (this.onTimeUpdateCallback) {
                this._enableTimerEventsHandling();
            }
            if (this._isNotOnlineResources(this.mediaNode.src))
                resolve(this.mediaNode);
            this.mediaNode.play();
        });
    }

    stopPlaying() {
        return new Promise(resolve => {
            this.mediaNode.pause();
            this.mediaNode.currentTime = 0;
            if (this.onTimeUpdateCallback) {
                this._disableTimerEventsHandling();
            }
            resolve();
        });
    }

    _enableTimerEventsHandling() {
        this.mediaNode.addEventListener('timeupdate', this.onTimeUpdateCallback);
        this.mediaNode.addEventListener('ended', this.onTimeUpdateCallback);
    }

    _disableTimerEventsHandling() {
        this.mediaNode.removeEventListener('timeupdate', this.onTimeUpdateCallback);
        this.mediaNode.removeEventListener('ended', this.onTimeUpdateCallback);
    }

    pausePlaying() {
        return new Promise(resolve => {
            this.mediaNode.pause();
            if (this.onTimeUpdateCallback) {
                this.mediaNode.removeEventListener('timeupdate', this.onTimeUpdateCallback);
                this.mediaNode.removeEventListener('ended', this.onTimeUpdateCallback);
            }
            resolve();
        });
    }

    setProgress(progress) {
        return new Promise(resolve => {
            this.mediaNode.currentTime = Math.round(this.duration * progress);
            resolve();
        });
    }

    reset() {
        this._disableEventsHandling();
        this.mediaNode.src = "";
        this.mediaNode.remove();
        this.hasRecording = false;
        this.duration = null;
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
        this.hasRecording = null;
        this.duration = null;
        this.$view.remove();
        this.mediaNode = null;
        this.$view = null;
    }

    setEventBus(eventBus, sourceID, item) {
        this.eventBus = eventBus;
        this.sourceID = sourceID;
        this.item = item;
    }

    getCurrentTime() {
        return this.mediaNode.currentTime;
    }

    setIsMlibro(isMlibro) {
        this.isMlibro = isMlibro;
    }

    _enableEventsHandling() {
        this.mediaNode.onloadstart = () => this.onStartLoadingCallback();
        this.mediaNode.onended = () => this.onEndPlayingCallback();
        this.mediaNode.onplay = () => this._onPlayCallback();
        this.mediaNode.onpause = () => this._onPausedCallback();

        if (this._isMobileSafari() || this._isIosMlibro() || this._isIOSWebViewUsingAppleWebKit()) {
            this.mediaNode.onloadedmetadata = () => this.onEndLoadingCallback();
        } else  {
            this.mediaNode.oncanplay = () => this.onEndLoadingCallback();
        }
    }

    _disableEventsHandling() {
        this.mediaNode.onloadstart = null;
        this.mediaNode.oncanplay = null;
        this.mediaNode.onended = null;
        this.mediaNode.onplay = () => null;
        this.mediaNode.onpause = () => null;
        this.mediaNode.onloadedmetadata = function () {
        };
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

    _isIOSWebViewUsingAppleWebKit() {
        const userAgent = window.navigator.userAgent.toLowerCase(),
            safari = /safari/.test( userAgent ),
            ios = /iphone|ipod|ipad/.test( userAgent ),
            appleWebKit = /applewebkit/.test( userAgent );
        const webView = ios && !safari;

        return webView && appleWebKit;
    }

    _isMobileSafari() {
        return window.DevicesUtils.getBrowserVersion().toLowerCase().indexOf("safari") > -1 && window.MobileUtils.isSafariMobile(navigator.userAgent);
    }

    _isIosMlibro() {
        return this.isMlibro && window.MobileUtils.isSafariMobile(navigator.userAgent);
    }

    _isNotOnlineResources(source) {
        return !(source.startsWith("www.")
            || source.startsWith("http://")
            || source.startsWith("https://"));
    }

    _onPlayCallback() {
        this._sendEventCallback('playing');
    }

    _onPausedCallback() {
        this._sendEventCallback('stop');
    }

    _sendEventCallback(value) {
        if (this.eventBus) {
            let eventData = {
                'source': this.sourceID,
                'item': this.item,
                'value': value,
                'score': ''
            };
            this.eventBus.sendEvent('ValueChanged', eventData);
        }
    }

    _createMediaNode() {
        throw new Error("GetMediaNode accessor is not implemented");
    }

    _onTimeUpdateEvent(event) {
        if (this.onTimeUpdateCallback) {
            this.onTimeUpdateCallback(event);
        }
    }
}