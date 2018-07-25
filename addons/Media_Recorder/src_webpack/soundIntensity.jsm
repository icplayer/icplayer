export class SoundIntensity {
    constructor($soundIntensity) {
        this.$soundIntensity = $soundIntensity;
        this.volumeLevels = 6;
        this.audioContext;
        this.audioStream;
        this.interval;
    }

    openStream(stream) {
        this.audioContext = new AudioContext();
        this.audioStream = this.audioContext.createMediaStreamSource(stream);

        let analyser = this.createAnalyser(this.audioContext);
        this.audioStream.connect(analyser);

        this.interval = setInterval(() => this.updateIntensity(analyser), 200);
    }

    closeStream() {
        clearInterval(this.interval);
        this.clearIntensity();

        this.audioStream.disconnect();
        this.audioContext.close();
    }

    updateIntensity(analyser) {
        let frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyArray);
        let avgVolume = this.calculateAvgVolume(frequencyArray);
        let alignedVolume = this.alignVolume(avgVolume);
        let intensity = alignedVolume * this.volumeLevels;

        this.setIntensity(intensity);
    }

    createAnalyser(audioContext) {
        let analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.3;
        return analyser;
    }

    calculateAvgVolume(volumeArray) {
        let sum = 0;
        for (let i of volumeArray)
            sum += i;
        return sum / volumeArray.length;
    }

    alignVolume(volume) {
        volume = volume > 0 ? volume : 0;
        volume = volume < 64 ? volume : 64;
        return volume / 64;
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