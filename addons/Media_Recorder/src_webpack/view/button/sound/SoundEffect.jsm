export class SoundEffect {

    constructor(sound, $wrapper) {
        this.sound = sound;
        this.$wrapper = $wrapper;
        this.audioNode = document.createElement("audio");
        this.audioNode.src = sound;
        this.audioNode.style.display = "none";
        this.$wrapper.append(this.audioNode);
        this.startCallback = () => {
        };
        this.stopCallback = () => {
        };
    }

    isValid() {
        return this.sound != "" && this.sound != null && typeof this.sound != "undefined";
    }

    playSound() {
        this.startCallback();
        let playPromise = this.audioNode.play();
        if (playPromise !== undefined) {
            playPromise
                .catch(error => {
                    console.log(error);
                });
        }
    }

    destroy() {
        this.audioNode.pause();
        this.audioNode.src = "";
        this.audioNode.remove();
        this.audioNode = null;
        this.$wrapper.remove();
        this.$wrapper = null;
    }

    set onStartCallback(callback) {
        this.startCallback = callback;
    }

    set onStopCallback(callback) {
        this.stopCallback = callback;
        this.audioNode.onended = () => {
            callback();
            if (this.isBrowserRequiredReloadNode())
                this._reloadAudioNode();
        }
    }

    isBrowserRequiredReloadNode() {
        const navU = window.navigator.userAgent;
        return navU.indexOf('Android') > -1 && navU.indexOf('Mozilla/5.0') > -1 && navU.indexOf('AppleWebKit') > -1;
    }

    _reloadAudioNode() {
        this.audioNode.remove();
        this.audioNode = document.createElement("audio");
        this.audioNode.src = this.sound;
        this.audioNode.style.display = "none";
        this.$wrapper.append(this.audioNode);
        this.onStopCallback = this.stopCallback;
    }
}