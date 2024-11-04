export class MP3ConvertHandler {

    constructor(playerController) {
        this.worker = null;
        this.scriptURL = null;
        this.isValid = false;
        this.validationTimoutID = null;
        this.origin = document.location.origin;
        this.lameScriptURL = "";

        if (!this.isSupported()) {
            console.log('Your browser doesn\'t support web workers.');
            return;
        }
        let context = playerController.getContextMetadata();
        if (context != null) {
            if ("rootDirectory" in context) {
                this.origin = context["rootDirectory"];
            }
            if ("lameScriptURL" in context) {
                this.lameScriptURL = context["lameScriptURL"];
            }
        }

        let scriptBlob = this.createBlobWithScript();
        this.scriptURL = URL.createObjectURL(scriptBlob);
        this._validateScript();
    }

    isSupported() {
        return !!window.Worker;
    }

    isWorkerExist() {
        return !!this.worker;
    }

    _validateScript() {
        let self = this;
        return new Promise(resolve => {
            this.worker = new Worker(this.scriptURL);
            this.worker.onmessage = function(e) {
                if (e.data === "WORKER STARTED") {
                    self.isValid = true;
                    resolve(true);
                } else {
                    console.log('Error occurred for Web worker in Media Recorder: ' + e.data);
                    self.isValid = false;
                    resolve(false);
                }
            }
            this.worker.postMessage({
                cmd: "validate",
                origin: self.origin,
                lameScriptURL: self.lameScriptURL
            });
            this.validationTimoutID = setTimeout(() => {
                if (!self.isValid) {
                    console.log('Lib for web worker in Media Recorder is unreachable.');
                    self.isValid = false;
                    this.terminateWorkerProcess();
                    resolve(false);
                }
            }, 5000)
        })
    }

    execute(numberOfChannels, sampleRate, sampleLength, leftChannelData, rightChannelData) {
        return new Promise((resolve, reject) => {
            if (!this.isValid) {
                reject("Not valid worker");
            }
            if (this.isWorkerExist()) {
                this.terminateWorkerProcess();
            }
            this.worker = new Worker(this.scriptURL);
            this.worker.onmessage = function(e) {
                resolve(e.data);
            }
            this.worker.postMessage({
                cmd: "start",
                data: {
                    numberOfChannels: numberOfChannels,
                    sampleRate: sampleRate,
                    sampleLength: sampleLength,
                    leftChannelData: leftChannelData,
                    rightChannelData: rightChannelData
                },
                origin: this.origin,
                lameScriptURL: this.lameScriptURL
            });
        })
    }

    createBlobWithScript() {
        const script = `
            addEventListener("message", function(e) {
                let data = e.data;
                if (!data.origin) {
                    postMessage("Unknown origin");
                    return;
                }
                const lameScriptURL = data.lameScriptURL.length > 0 ? data.lameScriptURL : data.origin + "/media/icplayer/libs/lame.min.js";
                try {
                    importScripts(lameScriptURL);
                } catch (e) {
                    postMessage("Library lame.min.js is unreachable");
                    return;
                }

                switch (data.cmd) {
                    case "validate":
                        postMessage("WORKER STARTED");
                        break;
                    case "start":
                        postMessage(_encode(
                            data.data.numberOfChannels,
                            data.data.sampleRate,
                            data.data.sampleLength,
                            data.data.leftChannelData,
                            data.data.rightChannelData
                        ));
                        break;
                    default:
                        postMessage("Unknown command: " + data.cmd);
                };
            }, false);

            function _encode(channels, sampleRate, sampleLength, leftChannelData, rightChannelData) {
                let buffer = [];
                let mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 96); //third value determinate bitrate

                const maxSamples = 1152;
                for (let i = 0; i < sampleLength; i += maxSamples) {
                    let leftChunk = leftChannelData.subarray(i, i + maxSamples);
                    let rightChunk = rightChannelData.subarray(i, i + maxSamples);

                    let mp3buf = mp3enc.encodeBuffer(leftChunk, rightChunk);
                    if (mp3buf.length > 0) {
                        buffer.push(new Int8Array(mp3buf));
                    }
                }
                let d = mp3enc.flush();
                if (d.length > 0){
                    buffer.push(new Int8Array(d));
                }

                return new Blob(buffer, {type: "audio/mpeg-3"});
            }
        `
        return new Blob([script], {type: 'application/javascript'});
    }

    destroy() {
        if (this.isWorkerExist()) {
            this.terminateWorkerProcess();
        }
        if (this.scriptURL) {
            URL.revokeObjectURL(this.scriptURL);
            this.scriptURL = null;
        }
        if (this.validationTimoutID) {
            clearTimeout(this.validationTimoutID);
            this.validationTimoutID = null;
        }
        this.isValid = false;
    }

    terminateWorkerProcess() {
        this.worker.terminate();
        this.worker = null;
    }
}
