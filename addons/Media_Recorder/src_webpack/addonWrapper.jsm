export class AddonWrapper {

    constructor($view) {
        this.$view = $view;
    }

    activate() {
        this.$view.fadeTo(0, 1);
    }

    deactivate() {
        this.$view.fadeTo(0, 0.5);
    }

    destroy(){
        this.$view.remove();
        this.$view = null;
    }
}
