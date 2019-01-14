export class ResourcesProvider {

    RESOURCES_ERROR_MESSAGE = "Multimedia resources not available";

    constructor($view) {
        if (this.constructor === ResourcesProvider)
            throw new Error("Cannot create an instance of ResourcesProvider abstract class");

        this.$view = $view;
        this.stream = null;
    }

    getMediaResources() {
        return new Promise(resolve => {
            navigator.mediaDevices.getUserMedia(this._getOptions())
                .then(stream => {
                    this.stream = stream;
                    resolve(stream);
                })
                .catch(error => {
                    console.error(error);
                    DOMOperationsUtils.showErrorMessage(this.$view, [this.RESOURCES_ERROR_MESSAGE], "0")
                });
        });
    }

    getStream() {
        return this.stream;
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