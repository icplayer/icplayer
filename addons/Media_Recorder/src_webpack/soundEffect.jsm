export class SoundEffect {
    constructor(sound, $wrapper) {
        this.sound = sound;
        this.$wrapper = $wrapper;
        this.audioNode = document.createElement("audio");
        this.audioNode.src = sound;
        this.audioNode.style.display = "none";
        this.$wrapper.append(this.audioNode);
        this.startCallback = () => {};
    }

    isValid() {
        return this.sound != "" && this.sound != null && typeof this.sound != "undefined";
    }

    playSound() {
        this.startCallback();
        this.audioNode.play();
    }

    set onStartCallback(callback) {
        this.startCallback = callback;
    }

    set onStopCallback(callback) {
        this.audioNode.onended = () => callback;
    }
}