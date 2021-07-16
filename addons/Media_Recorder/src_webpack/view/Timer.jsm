export class Timer {

    constructor($view) {
        this.$view = $view;
        this.interval = null;
        this.currentMinutes = 0;
        this.currentSeconds = 0;
        this.loadedMinutes = 0;
        this.loadedSeconds = 0;
        this.duration = 0;
        this.isLoaded = false;

        this.$view.css("z-index", "100");
        this._updateText();
    }

    startCountdown() {
        this._clearCurrentTime();
        this.interval = setInterval(() => {
            this._incrementTimer();
            this._updateText();
        }, 1000);
    }

    startDecrementalCountdown(duration) {
        this._clearCurrentTime();
        this.setDuration(duration);
        this.currentMinutes = this.loadedMinutes;
        this.currentSeconds = this.loadedSeconds;
        this._updateText();
        this.interval = setInterval(() => {
            this._decrementTimer();
            this._updateText();
        }, 1000);
    }

    stopCountdown() {
        if (this.interval != null) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this._clearCurrentTime();
        this._updateText();
    }

    setDuration(duration) {
        this.duration = duration;
        this.loadedMinutes = parseInt(duration / 60);
        this.loadedSeconds = parseInt(duration % 60);
        this.isLoaded = true;
        this._updateText();
    }

    reset() {
        clearInterval(this.interval);
        this.isLoaded = false;
        this._clearCurrentTime();
        this._clearLoadedTime();
        this._updateText();
    }

    destroy() {
        clearInterval(this.interval);
        this.interval = null;
        this.$view.remove();
        this.$view = null;
    }

    _clearCurrentTime() {
        this.currentMinutes = 0;
        this.currentSeconds = 0;
    }

    _clearLoadedTime() {
        this.loadedMinutes = 0;
        this.loadedSeconds = 0;
    }

    _incrementTimer() {
        this.currentSeconds++;

        if (this.currentSeconds >= 60) {
            this.currentSeconds = 0;
            this.currentMinutes++;
        }
    }

    _decrementTimer() {
        this.currentSeconds--;

        if (this.currentSeconds < 0) {
            this.currentSeconds = 59;
            this.currentMinutes--;
        }
    }

    _updateText() {
        this.$view[0].innerText = this.isLoaded
            ? this._generateTextTime(this.currentMinutes, this.currentSeconds) + " / " + this._generateTextTime(this.loadedMinutes, this.loadedSeconds)
            : this._generateTextTime(this.currentMinutes, this.currentSeconds);
    }

    _generateTextTime(minutes, seconds) {
        let text = "";
        text += minutes < 10 ? "0" + minutes : minutes;
        text += ":";
        text += seconds < 10 ? "0" + seconds : seconds;

        return text;
    }

    setTime(seconds) {
        this.currentMinutes = parseInt(seconds / 60);
        this.currentSeconds = parseInt(seconds % 60);
        this._updateText();
    }
}