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
        // todo set timer
        this.player.setResources(recording);
        this.state.setLoaded();
        debugger;
    }
}