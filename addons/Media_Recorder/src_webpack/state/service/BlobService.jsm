export class BlobService {

    static serialize(blob) {
        return new Promise(resolve => {
            let reader = new FileReader();
            if (blob instanceof Blob) {
                const realFileReader = reader._realReader;
                if (realFileReader) {
                    reader = realFileReader;
                }
            }
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

    static getMp3BlobFromDecodedDataByWorker(worker, decodedData) {
        const newSampleRate = 22050;
        const buffers = this.prepareSampleBuffers(decodedData);
        const left = this._interpolateArray(buffers[0], newSampleRate, decodedData.sampleRate);
        const right = this._interpolateArray(buffers[1], newSampleRate, decodedData.sampleRate);

        return worker.execute(decodedData.numberOfChannels, newSampleRate, decodedData.length, left, right);
    }

    static getMp3BlobFromDecodedData(decodedData) {       
        const newSampleRate = 22050;
        const buffers = this.prepareSampleBuffers(decodedData);
        const left = this._interpolateArray(buffers[0], newSampleRate, decodedData.sampleRate);
        const right = this._interpolateArray(buffers[1], newSampleRate, decodedData.sampleRate);

        return this._encode(decodedData.numberOfChannels, newSampleRate, decodedData.length, left, right);
    }

    static _interpolateArray(data, newSampleRate, oldSampleRate) {
        const fitCount = Math.round(data.length * (newSampleRate / oldSampleRate));
        const newData = new Int16Array(fitCount - 1);
        const springFactor = Number((data.length - 1) / (fitCount - 1));
        newData[0] = data[0];
        for (let i = 1; i < fitCount - 1; i++) {
            const tmp = i * springFactor;
            const before = Number(Math.floor(tmp)).toFixed();
            const after = Number(Math.ceil(tmp)).toFixed();
            const atPoint = tmp - before;
            newData[i] = this._linearInterpolate(data[before], data[after], atPoint);
        }
        newData[fitCount - 1] = data[data.length - 1];

        return newData;
    }

    static _linearInterpolate(before, after, atPoint) {
        return before + (after - before) * atPoint;
    }

    static prepareSampleBuffers(decodedData) {
        let left = this._convertFloat32ToInt16Array(decodedData.getChannelData(0));
        let right = left;
        if (decodedData.numberOfChannels === 2) {
            right = this._convertFloat32ToInt16Array(decodedData.getChannelData(1));
        }
        return [left, right];
    }

    static _encode(channels, sampleRate, sampleLen, left, right) {
        var buffer = [];
        var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 96); //third value determinate bitrate

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

        var blob = new Blob(buffer, {type: 'audio/mpeg-3'});
        return blob;
    }
    
    //lamejs require int16 array
    //see more at - https://github.com/zhuker/lamejs/issues/10#issuecomment-141718262
    static _convertFloat32ToInt16Array(data) {
        var len = data.length, i = 0;
        var dataAsInt16Array = new Int16Array(len);

        while(i < len) {
            dataAsInt16Array[i] = convert(data[i++]);
        }
        function convert(n) {
            var v = n < 0 ? n * 32768 : n * 32767;       // convert in range [-32768, 32767]
            return Math.max(-32768, Math.min(32768, v)); // clamp
        }
        return dataAsInt16Array;
    }
}