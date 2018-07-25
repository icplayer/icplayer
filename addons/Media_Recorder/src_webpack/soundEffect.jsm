export class SoundEffect {
    constructor(sound, $wrapper) {
        this.sound = sound;
        this.$wrapper = $wrapper;
        this.audioNode = document.createElement("audio");
        this.audioNode.src = this.sound;
        this.audioNode.style.display = "none";
        this.$wrapper.append(this.audioNode);
        this.startCallback;
        this.stopCallback;
    }

    isValid() {
        return this.sound != "" && this.sound != null && typeof this.sound != "undefined";
    }

    playSound() {
        if (this.stopCallback)
            this.audioNode.onended = () => {
                this.stopCallback();
            };

        this.audioNode.play();

        if (this.startCallback)
            this.startCallback();
    }

    set onStartCallback(startCallback) {
        this.startCallback = startCallback;
    }

    set onStopCallback(stopCallback) {
        this.stopCallback = stopCallback;
    }
}