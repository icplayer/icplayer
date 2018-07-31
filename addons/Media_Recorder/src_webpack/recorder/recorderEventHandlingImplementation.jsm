export class RecorderEventHandlingImplementation {

    constructor(recorder, player, assetService) {
        this.recorder = recorder;
        this.player = player;
        this.assetService = assetService;
    }

    handleEvents() {
        this.recorder.onAvailableRecording = blob => {
            let recording = URL.createObjectURL(blob);
            this.player.setRecording(recording);
            this.assetService.storeAsset(blob);
        };
    }
}