import {SoundIntensity} from "./SoundIntensity.jsm";

export class DottedSoundIntensity extends SoundIntensity {

    _setIntensity(intensity) {
        this._clearIntensity();
        var cappedIntensity = intensity;
        if (cappedIntensity > this.volumeLevels) cappedIntensity = this.volumeLevels;
        var heightPercent = cappedIntensity/this.volumeLevels;
        var heightDiff = heightPercent * (this.$view[0].offsetHeight-6);
        var tallDotNewHeight = Math.round(6 + heightDiff);
        var shortDotNewHeight = Math.round(6 + heightDiff/2);
        this.$view.find('.tall-dot').css('height', tallDotNewHeight + 'px');
        this.$view.find('.short-dot').css('height', shortDotNewHeight + 'px');
    }

    _clearIntensity() {
        this.$view.find('.sound-intensity-dot').css('height', '');
    }
}