export class MediaResources {

    constructor() {
        if (this.constructor === MediaResources)
            throw new Error("Cannot create an instance of MediaResources abstract class");

        this.stream = null;
    }

    getMediaResources(callback) {
        navigator.mediaDevices.getUserMedia(this._getOptions())
            .then(stream => {
                this.stream = stream;
                callback(stream)
            })
            .catch(error => console.error(error));
    }

    destroy() {
        if (this.stream) {
            this.stream.stop();
            this.stream = null;
        }
    }

    _getOptions() {
        throw new Error("GetOptions accessor is not implemented");
    }
}