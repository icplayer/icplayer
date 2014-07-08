/**
 * @module commons
 */
(function (window) {
    /**
     Commands dispatching utils.
     @class MobileUtils
     */
        // Expose utils to the global object
    window.MobileUtils = {
        /**
         Recognizes if userAgent is mobile device
         @method isMobileUserAgent

         @return {Boolean} True if userAgent is mobile device
         */

        isMobileUserAgent: function(userAgent) {
            if (userAgent === undefined || !userAgent)
                return false;
            var mobile_agent = userAgent.match(/Android/i) ||
                userAgent.match(/BlackBerry/i) ||
                userAgent.match(/iPhone|iPad|iPod/i) ||
                userAgent.match(/IEMobile/i) ||
                userAgent.match(/Opera Mini/i);
            if (mobile_agent)
                return true;
            else
                return false;
        },

        isSafariMobile: function(userAgent) {
            if (userAgent === undefined || !userAgent)
                return false;
            var mobile_agent = userAgent.match(/iPhone|iPad|iPod/i);
            if (mobile_agent)
                return true;
            else
                return false;
        },

        isWindowsMobile: function(userAgent) {
            if (userAgent === undefined || !userAgent)
                return false;
            if (userAgent.msPointerEnabled)
                return true;
            return false;
        }

    }
})(window);