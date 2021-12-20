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
                return blob.arrayBuffer();
            })
            .then(arrayBuffer => {
                const mp3Blob = BlobService.getMp3FromArrayBuffer(arrayBuffer);
                return BlobService.serialize(mp3Blob);
            })
            .then(b64Recording => {
                function handleDownloadRecording() {
                    var data = b64Recording;            
                    data = data.replace(/^data:audio\/[^;]*/, 'data:application/octet-stream');
                    data = data.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=recording.wav');
                    this.href = data;
                }
                element.onclick = handleDownloadRecording;
                element.click();
            });
    }
}