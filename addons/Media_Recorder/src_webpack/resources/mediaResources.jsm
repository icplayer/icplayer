export class MediaResources {

    RESOURCES_ERROR_MESSAGE = "Multimedia resources not available";

    constructor($view) {
        if (this.constructor === MediaResources)
            throw new Error("Cannot create an instance of MediaResources abstract class");

        this.$view = $view;
        this.stream = null;
    }

    getMediaResources(callback) {
        navigator.mediaDevices.getUserMedia(this._getOptions())
            .then(stream => {
                this.stream = stream;
                callback(stream)
            })
            .catch(error => {
                console.error(error);
                DOMOperationsUtils.showErrorMessage(this.$view, [this.RESOURCES_ERROR_MESSAGE], "0")
            });
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