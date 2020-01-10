export class Loader{

    constructor($view) {
        if (this.constructor === Loader)
            throw new Error("Cannot create an instance of Loader abstract class");

        this.$view = $view;
    }

    show(){
        throw new Error("Show method is not implemented");
    }

    hide(){
        throw new Error("Hide method is not implemented");
    }

    destroy(){
        this.$view.remove();
        this.$view = null;
    }
}