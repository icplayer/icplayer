TestCase("[Media Recorder] Recording Timer", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.maxTimeInSeconds = 120;

        this.recordingTimer = new internalElements.RecordingTimer(this.maxTimeInSeconds);
        this.onTimeExpiredStub = sinon.stub();
        this.recordingTimer.onTimeExpired = () => this.onTimeExpiredStub();
        this.clock = sinon.useFakeTimers();
    },

    tearDown: function () {
        this.clock.restore();
    },

    "test callback function is not called when timer is initialized": function () {
        assertTrue(this.onTimeExpiredStub.notCalled);
    },

    "test callback function is not called when countdown is started": function () {
        this.recordingTimer.startCountdown();

        assertTrue(this.onTimeExpiredStub.notCalled);
    },

    "test callback function is not called when countdown has not ended": function () {
        let workingDelay = 0.2;
        let countdownTime = this.maxTimeInSeconds + workingDelay - 0.000000001;

        this.recordingTimer.startCountdown();
        this.clock.tick(countdownTime * 1000);

        assertTrue(this.onTimeExpiredStub.notCalled);
    },

    "test callback function is called when countdown has ended": function () {
        let workingDelay = 0.2;
        let countdownTime = this.maxTimeInSeconds + workingDelay + 0.000000001;

        this.recordingTimer.startCountdown();
        this.clock.tick(countdownTime * 1000);

        assertTrue(this.onTimeExpiredStub.calledOnce);
    }
});