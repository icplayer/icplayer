export class PlayButton {

    constructor($button, state, timer, player) {
        this.$button = $button;
        this.state = state;
        this.timer = timer;
        this.player = player;
    }

    activate() {
        this.$button.click(event => this.eventHandler(event));
    }

    deactivate() {
        this.$button.unbind();
    }

    forceClick(){
        this.$button.click();
    }

    eventHandler(event) {
        if (this.state.isLoaded())
            this.onStartPlaying(event);
        else if (this.state.isPlaying())
            this.onStopPlaying(event)
    }

    onStartPlaying(event) {
        this.state.setPlaying();
        this.timer.startPlaying();
        this.player.play();
        $(event.target).addClass("selected");
    }

    onStopPlaying(event) {
        this.state.setLoaded();
        this.timer.stopPlaying();
        this.player.stop();
        $(event.target).removeClass("selected");
    }
}