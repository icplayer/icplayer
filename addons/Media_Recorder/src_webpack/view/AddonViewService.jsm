export class AddonViewService {

    constructor($wrapperView) {
        this.$view = $wrapperView;
    }

    activate() {
        this.$view.removeClass("disabled");
    }

    deactivate() {
        this.$view.addClass("disabled");
    }

    destroy() {
        this.$view = null;
    }
}