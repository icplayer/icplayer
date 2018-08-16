export class ActivationState {

    values = {
        ACTIVE: 0,
        INACTIVE: 1
    };

    constructor() {
        this.value = this.values.ACTIVE;
    };

    isActive() {
        return this.value === this.values.ACTIVE;
    }

    isInactive() {
        return this.value === this.values.INACTIVE;
    }

    setActive() {
        this.value = this.values.ACTIVE;
    }

    setInactive() {
        this.value = this.values.INACTIVE;
    }
}