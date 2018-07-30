export class VideoMediaResources {

    constructor() {
        this.options = {
            audio: true,
            video: true
        }
    }

    getMediaResources(callback) {
        navigator.mediaDevices.getUserMedia(this.options)
            .then(stream => callback(stream))
            .catch(error => console.error(error));
    }
}