export class Timer {
    constructor($timer) {
        this.wrapper = $timer;
        this.interval = null;
        this.currentMinutes = 0;
        this.currentSeconds = 0;
        this.loadedMinutes = 0;
        this.loadedSeconds = 0;
        this.isLoaded = false;

        this.updateText();
    }

    startRecording() {
        this.clearCurrentTime();
        this.clearLoadedTime();
        this.isLoaded = false;
        this.updateText();

        this.interval = setInterval(() => {
            this.incrementTimer();
            this.updateText();
        }, 1000);
    }

    stopRecording() {
        clearInterval(this.interval);

        this.setLoadedTime(this.currentMinutes, this.currentSeconds);
        this.clearCurrentTime();
        this.updateText();
    }

    startPlaying() {
        this.clearCurrentTime();
        this.updateText();

        this.interval = setInterval(() => {
            this.incrementTimer();
            this.updateText();
        }, 1000);
    }

    stopPlaying() {
        clearInterval(this.interval);

        this.clearCurrentTime();
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

    setLoadedTime(currentMinutes, currentSeconds) {
        this.loadedMinutes = currentMinutes;
        this.loadedSeconds = currentSeconds;
        this.isLoaded = true;
    }

    incrementTimer() {
        this.currentSeconds++;

        if (this.currentSeconds >= 60) {
            this.currentSeconds = 0;
            this.currentMinutes++;
        }
    }

    updateText() {
        this.wrapper[0].innerText = this.isLoaded
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