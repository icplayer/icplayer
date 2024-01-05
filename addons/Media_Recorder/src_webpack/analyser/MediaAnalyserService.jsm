import {AnalyserProvider} from "./AnalyserProvider.jsm";

export class MediaAnalyserService {

    constructor() {
        this.audioContext = AudioContextSingleton.getOrCreate();
        this.mediaStreamSource = null;
        this.mediaElementSource = null;
    }

    createAnalyserFromStream(stream) {
        return new Promise(resolve => {
            // on Chrome when user hasn't interacted with the page before AudioContext was created it will be created in suspended state
            // this will happen if MediaRecorder is on the first page user visits (constructor call will happen before user interaction)
            // resume is then needed to unblock AudioContext (see https://goo.gl/7K7WLu)
            this.audioContext.resume().then(
                () => {
                    this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);

                    let analyser = AnalyserProvider.create(this.audioContext);
                    this.mediaStreamSource.connect(analyser);

                    resolve(analyser);
                }
            );
        })
    }

    createAnalyserFromElement(htmlMediaElement) {
        return new Promise(resolve => {
            // on Chrome when user hasn't interacted with the page before AudioContext was created it will be created in suspended state
            // this will happen if MediaRecorder is on the first page user visits (constructor call will happen before user interaction)
            // resume is then needed to unblock AudioContext (see https://goo.gl/7K7WLu)
            this.audioContext.resume().then(
                () => {
                    if (!this.mediaElementSource)
                        this.mediaElementSource = this.audioContext.createMediaElementSource(htmlMediaElement);

                    let analyser = AnalyserProvider.create(this.audioContext);
                    this.mediaElementSource.connect(analyser);
                    analyser.connect(this.audioContext.destination);

                    resolve(analyser);
                }
            );
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
        AudioContextSingleton.close();
        this.audioContext = null;
        this.mediaElementSource = null;
        this.mediaStreamSource = null;
    }
}