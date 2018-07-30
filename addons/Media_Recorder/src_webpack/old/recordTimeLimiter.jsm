export class RecordTimeLimiter {
    constructor(maxTime) {
        this.workingDelay = 0.2;
        this.maxTime = maxTime + this.workingDelay;
        this.counter = 0;
        this.interval;
        this.callback;
    }

    startCountdown() {
        if (this.maxTime || this.callback)
            this.interval = setInterval(() => this.incrementTimer(), this.workingDelay * 1000);
    }

    stopCountdown() {
        clearInterval(this.interval);
        this.counter = 0;
    }

    incrementTimer() {
        this.counter += this.workingDelay;
        if (this.counter >= this.maxTime) {
            this.stopCountdown();
            this.callback();
        }
    }

    set onTimeExpired(callback) {
        this.callback = callback;
    }
}