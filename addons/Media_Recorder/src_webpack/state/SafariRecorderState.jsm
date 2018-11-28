export class SafariRecorderState {

    values = {
        UNAVAILABLE_RESOURCES: 0,
        AVAILABLE_RESOURCES: 1
    };

    constructor() {
        this._value = this.values.UNAVAILABLE_RESOURCES;
    };

    isUnavailableResources() {
        return this._value === this.values.UNAVAILABLE_RESOURCES;
    }

    isAvailableResources() {
        return this._value === this.values.AVAILABLE_RESOURCES;
    }

    setUnavailableResources() {
        this._value = this.values.UNAVAILABLE_RESOURCES;
    }

    setAvailableResources() {
        this._value = this.values.AVAILABLE_RESOURCES;
    }

    destroy() {
        this._value = null;
        this.values = null;
    }
}