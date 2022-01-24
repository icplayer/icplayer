import {Button} from "./Button.jsm";
import {BlobService} from "../../state/service/BlobService.jsm";

export class DownloadButton extends Button {

    constructor({$view, addonState}) {
        super($view);
        this.addonState = addonState;
    }

    _eventHandler() {
        if (this.addonState.recording) {
            this.downloadRecording();
        }
    }

    downloadRecording() {
        var element = document.createElement("a");
        element.setAttribute("id", "dl");
        element.setAttribute("download", "recording.mp3");
        element.setAttribute("href", "#");

        this.addonState.getRecordingBlob()
            .then(blob => {
                File.prototype.arrayBuffer = File.prototype.arrayBuffer || this._fixArrayBuffer;
                Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || this._fixArrayBuffer;

                return blob.arrayBuffer();
            })
            .then(arrayBuffer => {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                var context = new AudioContext();
                return context.decodeAudioData(arrayBuffer);
            })
            .then(decodedData => {
                const mp3Blob = BlobService.getMp3BlobFromDecodedData(decodedData);
                return BlobService.serialize(mp3Blob);
            })
            .then(b64Recording => {
                function handleDownloadRecording() {
                    var data = b64Recording;            
                    data = data.replace(/^data:audio\/[^;]*/, 'data:application/octet-stream');
                    data = data.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=recording.mp3');
                    this.href = data;
                }
                element.onclick = handleDownloadRecording;
                element.click();
            });            
        
    }

    //for some reason there is a bug in some lower Safari versions <14, it cause arrayBuffer() undefined
    //https://gist.github.com/hanayashiki/8dac237671343e7f0b15de617b0051bd
    _fixArrayBuffer() {
        return new Promise((resolve) => {
            let fr = new FileReader();
            fr.onload = () => {
              resolve(fr.result);
            };
            fr.readAsArrayBuffer(this);
          });
    }
}