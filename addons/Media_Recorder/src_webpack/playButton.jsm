export class PlayButton {
    constructor($view, state, player, timer) {
        this.$view = $view;
        this.state = state;
        this.player = player;
        this.timer = timer;

        this.$view.css("z-index", "100");
    }

    activate() {
        this.$view.click(() => this._eventHandler());
    }

    deactivate() {
        this.$view.unbind();
    }

    forceClick() {
        this.$view.click();
    }

    destroy() {
        this.deactivate();
        this.$view.remove();
        this.$view = null;
        this.state = null;
        this.player = null;
        this.timer = null;
    }

    _eventHandler() {
        if (this.state.isLoaded())
            this._onStartPlaying();
        else if (this.state.isPlaying())
            this._onStopPlaying()
    }

    _onStartPlaying() {
        this.$view.addClass("selected");
        this.state.setPlaying();
        this.player.startPlaying();
        this.timer.startCountdown();
    }

    _onStopPlaying() {
        this.$view.removeClass("selected");
        this.state.setLoaded();
        this.player.stopPlaying();
        this.timer.stopCountdown();
    }
}