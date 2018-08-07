TestCase("[Media Recorder] Play Button", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.$view = $('<div></div>');
        this.state = {
            setPlaying: sinon.stub(),
            setLoaded: sinon.stub()
        };
        this.player = {
            startPlaying: sinon.stub(),
            stopPlaying: sinon.stub()
        };
        this.timer = {
            startCountdown: sinon.stub(),
            stopCountdown: sinon.stub()
        };

        this.playButton = new internalElements.PlayButton(this.$view, this.state, this.player, this.timer);
    },

    "test nothing happens when deactivated button has been triggered": function () {
        this.state.isLoaded = () => true;

        this.playButton.activate();
        this.playButton.deactivate();
        this.$view.trigger("click");

        assertTrue(this.state.setPlaying.notCalled);
        assertTrue(this.state.setLoaded.notCalled);
        assertTrue(this.player.startPlaying.notCalled);
        assertTrue(this.player.stopPlaying.notCalled);
        assertTrue(this.timer.startCountdown.notCalled);
        assertTrue(this.timer.stopCountdown.notCalled);
    },

    "test start playing when button has been triggered and media is loaded": function () {
        let styleClass = "selected";
        this.state.isLoaded = () => true;

        this.playButton.activate();
        this.$view.trigger("click");

        assertTrue(this.state.setPlaying.calledOnce);
        assertTrue(this.player.startPlaying.calledOnce);
        assertTrue(this.timer.startCountdown.calledOnce);
        assertEquals(styleClass, this.$view[0].className);
    },

    "test stop playing when button has been triggered and media is playing": function () {
        this.$view[0].className = "selected";
        this.state.isLoaded = () => false;
        this.state.isPlaying = () => true;

        this.playButton.activate();
        this.$view.trigger("click");

        assertTrue(this.state.setLoaded.calledOnce);
        assertTrue(this.player.stopPlaying.calledOnce);
        assertTrue(this.timer.stopCountdown.calledOnce);
        assertEquals("", this.$view[0].className);
    }
});