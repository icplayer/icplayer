export class LoadRecordingService {

    constructor(player, state) {
        this.player = player;
        this.state = state;
    }

    loadRecording(recording) {
        if (this._isValid(recording)) {
            this.state.setLoading();
            this.player.setRecording(recording);
        }
    }

    _isValid(recording) {
        return recording != "" && recording != null && typeof recording != "undefined";
    }
}