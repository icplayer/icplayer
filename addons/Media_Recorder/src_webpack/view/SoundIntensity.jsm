export class SoundIntensity {

    constructor($view) {
        this.$view = $view;
        this.volumeLevels = 6;
        this.interval = null;
    }

    startAnalyzing(analyser) {
        this.interval = setInterval(() => this._updateIntensity(analyser), 100);
    }

    stopAnalyzing() {
        if (this.interval)
            clearInterval(this.interval);
        this._clearIntensity();
    }

    destroy() {
        this.stopAnalyzing();
        this.interval = null;
        this.$view.remove();
        this.$view = null;
    }

    _updateIntensity(analyser) {
        let frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyArray);
        let avgVolume = this._calculateAvgVolume(frequencyArray);
        let raisedVolume = this._raiseVolume(avgVolume);
        let alignedVolume = this._alignVolume(raisedVolume);
        let intensity = alignedVolume * this.volumeLevels;

        this._setIntensity(intensity);
    }

    _calculateAvgVolume(volumeArray) {
        let sum = 0;
        for (let i of volumeArray)
            sum += i;
        return sum / volumeArray.length;
    }

    _raiseVolume(volume) {
        return volume > 0
            ? volume * 1.2
            : volume;
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