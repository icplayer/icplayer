import {AudioPlayer} from "./AudioPlayer.jsm";

export class DefaultAudioPlayer extends AudioPlayer {

    constructor($view, isMlibro) {
        super($view, isMlibro);
        this.doneRecording = false;
    }

    setNotStartedRecordingStatus(){
        this.doneRecording = false;
    }

    setDoneRecordingStatus(){
        this.doneRecording = true;
    }

    stopPlaying() {
        return new Promise(resolve => {
            this.mediaNode.pause();
            if (this._isMobileSafari() && !this.doneRecording){
                this.mediaNode.load();
            } else {
                this.mediaNode.currentTime = 0;
            }
            if (this.onTimeUpdateCallback) {
                this._disableTimerEventsHandling();
            }
            resolve();
        });
    }
}