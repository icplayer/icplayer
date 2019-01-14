export class AnalyserProvider {

    static create(audioContext) {
        if (DevicesUtils.isFirefox())
            return this._createForFirefox(audioContext);
        else
            return this._createForOther(audioContext);
    }

    static _createForFirefox(audioContext) {
        let analyser = this._createAnalyser(audioContext);
        analyser.connect(audioContext.destination);

        return analyser;
    }

    static _createForOther(audioContext) {
        return this._createAnalyser(audioContext);
    }

    static _createAnalyser(audioContext) {
        let analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.3;
        return analyser;
    }
}
