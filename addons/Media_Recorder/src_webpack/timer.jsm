export class Timer {
    constructor($timer) {
        this.$timer = $timer;
        this.interval = null;
        this.currentMinutes = 0;
        this.currentSeconds = 0;
        this.loadedMinutes = 0;
        this.loadedSeconds = 0;
        this.isLoaded = false;
    }

    startCountdown() {
        this.clearCurrentTime();
        this.interval = setInterval(() => {
            this.incrementTimer();
            this.updateText();
        }, 1000);
    }

    stopCountdown() {
        clearInterval(this.interval);
        this.clearCurrentTime();
        this.updateText();
    }

    reset() {
        clearInterval(this.interval);
        this.isLoaded = false;
        this.clearCurrentTime();
        this.clearLoadedTime();
        this.updateText();
    }

    setDuration(duration) {
        this.loadedMinutes = parseInt(duration / 60);
        this.loadedSeconds = parseInt(duration % 60);
        this.isLoaded = true;
        this.updateText();
    }

    clearCurrentTime() {
        this.currentMinutes = 0;
        this.currentSeconds = 0;
    }

    clearLoadedTime() {
        this.loadedMinutes = 0;
        this.loadedSeconds = 0;
    }

    incrementTimer() {
        this.currentSeconds++;

        if (this.currentSeconds >= 60) {
            this.currentSeconds = 0;
            this.currentMinutes++;
        }
    }

    updateText() {
        this.$timer[0].innerText = this.isLoaded
            ? this.generateTextTime(this.currentMinutes, this.currentSeconds) + " / " + this.generateTextTime(this.loadedMinutes, this.loadedSeconds)
            : this.generateTextTime(this.currentMinutes, this.currentSeconds);
    }

    generateTextTime(minutes, seconds) {
        let text = "";
        text += minutes < 10 ? "0" + minutes : minutes;
        text += ":";
        text += seconds < 10 ? "0" + seconds : seconds;

        return text;
    }
}