export class SoundIntensity {
    constructor($soundIntensity, recorder) {
        this.$soundIntensity = $soundIntensity;
        this.volumeLevels = 6;

        recorder.onAvailableResources = stream => {
            return;
            // todo

            window.persistAudioStream = stream;
            var audioContent = new AudioContext();
            var audioStream = audioContent.createMediaStreamSource(stream);
            var analyser = audioContent.createAnalyser();
            audioStream.connect(analyser);
            analyser.fftSize = 1024;
            var frequencyArray = new Uint8Array(analyser.frequencyBinCount);

            var self = this;

            setInterval(() => {
                analyser.getByteFrequencyData(frequencyArray);
                console.log(frequencyArray)
            }, 100);
        }
    }

    setIntensity(intensity) {
        this.clearIntensity();
        for (let currentLevel = 1; currentLevel <= intensity; currentLevel++) {
            let levelId = "#sound-intensity-" + currentLevel;
            let $level = this.$soundIntensity.find(levelId);
            $level.addClass("selected");
        }
    }

    clearIntensity() {
        for (let currentLevel = 1; currentLevel <= this.volumeLevels; currentLevel++) {
            let levelId = "#sound-intensity-" + currentLevel;
            let $level = this.$soundIntensity.find(levelId);
            $level.removeClass("selected");
        }
    }
}