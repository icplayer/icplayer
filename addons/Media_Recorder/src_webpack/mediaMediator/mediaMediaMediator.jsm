export class MediaMediator {
    constructor(player, recorder, timer, soundIntensity) {
        this.player = player;
        this.recorder = recorder;
        this.timer = timer;
        this.soundIntensity = soundIntensity;
    }

    runMediation() {
        this.recorder.onAvailableResources = stream => {
            this.player.stream = stream;
            this.soundIntensity.openStream(stream);
        };

        this.recorder.onAvailableRecording = blob => {
            let recording = URL.createObjectURL(blob);
            this.player.stop();
            this.player.recording = recording;
        };

        this.player.onStartPlaying = mediaNode => {
            let stream = mediaNode.captureStream();
            this.soundIntensity.openStream(stream);
        };

        this.player.onStopPlaying = () => {
            this.soundIntensity.closeStream();
        };

        this.player.onDurationChanged = duration => {
            this.timer.duration = duration;
        };
    }
}