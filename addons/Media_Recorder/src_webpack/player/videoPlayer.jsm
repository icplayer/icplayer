import {Player} from "./player.jsm";

export class VideoPlayer extends Player {
    constructor($player) {
        super();
        this.$player = $player;

        this.$player.css("background-color", "#333333");
        this.videoNode = document.createElement("video");
        this.videoNode.controls = false;
        this.videoNode.style.display = "visible";
        this.$player.append(this.videoNode);
    }

    play() {
        this.videoNode.play();
        this.onPlayCallback(this.videoNode);
    }

    stop() {
        this.videoNode.pause();
        this.videoNode.currentTime = 0;
        this.videoNode.muted = false;
        this.onStopCallback();
    }

    set recording(source) {
        this.videoNode.src = source;
    }

    set onStartPlaying(callback){
        this.onPlayCallback = callback;
    }

    set onStopPlaying(callback){
        this.onStopCallback = callback;
    }

    set onEndedPlaying(callback){
        this.videoNode.onended = () => callback();
    }

    set onDurationChange(callback){
        this.videoNode.ondurationchange = () =>{
            // faster resolution then
            // this.videoNode.ondurationchange = () => callback(this.videoNode.duration)
            let playerMock = new Audio(this.videoNode.src);
            playerMock.addEventListener("durationchange", function (e) {
                if (this.duration != Infinity) {
                    callback(this.duration);
                    playerMock.remove();
                }
            }, false);
            playerMock.load();
            playerMock.currentTime = 24 * 60 * 60; // fake big time
            playerMock.volume = 0;
        }
    }

    set stream(stream) {
        setSrcObject(stream, this.videoNode);
        this.videoNode.muted = true;
        this.videoNode.play();
    }
}