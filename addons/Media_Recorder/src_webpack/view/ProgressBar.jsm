import {CSS_CLASSES} from "./CssClasses.jsm";

export class ProgressBar {

    constructor($view) {
        this.$view = $view;
        this.progress = 0.0;
        this.$slider = $view.find("." + CSS_CLASSES.PROGRESS_BAR_SLIDER);
        this.maxWidth = $view[0].offsetWidth - this.$slider[0].offsetWidth;
        var self = this;
        this.$slider.draggable({
            axis: "x",
            containment: "parent",
            start: function( event, ui ) {
                self._startDragging();
            },
            stop: function( event, ui ) {
                self._stopDragging();
            }
        });
    }

    setProgress(progress) {
        this.progress = progress;
        if (this.progress > 1.0) this.progress = 1.0;
        if (this.progress < 0.0) this.progress = 0.0;
        this._updateView();
    }

    reset() {
        this.setProgress(0.0);
    }

    _updateView() {
        this._updateMaxWidth();
        var left = Math.round(this.maxWidth * this.progress);
        this.$slider.css('left', left + 'px');
    }

    _updateMaxWidth() {
        if (this.maxWidth === 0) {
            this.maxWidth = this.$view[0].offsetWidth - this.$slider[0].offsetWidth;
        }
    }

    _startDragging() {
        if (this.onStartDraggingCallback) {
            this.onStartDraggingCallback();
        }
    }

    _stopDragging() {
        if (this.onStopDraggingCallback) {
            this._updateMaxWidth();
            this.progress = this.$slider[0].offsetLeft / this.maxWidth;
            this.onStopDraggingCallback(this.progress);
        }
    }

    set onStartDragging(callback) {
        this.onStartDraggingCallback = callback;
    }

    set onStopDragging(callback) {
        this.onStopDraggingCallback = callback;
    }

}