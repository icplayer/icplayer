/**
 * @module commons
 */

(function (window) {

    window.MutationObserverSingleton = {
        observer: null,

        createObserver: function createObserver(destroyCallback, callbackParam) {
            var _this = this;
            this.observer = new MutationObserver(function (records) {
                records.forEach(function (record) {
                    if (record.removedNodes.length) {
                        destroyCallback(callbackParam);
                    }

                    if (record.target.childNodes.length === 0) {
                        _this.disconnectObserver();
                    }
                });
            });
        },

        setObserver: function setObserver() {
            var config = {attributes: true, childList: true};
            this.observer.observe($('.ic_page').get(0), config);
        },

        disconnectObserver: function disconnectObserver() {
            this.observer.disconnect();
        }
    };
})(window);
