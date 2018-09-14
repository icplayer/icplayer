export class ActivationState {

    values = {
        ACTIVE: 0,
        INACTIVE: 1
    };

    constructor() {
        this._value = this.values.ACTIVE;
    };

    isActive() {
        return this._value === this.values.ACTIVE;
    }

    isInactive() {
        return this._value === this.values.INACTIVE;
    }

    setActive() {
        this._value = this.values.ACTIVE;
    }

    setInactive() {
        this._value = this.values.INACTIVE;
    }

    destroy() {
        this.value = null;
        this.values = null;
    }
}