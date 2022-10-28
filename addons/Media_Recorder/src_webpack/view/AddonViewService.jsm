import {CSS_CLASSES} from "./CssClasses.jsm";

export class AddonViewService {

    constructor($wrapperView) {
        this.$view = $wrapperView;
    }

    setVisibility(isVisible){
        this.$view.css('visibility', isVisible ? 'visible' : 'hidden');
        this.$view.parent().css('visibility', isVisible ? 'visible' : 'hidden');
    }

    activate() {
        this.$view.removeClass(CSS_CLASSES.DISABLED);
    }

    deactivate() {
        this.$view.addClass(CSS_CLASSES.DISABLED);
    }

    destroy() {
        this.$view = null;
    }
}