export class SoundIntensity {

    constructor($view) {
        this.$view = $view;
        this.volumeLevels = 6;
        this.audioContext = null;
        this.audioStream = null;
        this.interval = null;
    }

    openStream(stream) {
        this.audioContext = new AudioContext();
        this.audioStream = this.audioContext.createMediaStreamSource(stream);

        let analyser = this._createAnalyser(this.audioContext);
        this.audioStream.connect(analyser);

        this.interval = setInterval(() => this._updateIntensity(analyser), 200);
    }

    closeStream() {
        clearInterval(this.interval);
        this._clearIntensity();

        this.audioStream.disconnect();
        this.audioContext.close();
    }

    destroy(){
        if(this.audioStream)
            this.closeStream();
        this.interval = null;
        this.$view.remove();
        this.$view = null;
        this.audioContext = null;
        this.audioStream = null;
    }

    _updateIntensity(analyser) {
        let frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyArray);
        let avgVolume = this._calculateAvgVolume(frequencyArray);
        let alignedVolume = this._alignVolume(avgVolume);
        let intensity = alignedVolume * this.volumeLevels;

        this._setIntensity(intensity);
    }

    _createAnalyser(audioContext) {
        let analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.3;
        return analyser;
    }

    _calculateAvgVolume(volumeArray) {
        let sum = 0;
        for (let i of volumeArray)
            sum += i;
        return sum / volumeArray.length;
    }

    _alignVolume(volume) {
        volume = volume > 0 ? volume : 0;
        volume = volume < 64 ? volume : 64;
        return volume / 64;
    }

    _setIntensity(intensity) {
        this._clearIntensity();
        for (let currentLevel = 1; currentLevel <= intensity; currentLevel++) {
            let levelId = "#sound-intensity-" + currentLevel;
            let $level = this.$view.find(levelId);
            $level.addClass("selected");
        }
    }

    _clearIntensity() {
        for (let currentLevel = 1; currentLevel <= this.volumeLevels; currentLevel++) {
            let levelId = "#sound-intensity-" + currentLevel;
            let $level = this.$view.find(levelId);
            $level.removeClass("selected");
        }
    }
}