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
            return (navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Edg') !== -1) && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
        },
        getBrowserVersion: function () { // source: https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser // modified: 16.03.2021
            var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edg([e]?))\/(\d+)/);
                if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null && M[0] !== 'Chrome') M.splice(1, 1, tem[1]);
            return M.join(' ');
        }
    }
})(window);