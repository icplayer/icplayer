TestCase("[Media Recorder] Timer", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();

        let internalElements = this.presenter._internalElements();

        this.clock = sinon.useFakeTimers();

        this.$view = $('<div></div>');
        this.timer = new internalElements.Timer(this.$view);
    },

    tearDown: function () {
        this.clock.restore();
    },

    "test view has correct style when timer is initialized": function () {
        let zIndexStyle = "100";

        assertEquals(zIndexStyle, this.$view[0].style.zIndex);
    },

    "test view displays zeroed time when timer is initialized": function () {
        let displayedText = "00:00";

        assertEquals(displayedText, this.$view[0].innerText);
    },

    "test view displays time of recording duration when timer set up it": function () {
        let timerInSeconds = 3741;
        let displayedText = "00:00 / 62:21";

        this.timer.setDuration(timerInSeconds);

        assertEquals(displayedText, this.$view[0].innerText);
    },

    "test view displays time of recording when countdown is started": function () {
        let timerInSeconds = 3741;
        let displayedText = "62:21";

        this.timer.startCountdown();
        this.clock.tick(timerInSeconds * 1000);

        assertEquals(displayedText, this.$view[0].innerText);
    },

    "test view displays zeroed time when countdown is stopped": function () {
        let timerInSeconds = 3741;
        let displayedText = "00:00";

        this.timer.startCountdown();
        this.clock.tick(timerInSeconds * 1000);
        this.timer.stopCountdown();

        assertEquals(displayedText, this.$view[0].innerText);
    },

    "test view displays time of recording and duration when countdown is started": function () {
        let timerInSeconds = 3741;
        let countdownTimeInSeconds = 2741;
        let displayedText = "45:41 / 62:21";

        this.timer.setDuration(timerInSeconds);
        this.timer.startCountdown();
        this.clock.tick(countdownTimeInSeconds * 1000);

        assertEquals(displayedText, this.$view[0].innerText);
    },

    "test view displays zeroed time and time of recording duration when countdown is stopped": function () {
        let timerInSeconds = 3741;
        let countdownTimeInSeconds = 2741;
        let displayedText = "00:00 / 62:21";

        this.timer.setDuration(timerInSeconds);
        this.timer.startCountdown();
        this.clock.tick(countdownTimeInSeconds * 1000);
        this.timer.stopCountdown();

        assertEquals(displayedText, this.$view[0].innerText);
    }
});