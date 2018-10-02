/**
 * @module commons
 */
(function (window) {
    /**
     @class BrowsersDevicesUtils
     */
    // Expose utils to the global object
    window.DevicesUtils = {
        isInternetExplorer: function () {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                return true;
            }
            return false;
        },
        isFirefox: function () {
            return ('netscape' in window) && / rv:/.test(navigator.userAgent);
        },
        isEdge: function () {
            return navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
        }
    }
})(window);