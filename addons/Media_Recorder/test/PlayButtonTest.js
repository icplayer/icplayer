TestCase("[Media Recorder] Play Button", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.$view = $('<div></div>');
        this.state = {
            setPlaying: sinon.stub(),
            setLoaded: sinon.stub()
        };

        this.playButton = new internalElements.PlayButton({$view: this.$view, state: this.state});
        this.playButton.onStartPlayingCallback = sinon.stub();
        this.playButton.onStopPlayingCallback = sinon.stub();
    },


    "test view has correct style when button is initialized": function () {
        let zIndexStyle = "100";

        assertEquals(zIndexStyle, this.$view[0].style.zIndex);
    },

    "test nothing happens when deactivated button has been triggered": function () {
        this.state.isLoaded = () => true;

        this.playButton.activate();
        this.playButton.deactivate();
        this.$view.trigger("click");

        assertTrue(this.playButton.onStartPlayingCallback.notCalled);
        assertTrue(this.playButton.onStopPlayingCallback.notCalled);
        assertEquals("", this.$view[0].className);
    },

    "test start playing when button has been triggered and media is loaded": function () {
        this.state.isLoaded = () => true;

        this.playButton.activate();
        this.$view.trigger("click");

        assertTrue(this.playButton.onStartPlayingCallback.calledOnce);
        assertTrue(this.playButton.onStopPlayingCallback.notCalled);
    },

    "test view style is correct when button has been triggered and media is loaded": function () {
        let styleClass = "selected";
        this.state.isLoaded = () => true;

        this.playButton.activate();
        this.$view.trigger("click");

        assertEquals(styleClass, this.$view[0].className);
    },

    "test stop playing when button has been triggered and media is playing": function () {
        this.state.isLoaded = () => false;
        this.state.isPlaying = () => true;

        this.playButton.activate();
        this.$view.trigger("click");

        assertTrue(this.playButton.onStartPlayingCallback.notCalled);
        assertTrue(this.playButton.onStopPlayingCallback.calledOnce);
    },

    "test view style is correct when button has been triggered and media is playing": function () {
        this.$view[0].className = "selected";
        this.state.isLoaded = () => false;
        this.state.isPlaying = () => true;

        this.playButton.activate();
        this.$view.trigger("click");

        assertEquals("", this.$view[0].className);
    }
});