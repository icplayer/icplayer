export class VideoMediaMediator {
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

        this.player.onDurationChange = duration => {
            this.timer.duration = duration;
        };

        this.player.onPlay = videoNode => {
            let stream = videoNode.captureStream();
            this.soundIntensity.openStream(stream);
        };

        this.player.onStop = () => {
            this.soundIntensity.closeStream();
        }
    }
}