import {AnalyserProvider} from "./AnalyserProvider.jsm";

export class MediaAnalyser {

    constructor() {
        this.audioContext = null;
        this.source = null;
        this.mediaElementSource = null;
    }

    createAnalyserFromStream(stream) {
        return new Promise(resolve => {
            if (!this.audioContext)
                this.audioContext = new (AudioContext || webkitAudioContext)();
            this.source = this.audioContext.createMediaStreamSource(stream);

            let analyser = AnalyserProvider.create(this.audioContext);
            this.source.connect(analyser);

            resolve(analyser);
        })
    }

    createAnalyserFromElement(htmlMediaElement) {
        return new Promise(resolve => {
            if (!this.audioContext)
                this.audioContext = new (AudioContext || webkitAudioContext)();
            if (!this.mediaElementSource)
                this.mediaElementSource = this.audioContext.createMediaElementSource(htmlMediaElement);

            let analyser = AnalyserProvider.create(this.audioContext);
            this.mediaElementSource.connect(analyser);
            analyser.connect(this.audioContext.destination);

            resolve(analyser);
        })
    }

    closeAnalyzing() {
        if (this.source)
            this.source.disconnect();
        if (this.mediaElementSource)
            this.mediaElementSource.disconnect();
        // if (this.audioContext)
        //     this.audioContext.close();
    }

    destroy() {
        this.closeAnalyzing();
        this.mediaElementSource = null;
        this.audioContext = null;
        this.source = null;
    }
}