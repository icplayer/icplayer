/**
 * @module commons
 */

(function (window) {

    window.MutationObserverService = {
        observer: null,
        callbacks: [],

        createDestroyObserver: function createDestroyObserver(moduleId, destroyCallback, callbackParam) {
            var _this = this;
            if (this.observer) {
                this.addCallback(moduleId, destroyCallback, callbackParam);
            } else {
                this.addCallback(moduleId, destroyCallback, callbackParam);
                this.observer = new MutationObserver(function (records) {
                    records.forEach(function (record) {
                        if (record.removedNodes.length) {
                            var id = $(record.removedNodes[0]).attr('id');
                            _this.runCallback(id);
                        }

                        if (!_this.callbacks.length) {
                            _this.disconnectObserver();
                        }
                    });
                });
            }
        },

        addCallback: function addCallback(moduleId, destroyCallback, callbackParam) {
            if (moduleId) {
                this.callbacks.push({moduleId: moduleId, callback: destroyCallback, param: callbackParam});
            }
        },

        setObserver: function setObserver() {
            var parentClassName = this.getClassName();
            if (parentClassName == null) return;
            var config = {attributes: true, childList: true};
            if (parentClassName.includes('ic_header')) {
                this.observer.observe($('.ic_header').get(0), config);
            } else if (parentClassName.includes('ic_footer')) {
                this.observer.observe($('.ic_footer').get(0), config);
            } else {
                this.observer.observe($('.ic_page').get(0), config);
            }
        },

        getClassName: function getClassName() {
            var view = this.getLastAddedView();
            if (view == null) return null;
            return $(this.getLastAddedView()).parent().attr('class');
        },

        getLastAddedView: function getLastAddedView() {
            if (this.callbacks.length == 0) return null;
            return this.callbacks[this.callbacks.length - 1]['param'];
        },

        disconnectObserver: function disconnectObserver() {
            this.observer.disconnect();
        },

        runCallback: function runCallback(id) {
            if (!this.callbacks.length) { return; }

            var objectIndex = this.getElementIndex(id);
            if (objectIndex < 0) { return; }

            var callbackObject = this.callbacks.splice(objectIndex, 1)[0];
            var event = this.getMockedEvent(callbackObject['param']);
            var callbackFunction = callbackObject['callback'];
            callbackFunction(event);
        },

        getElementIndex: function getElementIndex(id) {
            for(var i=0; i<this.callbacks.length; i++) {
                if (this.callbacks[i].moduleId === id) {
                    return i;
                }
            }

            return -1;
        },

        getMockedEvent: function getMockedEvent(data) {
            return {target: data};
        }
    };
})(window);
