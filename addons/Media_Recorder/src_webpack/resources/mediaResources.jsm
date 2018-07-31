export class MediaResources {

    constructor() {
        if (this.constructor === MediaResources)
            throw new Error("Cannot create an instance of MediaResources abstract class");
    }

    getMediaResources(callback) {
        navigator.mediaDevices.getUserMedia(this._getOptions())
            .then(stream => callback(stream))
            .catch(error => console.error(error));
    }

    _getOptions() {
        throw new Error("GetOptions accessor is not implemented");
    }
}