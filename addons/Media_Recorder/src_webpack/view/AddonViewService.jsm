export class AddonViewService {

    constructor($wrapperView) {
        this.$view = $wrapperView;
    }

    setVisibility(isVisible){
        this.$view.css('visibility', isVisible ? 'visible' : 'hidden');
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