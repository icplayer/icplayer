export class ResetDialog {

    constructor($view) {
        this.$view = $view;
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
        this.$view.draggable({});
        var self = this;
        this.$view.find('.confirm-button').click(function(){
            self.close();
            if (self.onConfirmCallback) self.onConfirmCallback();
        });
        this.$view.find('.deny-button').click(function(){
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