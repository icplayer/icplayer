export class Player {
    constructor() {
        if (this.constructor === Player)
            throw new Error("Cannot create an instance of abstract class");
    }
}