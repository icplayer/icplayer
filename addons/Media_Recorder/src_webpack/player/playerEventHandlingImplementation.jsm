export class PlayerEventHandlingImplementation {

    constructor(player, soundIntensity, timer, playButton, state, $loaderView) {
        this.player = player;
        this.soundIntensity = soundIntensity;
        this.timer = timer;
        this.playButton = playButton;
        this.state = state;
        this.$loaderView = $loaderView;
    }

    handleEvents() {
        this.player.onStartPlaying = stream => {
            this.soundIntensity.openStream(stream);
        };

        this.player.onStopPlaying = () => {
            this.soundIntensity.closeStream();
        };

        this.player.onDurationChange = duration => {
            this.timer.setDuration(duration);
        };

        this.player.onEndedPlaying = () => {
            this.playButton.forceClick();
        };

        this.player.onStartLoading = () => {
            this.state.setLoading();
            this.$loaderView.removeClass("hidden");
        };

        this.player.onEndLoading = () => {
            this.state.setLoaded();
            this.$loaderView.addClass("hidden");
        };
    }
}