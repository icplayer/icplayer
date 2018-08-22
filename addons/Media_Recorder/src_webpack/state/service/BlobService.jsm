export class BlobService {

    static serialize(blob) {
        return new Promise(resolve => {
            let reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    static deserialize(base64Data) {
        let mediaSourceData = base64Data.split(",");
        let recording = mediaSourceData[1];
        let contentType = mediaSourceData[0].replace(";base64", "").replace("data:", "");
        return this._b64toBlob(recording, contentType);
    }

    static _b64toBlob(b64Data, contentType, sliceSize) {
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

        return new Blob(byteArrays, {type: contentType});
    }
}