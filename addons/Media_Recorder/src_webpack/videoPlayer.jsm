export class VideoPlayer {

    constructor($view) {
        this.$view = $view;

        this.$view.css("background-color", "black");
        this.mediaNode = document.createElement("video");
        this.mediaNode.controls = false;
        this.mediaNode.style.display = "visible";
        this.$view.append(this.mediaNode);

        this.onStartPlaying = stream => {};
        this.onStopPlaying = () => {};
        this.onDurationChange = duration => {};
        this.onEndedPlaying = () => {};
        this.onStartLoading = () => {};
        this.onEndLoading = () => {};

        this._enableEventsHandling();
    }

    startPlaying() {
        this.mediaNode.play();
        this.onStartPlaying(this.mediaNode.captureStream());
    }

    stopPlaying() {
        this.mediaNode.pause();
        this.mediaNode.currentTime = 0;
        this.mediaNode.muted = false;
        this.onStopPlaying();
    }

    setRecording(source) {
        this.mediaNode.src = source;
    }

    startStreaming(stream) {
        this._disableEventsHandling();
        setSrcObject(stream, this.mediaNode);
        this.mediaNode.muted = true;
        this.mediaNode.play();
    }

    stopStreaming() {
        this.stopPlaying();
        this._enableEventsHandling();
    }

    _enableEventsHandling(){
        let self = this;

        this.mediaNode.ondurationchange = () => {
            // faster resolution then
            // this.mediaNode.ondurationchange = () => callback(this.mediaNode.duration)
            let playerMock = new Audio(this.mediaNode.src);
            playerMock.addEventListener("durationchange", function () {
                if (this.duration != Infinity) {
                    self.onDurationChange(this.duration);
                    playerMock.remove();
                }
            }, false);
            playerMock.load();
            playerMock.currentTime = 24 * 60 * 60; // fake big time
            playerMock.volume = 0;
        };

        this.mediaNode.onended = () => this.onEndedPlaying();
        this.mediaNode.onloadstart = () => this.onStartLoading();
        this.mediaNode.oncanplay = () => this.onEndLoading();
    }

    _disableEventsHandling(){
        this.mediaNode.ondurationchange = () => {};
        this.mediaNode.onended = () => {};
        this.mediaNode.onloadstart = () => {};
        this.mediaNode.oncanplay = () => {};
    }
}