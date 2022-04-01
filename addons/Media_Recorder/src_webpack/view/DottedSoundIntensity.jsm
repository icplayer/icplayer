import {SoundIntensity} from "./SoundIntensity.jsm";
import {CSS_CLASSES} from "./CssClasses.jsm";

export class DottedSoundIntensity extends SoundIntensity {

    _setIntensity(intensity) {
        this._clearIntensity();
        var cappedIntensity = intensity;
        if (cappedIntensity > this.volumeLevels) cappedIntensity = this.volumeLevels;
        var heightPercent = cappedIntensity/this.volumeLevels;
        var heightDiff = heightPercent * (this.$view[0].offsetHeight-6);
        var tallDotNewHeight = Math.round(6 + heightDiff);
        var shortDotNewHeight = Math.round(6 + heightDiff/2);
        this.$view.find("." + CSS_CLASSES.TALL_DOT).css('height', tallDotNewHeight + 'px');
        this.$view.find("." + CSS_CLASSES.SHORT_DOT).css('height', shortDotNewHeight + 'px');
    }

    _clearIntensity() {
        this.$view.find("." + CSS_CLASSES.SOUND_INTENSITY_DOT).css('height', '');
    }
}