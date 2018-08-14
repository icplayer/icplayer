export class AssetService {

    constructor(playerController, recordingState) {
        this.playerController = playerController;
        this.recordingState = recordingState;
    }

    storeAsset(blob) {
        let reader = new FileReader();
        reader.onloadend = () => this.recordingState.setMediaSource(reader.result);
        reader.readAsDataURL(blob);
    }

    loadAsset() {
        let mediaSource = this.recordingState.getMediaSource();
        if (mediaSource) {
            let mediaSourceData = mediaSource.split(",");
            let recording = mediaSourceData[1];
            let contentType = mediaSourceData[0].replace(";base64","").replace("data:", "");
            return this._b64toBlob(recording, contentType);
        }
    }

    _b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        let byteCharacters = atob(b64Data);
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }
}