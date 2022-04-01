import {CSS_CLASSES} from "./CssClasses.jsm";

export class ResetDialog {

    constructor($view, resetDialogLabels) {
        this.$view = $view;
        this.labels = {
            text: resetDialogLabels['resetDialogText']['resetDialogLabel'],
            confirm: resetDialogLabels['resetDialogConfirm']['resetDialogLabel'],
            deny: resetDialogLabels['resetDialogDeny']['resetDialogLabel']
        }
        this._createView();
    }

    open() {
        this.$view.css('display','block');
        this.$view.css('left','');
        this.$view.css('top','');
    }

    close() {
        this.$view.css('display','none');
    }

    _createView() {
        this.$view.find("." + CSS_CLASSES.DIALOG_TEXT).text(this.labels.text);
        this.$view.find("." + CSS_CLASSES.CONFIRM_BUTTON).text(this.labels.confirm);
        this.$view.find("." + CSS_CLASSES.DENY_BUTTON).text(this.labels.deny);
        this.$view.draggable({});
        var self = this;
        this.$view.find("." + CSS_CLASSES.CONFIRM_BUTTON).click(function(){
            self.close();
            if (self.onConfirmCallback) self.onConfirmCallback();
        });
        this.$view.find("." + CSS_CLASSES.DENY_BUTTON).click(function(){
            self.close();
            if (self.onDenyCallback) self.onDenyCallback();
        });
    }

    set onConfirm(callback) {
        this.onConfirmCallback = callback;
    }

    set onDeny(callback) {
        this.onDenyCallback = callback;
    }
}