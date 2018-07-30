export class Recorder {
    constructor() {
        if (this.constructor === Recorder)
            throw new Error("Cannot create an instance of abstract class");
    }
}