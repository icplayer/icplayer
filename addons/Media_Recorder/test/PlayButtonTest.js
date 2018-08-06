TestCase("[Media Recorder] Play Button", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.$view = $('<div></div>');
        this.state = {};
        this.player = {};
        this.timer = {};

        this.viewMock = sinon.mock(this.$view);
        this.stateMock = sinon.mock(this.state);
        this.playerMock = sinon.mock(this.player);
        this.timerMock = sinon.mock(this.timer);

        this.playButton = new internalElements.PlayButton(this.$view, this.state, this.player, this.timer);
    },

    "test nothing happens when deactivated button is triggered": function () {
        this.state.isLoaded = () => true;
        this.state.setPlaying = sinon.stub();
        this.state.setLoaded = sinon.stub();
        this.player.startPlaying = sinon.stub();
        this.player.stopPlaying = sinon.stub();
        this.timer.startCountdown = sinon.stub();
        this.timer.stopCountdown = sinon.stub();

        this.playButton.activate();
        this.playButton.deactivate();

        this.$view.trigger("click");

        this.state.setPlaying.notCalled;
        this.state.setLoaded.notCalled;
        this.player.startPlaying.notCalled;
        this.player.stopPlaying.notCalled;
        this.timer.startCountdown.notCalled;
        this.timer.stopCountdown.notCalled;
    },

    "test initialized 2": function () {
        let styleClass = "selected";
        this.state.isLoaded = () => true;
        this.state.setPlaying = sinon.stub();
        this.player.startPlaying = sinon.stub();
        this.timer.startCountdown = sinon.stub();

        this.playButton.activate();
        this.$view.trigger("click");

        this.state.setPlaying.calledOnce;
        this.player.startPlaying.calledOnce;
        this.timer.startCountdown.calledOnce;
        assertEquals(styleClass, this.$view[0].className);
    },

    "test initialized 3": function () {
        this.$view[0].className = "selected";
        this.state.isLoaded = () => false;
        this.state.isPlaying = () => true;
        this.state.setLoaded = sinon.stub();
        this.player.stopPlaying = sinon.stub();
        this.timer.stopCountdown = sinon.stub();

        this.playButton.activate();
        this.$view.trigger("click");

        this.state.setLoaded.calledOnce;
        this.player.stopPlaying.calledOnce;
        this.timer.stopCountdown.calledOnce;
        assertEquals("", this.$view[0].className);
    }
});