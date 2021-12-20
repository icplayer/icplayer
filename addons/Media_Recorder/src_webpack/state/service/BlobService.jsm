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

    static getMp3FromArrayBuffer(wavArrayBuffer) {
        var wav = lamejs.WavHeader.readHeader(new DataView(wavArrayBuffer));
        var sampleLen = wav.dataLen / 2;
        var left = new Int16Array(wavArrayBuffer, wav.dataOffset, sampleLen);
        var right = new Int16Array(wavArrayBuffer, wav.dataOffset, sampleLen);

        return this._encode(wav.channels, wav.sampleRate, sampleLen, left, right);
    }

    static _encode(channels, sampleRate, sampleLen, left, right) {
        var buffer = [];
        var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate * 2, 128);

        var maxSamples = 1152;
        for (var i = 0; i < sampleLen; i += maxSamples) {
            var leftChunk = left.subarray(i, i + maxSamples);
            var rightChunk = right.subarray(i, i + maxSamples);
            
            var mp3buf = mp3enc.encodeBuffer(leftChunk, rightChunk);
            if (mp3buf.length > 0) {
                buffer.push(new Int8Array(mp3buf));
            }
        }
        var d = mp3enc.flush();
        if(d.length > 0){
            buffer.push(new Int8Array(d));
        }

        var blob = new Blob(buffer, {type: 'audio/mp3'});
        return blob;
    }
}