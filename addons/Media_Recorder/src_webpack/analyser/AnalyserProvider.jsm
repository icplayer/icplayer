export class AnalyserProvider {

    static create(audioContext) {
        return this._createAnalyser(audioContext);
    }

    static _createAnalyser(audioContext) {
        let analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.3;
        return analyser;
    }
}
