export class RecordingTimeLimiter {

    constructor(maxTime) {
        this.workingDelay = 0.2;
        this.maxTime = maxTime + this.workingDelay;
        this.counter = 0;
        this.interval;
        this.callback;
    }

    startCountdown() {
        if (this.maxTime || this.callback)
            this.interval = setInterval(() => this._incrementTimer(), this.workingDelay * 1000);
    }

    stopCountdown() {
        clearInterval(this.interval);
        this.counter = 0;
    }

    destroy() {
        this.callback = () => {
        };
        clearInterval(this.interval);
        this.interval = null;
        this.callback = null;
    }

    set onTimeExpired(callback) {
        this.callback = callback;
    }

    _incrementTimer() {
        this.counter += this.workingDelay;
        if (this.counter >= this.maxTime) {
            this.stopCountdown();
            this.callback();
        }
    }
}