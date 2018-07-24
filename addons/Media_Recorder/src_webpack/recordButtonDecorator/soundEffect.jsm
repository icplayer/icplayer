export class SoundEffect {

    constructor(sound, $wrapper) {
        this.sound = sound;
        this.$wrapper = $wrapper;
        this.startCallback;
        this.stopCallback;
    }

    isValid() {
        return this.sound != "" && this.sound != null && typeof this.sound != "undefined";
    }

    playSound() {
        let audioNode = document.createElement("audio");
        audioNode.src = this.sound;
        audioNode.style.display = "none";

        if (this.stopCallback)
            audioNode.onended = () => this.stopCallback();

        this.$wrapper.append(audioNode);
        audioNode.play();

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