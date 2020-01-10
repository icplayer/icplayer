export class Button {

    constructor($view) {
        if (this.constructor === Button)
            throw new Error("Cannot create an instance of BasePlayer abstract class");

        this.$view = $view;
        this.$view.css("z-index", "100");
    }

    activate() {
        this.$view.click(() => this._eventHandler());
    }

    deactivate() {
        this.$view.unbind();
    }

    forceClick() {
        this.$view.click();
    }

    destroy() {
        this.deactivate();
        this.$view.remove();
        this.$view = null;
    }

    _eventHandler() {
        throw new Error("EventHandler accessor is not implemented");
    }
}