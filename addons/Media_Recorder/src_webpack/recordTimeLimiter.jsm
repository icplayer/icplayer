export class RecordTimeLimiter {
    constructor(maxTime) {
        this.maxTime = maxTime;
        this.counter = 0;
        this.interval;
        this.callback;
    }

    startCountdown() {
        if (this.maxTime || this.callback)
            this.interval = setInterval(() => this.incrementTimer(), 1000);
    }

    stopCountdown() {
        clearInterval(this.interval);
        this.counter = 0;
    }

    incrementTimer() {
        this.counter++;
        if (this.counter >= this.maxTime) {
            this.stopCountdown();
            this.callback();
        }
    }

    set onTimeExpired(callback) {
        this.callback = callback;
    }
}