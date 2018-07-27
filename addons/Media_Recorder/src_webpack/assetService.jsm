export class AssetService {
    constructor(playerController, state) {
        this.playerController = playerController;
        this.state = state;
    }

    storeAsset(blob) {
        this.playerController.storeAsset(blob, result => {
            if (result){
                let deserializedResult = JSON.parse(result);
                this.state.setMediaSource(deserializedResult.href);
            }
        })
    }
}