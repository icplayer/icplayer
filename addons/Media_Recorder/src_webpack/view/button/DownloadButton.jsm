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

        this.addonState.getMP3Blob()
            .then(mp3Blob => {
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
}