/**
 * @module commons
 */

(function (window) {

    window.MutationObserverService = {
        observer: null,
        callbacks: [],

        createObserver: function createObserver(destroyCallback, callbackParam) {
            var _this = this;
            if (this.observer) {
                this.callbacks.push({callback: destroyCallback, param: callbackParam});
            } else {
                this.callbacks.push({callback: destroyCallback, param: callbackParam});
                this.observer = new MutationObserver(function (records) {
                    records.forEach(function (record) {
                        if (record.removedNodes.length) {
                            _this.runCallback();
                        }

                        if (!_this.callbacks.length) {
                            _this.disconnectObserver();
                        }
                    });
                });
            }
        },

        setObserver: function setObserver() {
            var config = {attributes: true, childList: true};
            this.observer.observe($('.ic_page').get(0), config);
        },

        disconnectObserver: function disconnectObserver() {
            this.observer.disconnect();
        },

        runCallback: function runCallback() {
            if (!this.callbacks.length) { return; }

            var callbackObject = this.callbacks.shift();
            var event = this.getMockedEvent(callbackObject['param']);
            var callbackFunction = callbackObject['callback'];
            try {
                callbackFunction(event);
            } catch (e) { }
        },

        getMockedEvent: function getMockedEvent(data) {
            return {target: data};
        }
    };
})(window);
