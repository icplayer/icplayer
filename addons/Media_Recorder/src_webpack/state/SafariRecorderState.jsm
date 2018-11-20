export class SafariRecorderState {

    values = {
        UNAVAILABLE_RESOURCES: 0,
        AVAILABLE_RESOURCES: 1
    };

    constructor() {
        this._value = this.values.UNAVAILABLE_RESOURCES;
    };

    isUnavaliableResources() {
        return this._value === this.values.UNAVAILABLE_RESOURCES;
    }

    isAvaliableResources() {
        return this._value === this.values.AVAILABLE_RESOURCES;
    }

    setUnavaliableResources() {
        this._value = this.values.UNAVAILABLE_RESOURCES;
    }

    setAvaliableResources() {
        this._value = this.values.AVAILABLE_RESOURCES;
    }

    destroy() {
        this._value = null;
        this.values = null;
    }
}