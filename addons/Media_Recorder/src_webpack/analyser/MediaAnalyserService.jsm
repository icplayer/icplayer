import {AnalyserProvider} from "./AnalyserProvider.jsm";

export class MediaAnalyserService {

    constructor() {
        this.audioContext = new (AudioContext || webkitAudioContext)();
        this.mediaStreamSource = null;
        this.mediaElementSource = null;
    }

    createAnalyserFromStream(stream) {
        return new Promise(resolve => {
            this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);

            let analyser = AnalyserProvider.create(this.audioContext);
            this.mediaStreamSource.connect(analyser);

            resolve(analyser);
        })
    }

    createAnalyserFromElement(htmlMediaElement) {
        return new Promise(resolve => {
            if (!this.mediaElementSource)
                this.mediaElementSource = this.audioContext.createMediaElementSource(htmlMediaElement);

            let analyser = AnalyserProvider.create(this.audioContext);
            this.mediaElementSource.connect(analyser);
            analyser.connect(this.audioContext.destination);

            resolve(analyser);
        })
    }

    closeAnalyzing() {
        if (this.mediaStreamSource)
            this.mediaStreamSource.disconnect();
        if (this.mediaElementSource)
            this.mediaElementSource.disconnect();
    }

    destroy() {
        this.closeAnalyzing();
        this.audioContext.close();
        this.mediaElementSource = null;
        this.audioContext = null;
        this.mediaStreamSource = null;
    }
}