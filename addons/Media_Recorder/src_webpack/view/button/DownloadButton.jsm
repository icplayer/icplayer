import {Button} from "./Button.jsm";

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
        element.setAttribute("download", "recording.webm");
        element.setAttribute("href", "#");
        var base64Recording = this.addonState.recording;
        function handleDownloadRecording() {
            var data = base64Recording;
            data = data.replace(/^data:audio\/[^;]*/, 'data:application/octet-stream');
            data = data.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=recording.webm');
            this.href = data;
        }
        element.onclick = handleDownloadRecording;
        element.click();
    }
}