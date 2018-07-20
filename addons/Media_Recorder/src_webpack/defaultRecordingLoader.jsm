export class DefaultRecordingLoader {
    constructor(player, timer, state) {
        this.player = player;
        this.timer = timer;
        this.state = state;
    }

    isValid(recording) {
        return recording != "" && recording != null && typeof recording != "undefined";
    }

    loadDefaultRecording(recording) {
        if (this.isValid(recording)) {
            this.player.setRecording(recording);
            this.state.setLoaded();
        }
    }
}